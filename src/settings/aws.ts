import project from './project';

export default {
  // region: 'eu-west-1',
  cognito: {
    userPoolId: 'eu-west-1_s1GTzjS1U',
    userPoolWebClientId: '2h2qmuj7b5svm94sbg09rcvuig',
    redirectSignIn: chrome?.identity?.getRedirectURL(),
  },
} as const;
