import project from './project';

export default {
  region: 'eu-west-1',
  cognito: {
    userPoolId: 'eu-west-1_moMhmGiiW',
    userPoolWebClientId: 'mh81fe4s02g87iedt0pimthp4',
    identityPoolId: 'eu-west-1:1b171e76-e79a-4b1a-b04d-61af893e959f',
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
