/// <reference types="chrome" />

import { Message, Callback } from './types';

export default function signout(message: Message, sendResponse: Callback) {
  // TODO
  // chrome.storage.sync.remove([message.storageKey], () => {
  //   sendResponse('Signed out');
  // });
  sendResponse(message.action);
}
