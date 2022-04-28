import project from './project';

export default {
  region: 'eu-west-1',
  cognito: {
    userPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID,
    userPoolWebClientId: process.env.REACT_APP_COGNITO_USER_POOL_CLIENT_ID,
    identityPoolId: process.env.REACT_APP_COGNITO_IDENTITY_POOL_ID,
    oauth: {
      // domain: 'sugarshare.auth.eu-west-1.amazoncognito.com',
      domain: project.authDomainName,
      loginEndpoint: '/login',
      tokenEndpoint: '/oauth2/token',
      responseType: 'code',
      scope: ['openid', 'email', 'profile'].join(' '),
      redirectSignIn: chrome?.identity?.getRedirectURL(),
      redirectSignOut: chrome?.identity?.getRedirectURL(),
    },
  },
} as const;
