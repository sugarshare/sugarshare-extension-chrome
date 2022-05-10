import {
  CognitoAccessToken,
  CognitoIdToken,
  CognitoRefreshToken,
  CognitoUser,
  CognitoUserPool,
  CognitoUserSession,
} from 'amazon-cognito-identity-js';

import log from './log';
import { aws } from '../settings';

interface TokenSet {
  accessToken: string;
  idToken: string;
  refreshToken?: string;
}

export class AuthenticationError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export default class Auth {
  private readonly storageKey: string;
  private isAuthed: boolean;
  private accessToken?: CognitoAccessToken;
  private idToken?: CognitoIdToken;
  private refreshToken?: CognitoRefreshToken;
  private session?: CognitoUserSession;
  private user?: CognitoUser;
  private userPool?: CognitoUserPool;

  constructor({ storageKey = 'sugarshare.authentication' } = {}) {
    this.storageKey = storageKey;
    this.isAuthed = false;
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
            return;
          }

          resolve(this.storageKey);
        },
      );
    });
  }

  /**
   * Assign tokens
   */
  private assign({ accessToken, idToken, refreshToken }: TokenSet) {
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

    this.isAuthed = true;
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
            return;
          }

          if (Object.keys(tokens ?? {}).length === 0) {
            // Note this error message is used for matching elsewhere
            reject(new AuthenticationError('Cannot find tokens in storage'));
            return;
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
      if (!this.refreshToken || !this.user) {
        resolve(false);
        return;
      }

      // Proactively refresh when tokens have a remaining validity period of 2 minutes
      // Reference: https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-using-the-refresh-token.html
      if (!this.isSessionExpired()) {
        resolve(true);
        return;
      }

      log.debug('Requesting a tokens refresh');

      this.user.refreshSession(
        this.refreshToken,
        async (error, session: CognitoUserSession) => {
          if (error) {
            // NotAuthorizedException: Refresh Token has expired
            reject(error);
            return;
          }

          this.session = session;
          this.accessToken = session.getAccessToken();
          this.idToken = session.getIdToken();

          const tokens: TokenSet = {
            accessToken: session.getAccessToken().getJwtToken(),
            idToken: session.getIdToken().getJwtToken(),
            refreshToken: session.getRefreshToken().getToken(),
          };
          await this.store(tokens);

          resolve(true);
        },
      );
    });
  }

  /**
   * Check if tokens are expired
   *
   * Tokens should be proactively refreshed when having a remaining validity period of 2 minutes
   * Reference: https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-using-the-refresh-token.html
   */
  public isSessionExpired() {
    if (!this.accessToken) {
      throw new AuthenticationError('Missing access token');
    }

    const TWO_MINUTES = 2 * 60;
    if (Date.now() < (this.accessToken.getExpiration() - TWO_MINUTES) * 1000) {
      return false;
    }

    return true;
  }

  /**
   * Return a JWT authorization token dynamically refreshed
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
    this.isAuthed = false;
    log.debug('User signed out');

    chrome.storage.sync.remove([this.storageKey], () => {
      log.debug('Removed stored tokens');
    });
  }

  get isAuthenticated() {
    return this.isAuthed;
  }

  get email() {
    if (!this.idToken) {
      throw new AuthenticationError('Missing ID token');
    }
    return this.idToken.payload.email;
  }
}
