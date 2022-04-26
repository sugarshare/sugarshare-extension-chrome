/* eslint no-unused-vars: ["error", { "args": "none" }] */
export type Callback<T> = T extends void
  ? () => void
  : (value: T) => void;
