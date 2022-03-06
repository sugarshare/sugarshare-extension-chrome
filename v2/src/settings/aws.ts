export default {
  region: 'eu-west-1',
  cognito: {
    userPoolId: '<userPoolId>',
    userPoolWebClientId: '<userPoolWebClientId>',
    identityPoolId: '<identityPoolId>',
    oauth: {
      // domain: 'sugarshare.auth.eu-west-1.amazoncognito.com',
      domain: 'auth.sugarshare.me',
      loginEndpoint: '/login',
      tokenEndpoint: '/oauth2/token',
      responseType: 'code',
      scope: ['openid', 'email', 'profile'].join(' '),
      redirectSignIn: chrome.identity.getRedirectURL(),
      redirectSignOut: chrome.identity.getRedirectURL(),
    },
  },
} as const;
