import aws from './aws';

export { aws };
export default {
  projectName: 'sugarshare',
  decoratedProjectName: 'SugarShare',
  rootDomainName: 'sugarshare.me',
  siteDomainName: 'www.sugarshare.me',
  apiDomainName: 'api.sugarshare.me',
  authDomainName: aws.cognito.oauth.domain,
} as const;
