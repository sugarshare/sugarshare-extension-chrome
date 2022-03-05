/// <reference types="chrome" />

export {};

/* eslint no-unused-vars: ["error", { "args": "none" }] */
type Callback = (args: string | URL | Record<string, string>) => void;

const settings = {
  cognito: {
    // domain: 'sugarshare.auth.eu-west-1.amazoncognito.com',
    domain: 'auth.sugarshare.me',
    loginEndpoint: '/login',
    tokenEndpoint: '/oauth2/token',
    params: {
      client_id: 'mh81fe4s02g87iedt0pimthp4',
      response_type: 'code', // 'code' | 'token'
      scope: ['openid', 'email', 'profile'].join(' '),
      redirect_uri: chrome.identity.getRedirectURL(),
    },
  },
};

function random(size: number) {
  const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const buffer = new Uint8Array(size);

  if (typeof window !== 'undefined' && !!window.crypto) {
    window.crypto.getRandomValues(buffer);
  } else {
    for (let i = 0; i < size; i += 1) {
      // eslint-disable-next-line no-bitwise
      buffer[i] = (Math.random() * CHARSET.length) | 0;
    }
  }

  const state = [];
  for (let i = 0; i < buffer.byteLength; i += 1) {
    const index = buffer[i] % CHARSET.length;
    state.push(CHARSET[index]);
  }
  return state.join('');
}

function messageListener(message: string, sender: chrome.runtime.MessageSender, sendResponse: Callback) {
  if (
    (sender.id && sender.id !== chrome.runtime.id)
    || (sender.origin && sender.origin !== `chrome-extension://${chrome.runtime.id}`)
  ) {
    // TODO
    throw new Error(`Invalid sender ${sender.id ?? sender.origin}`);
  }

  if (message === 'authenticate') {
    const cognitoHostedUIUrl = new URL(settings.cognito.loginEndpoint, `https://${settings.cognito.domain}`);
    Object.entries(settings.cognito.params).forEach(([key, value]) => cognitoHostedUIUrl.searchParams.set(key, value));

    chrome.identity.launchWebAuthFlow(
      {
        interactive: true,
        url: cognitoHostedUIUrl.href,
      },
      async (responseUrl?: string) => {
        if (!responseUrl) {
          // TODO
          console.log(chrome.runtime.lastError);
          sendResponse('Could not authenticate');
          return;
        }

        const code = new URL(responseUrl).searchParams.get('code');
        if (!code) {
          // TODO
          throw new Error('Missing code authorization parameter');
        }

        const pkceKey = random(128);

        const oauthTokenBody = new URLSearchParams({
          code,
          grant_type: 'authorization_code',
          client_id: settings.cognito.params.client_id,
          redirect_uri: settings.cognito.params.redirect_uri,
          code_verifier: pkceKey,
          // TODO
          // state: '',
        });

        try {
          const {
            access_token: accessToken,
            id_token: idToken,
            refresh_token: refreshToken,
            // expires_in,
            // token_type,
          } = await (await fetch(
            new URL(settings.cognito.tokenEndpoint, `https://${settings.cognito.domain}`).href,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: oauthTokenBody,
            },
          )).json();

          chrome.storage.sync.set({
            'sugarshare-authorization': {
              accessToken,
              idToken,
              refreshToken,
              pkceKey,
            },
          });
        } catch (error) {
          // TODO
          console.error('Failed to fetch authorization tokens', error);
        }
      },
    );

    // Let runtime know the callback function is asynchronous and a response _could_ be sent asynchronously
    return true;
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
