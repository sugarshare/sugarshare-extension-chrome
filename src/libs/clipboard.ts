import { Callback } from './types';

export default class Clipboard {
  public static copy(text: string, onSuccess?: Callback<void>, onFailure?: Callback<void>) {
    navigator.clipboard.writeText(text)
      .then(onSuccess)
      .catch(onFailure);
  }
}
