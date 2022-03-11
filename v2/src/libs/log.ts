// eslint-disable-next-line no-shadow
enum LogLevel {
  DEBUG = 0,
  INFO,
  WARN,
  ERROR,
}

export type Params = Record<string, unknown>;

const appendError = (params?: Params, error?: Error) => {
  if (!error) {
    return params;
  }

  return {

    ...params || {},
    name: error.name,
    message: error.message,
    stacktrace: error.stack,
  };
};

const log = (level: LogLevel, message: string, params?: Params) => {
  const logMessage = {
    ...params,
    level: LogLevel[level],
    message,
  };

  // TODO replace with telemetry logger
  console.log(JSON.stringify(logMessage));
};

export default {
  debug: (message: string, params?: Params): void => log(LogLevel.DEBUG, message, params),
  info: (message: string, params?: Params): void => log(LogLevel.INFO, message, params),
  warn: (
    message: string,
    params?: Params,
    error?: Error,
  ): void => log(LogLevel.WARN, message, appendError(params, error)),
  error: (
    message: string,
    params?: Params,
    error?: Error,
  ): void => log(LogLevel.ERROR, message, appendError(params, error)),
};
