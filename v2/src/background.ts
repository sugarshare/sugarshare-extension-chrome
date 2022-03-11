/// <reference types="chrome" />

import { authenticate, signout } from './libs/background';
import { Message, Callback } from './libs/background/types';

export {};

function messageListener(message: Message, sender: chrome.runtime.MessageSender, sendResponse: Callback) {
  if (
    (sender.id && sender.id !== chrome.runtime.id)
    || (sender.origin && sender.origin !== `chrome-extension://${chrome.runtime.id}`)
  ) {
    // TODO
    throw new Error(`Invalid sender ${sender.id ?? sender.origin}`);
  }

  if (message.action === 'authenticate') {
    authenticate(message, sendResponse);

    // Let runtime know the callback function is asynchronous and a response _could_ be sent asynchronously
    return true;
  }

  if (message.action === 'signout') {
    signout(message, sendResponse);
    return false;
  }

  return false;
}

chrome.runtime.onInstalled.addListener(() => {
  console.log('Installed');
});

chrome.runtime.onMessage.addListener(messageListener);

chrome.runtime.onSuspend.addListener(() => {
  console.log('Suspending');
});

chrome.runtime.onUpdateAvailable.addListener(() => {
  console.log('Update available');
});
