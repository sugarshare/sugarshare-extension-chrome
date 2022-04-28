import Rollbar, { Configuration as RollbarCOnfiguration } from 'rollbar';
import settings from 'settings';

const rollbarConfig: RollbarCOnfiguration = {
  accessToken: process.env.REACT_APP_ROLLBAR_ACCESS_TOKEN,
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
