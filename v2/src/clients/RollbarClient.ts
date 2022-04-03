import Rollbar, { Configuration as RollbarCOnfiguration } from 'rollbar';
import settings from 'settings';

const rollbarConfig: RollbarCOnfiguration = {
  accessToken: '<accessToken>',
  environment: settings.environment,
  enabled: true,
  autoInstrument: true,
  captureUsername: true,
  captureEmail: true,
  captureIp: true,
  captureUncaught: true,
  captureUnhandledRejections: true,
};

const RollbarClient = new Rollbar(rollbarConfig);

export default RollbarClient;
