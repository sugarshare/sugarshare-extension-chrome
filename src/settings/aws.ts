export default {
  // region: 'eu-west-1',
  cognito: {
    userPoolId: 'eu-west-1_ihVj52nz1',
    userPoolWebClientId: '3lkcuakhgh84nc90kv7qbiml3b',
    redirectSignIn: chrome?.identity?.getRedirectURL(),
  },
} as const;
