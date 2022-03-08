// eslint-disable-next-line import/prefer-default-export
export class AuthenticationError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}
