/// <reference types="chrome" />

export {};

// TODO: Replace with the extension ID
const ID = /[a-z]{32}/;

// eslint-disable-next-line no-unused-vars
type Callback = (args: Record<string, unknown>) => void;

function listener(message: File, sender: chrome.runtime.MessageSender, sendResponse: Callback) {
  // Make sure the message is coming from the extension
  if (sender?.id?.match(ID)) {
    console.log(JSON.stringify(message));

    const response = { gotcha: 'dude' };
    sendResponse(response);
  }
}

chrome.runtime.onInstalled.addListener(() => {
  console.log('Installed');
});

chrome.runtime.onMessage.addListener(listener);

chrome.runtime.onSuspend.addListener(() => {
  console.log('Suspending');
});

chrome.runtime.onUpdateAvailable.addListener(() => {
  console.log('Update available');
});
