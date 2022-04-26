/* eslint no-unused-vars: ["error", { "args": "none" }] */
export type Callback = (args: string | URL | Record<string, string>) => void;

export type Message = {
  action: 'authenticate' | 'signout',
};
