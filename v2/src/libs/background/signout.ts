/// <reference types="chrome" />

import { Message, Callback } from './types';

export default function signout(message: Message, sendResponse: Callback) {
  chrome.storage.sync.remove([message.storageKey], () => {
    console.log(`Removed stored tokens at ${message.storageKey}`);
    sendResponse('Signed out');
  });

  sendResponse(message.action);
}
