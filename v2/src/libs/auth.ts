// import Amplify, { Auth, Hub } from 'aws-amplify';
// import { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth';

import {
  CognitoAccessToken,
  CognitoIdToken,
  CognitoRefreshToken,
  CognitoUser,
  CognitoUserPool,
  CognitoUserSession,
} from 'amazon-cognito-identity-js';

import log from './log';
import { AuthenticationError } from './errors';
import { aws } from '../settings';

// try {
//   Amplify.configure({
//     Auth: {
//       region: aws.region,
//       identityPoolId: aws.cognito.identityPoolId,
//       userPoolId: aws.cognito.userPoolId,
//       userPoolWebClientId: aws.cognito.userPoolWebClientId,
//       mandatorySignIn: true,

//       // // OPTIONAL - customized storage object
//       // storage: MyStorage,

//       // OPTIONAL - Manually set the authentication flow type. Default is 'USER_SRP_AUTH'
//       authenticationFlowType: 'USER_PASSWORD_AUTH',

//       oauth: {
//         domain: aws.cognito.oauth.domain,
//         // scope: aws.cognito.oauth.scope,
//         scope: aws.cognito.oauth.scope.split(' '),
//         redirectSignIn: aws.cognito.oauth.redirectSignIn,
//         redirectSignOut: aws.cognito.oauth.redirectSignOut,
//         responseType: aws.cognito.oauth.responseType,
//       },
//     },
//   });
// } catch (error) {
//   alert(error);
// }

interface TokenSet {
  accessToken: string;
  idToken: string;
  refreshToken?: string;
  pkceKey?: string;
}

export class AuthenticationError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export default class Auth {
  private readonly storageKey: string;
  private _isAuthenticated: boolean;
  private accessToken?: CognitoAccessToken;
  private idToken?: CognitoIdToken;
  private refreshToken?: CognitoRefreshToken;
  private session?: CognitoUserSession;
  private user?: CognitoUser;
  private userPool?: CognitoUserPool;

  constructor({ storageKey = 'sugarshare.authentication' } = {}) {
    this.storageKey = storageKey;
    this._isAuthenticated = false;
  }

  /**
   * Store tokens in storage
   */
  private async store(tokens: TokenSet): Promise<string> {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.set(
        { [this.storageKey]: tokens },
        () => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError?.message ?? 'Unknown error while storing tokens');
          }

          resolve(this.storageKey);
        },
      );
    });
  }

  /**
   * Refresh expired tokens if refresh token is available
   */
  private async refresh() {
    if (!this.accessToken) {
      throw new AuthenticationError('Missing access token');
    }

    try {
      // TODO
      alert(`${this.accessToken.getExpiration()} | ${Date.now()}`);
    } catch (error) {
      alert(error);
    }
  }

  /**
   * Assign tokens
   */
  private assign(tokens: TokenSet) {
    const { accessToken, idToken, refreshToken } = tokens;

    this.accessToken = new CognitoAccessToken({ AccessToken: accessToken });
    this.idToken = new CognitoIdToken({ IdToken: idToken });

    if (refreshToken) {
      this.refreshToken = new CognitoRefreshToken({ RefreshToken: refreshToken });
    }

    this.session = new CognitoUserSession({
      AccessToken: this.accessToken,
      IdToken: this.idToken,
      RefreshToken: this.refreshToken,
    });

    this.userPool = new CognitoUserPool({
      UserPoolId: aws.cognito.userPoolId,
      ClientId: aws.cognito.userPoolWebClientId,
      // Storage: TODO
    });

    this.user = new CognitoUser({
      // TODO get user name
      Username: this.idToken.payload['cognito:username'],
      Pool: this.userPool,
      // Storage: TODO
    });

    this.user.setSignInUserSession(this.session);

    this._isAuthenticated = true;
    log.debug('Tokens assigned from parameters');
  }

  /**
   * Load tokens from storage
   */
  public async load(): Promise<string> {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get(
        [this.storageKey],
        ({ [this.storageKey]: tokens }: { [key: string]: TokenSet }) => {
          if (chrome.runtime.lastError) {
            reject(new AuthenticationError(chrome.runtime.lastError?.message ?? 'Unknown error while loading tokens from storage'));
          }

          // TODO
          alert(JSON.stringify(tokens));

          if (Object.keys(tokens ?? {}).length === 0) {
            reject(new AuthenticationError('Cannot find tokens in storage'));
          }

          log.debug('Tokens loaded from storage');
          this.assign(tokens);

          resolve(this.storageKey);
        },
      );
    });
  }

  /**
   * Store and assign tokens
   */
  public async set(tokens: TokenSet) {
    await this.store(tokens);
    this.assign(tokens);

    log.debug('Tokens set from parameters');
  }

  /**
   * Refresh expired tokens if refresh token is available
   *
   * If refresh token is expired, return an error message that can be handled and a 'session expired' message can be displayed accordingly
   *
   * Reference: https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-using-the-refresh-token.html
   */
  private async refresh() {
    return new Promise((resolve, reject) => {
      if (!this.accessToken || !this.refreshToken || !this.user) {
        resolve(false);
        return;
      }

      // Proactively refresh when tokens have a remaining validity period of 2 minutes
      // Reference: https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-using-the-refresh-token.html
      if (Date.now() < (this.accessToken.getExpiration() - 2 * 60) * 1000) {
        resolve(true);
        return;
      }

      this.user.refreshSession(
        this.refreshToken,
        async (error, session: CognitoUserSession) => {
          if (error) {
            // TODO signout in case refresh token expired
            alert(error);
            reject(error);
          } else {
            this.session = session;
            this.accessToken = session.getAccessToken();
            this.idToken = session.getIdToken();

            const tokens: TokenSet = {
              accessToken: session.getAccessToken().getJwtToken(),
              idToken: session.getIdToken().getJwtToken(),
              refreshToken: session.getRefreshToken().getToken(),
              // pkceKey: it should be safe to erase it when overriding tokens
            };
            await this.store(tokens);

            resolve(true);
          }
        },
      );
    });
  }

  /**
   * Return a JWT access token dynamically refreshed
   */
  public async getAuthorizationToken() {
    if (!this.accessToken) {
      throw new AuthenticationError('Missing access token');
    }

    await this.refresh();
    return this.accessToken.getJwtToken();
  }

  /**
   * Sign out user and remove tokens from storage
   */
  public signOut() {
    this._isAuthenticated = false;
    log.debug('User signed out');

    chrome.storage.sync.remove([this.storageKey], () => {
      log.debug('Removed stored tokens');
    });
  }

  get isAuthenticated() {
    return this._isAuthenticated;
  }

  get username() {
    if (!this.idToken) {
      throw new AuthenticationError('Missing ID token');
    }
    // TODO get user name
    return this.idToken.payload['cognito:username'];
  }

  get email() {
    if (!this.idToken) {
      throw new AuthenticationError('Missing ID token');
    }
    return this.idToken.payload.email;
  }

  // static setListener() {
  //   AmplifyHub.listen('auth', ({ payload: { event, data } }) => {
  //     switch (event) {
  //       case 'signIn':
  //         console.log('user signed in', data);
  //         alert('user signed in');
  //         break;
  //       case 'signUp':
  //         console.log('user signed up', data);
  //         alert('user signed up');
  //         break;
  //       case 'signOut':
  //         console.log('user signed out', data);
  //         alert('user signed out');
  //         break;
  //       case 'signIn_failure':
  //         console.log('user sign in failed', data);
  //         alert('user sign in failed');
  //         break;
  //       case 'tokenRefresh':
  //         console.log('token refresh succeeded', data);
  //         alert('token refresh succeeded');
  //         break;
  //       case 'tokenRefresh_failure':
  //         console.log('token refresh failed', data);
  //         alert('token refresh failed');
  //         break;
  //       case 'configured':
  //         console.log('the Auth module is configured', data);
  //         alert('the Auth module is configured');
  //         break;
  //       default:
  //         break;
  //     }
  //   });
  // }
}

export function useAuth() {}
