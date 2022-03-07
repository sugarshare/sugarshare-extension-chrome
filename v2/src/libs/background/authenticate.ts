/// <reference types="chrome" />

import { aws } from '../../settings';
import { Message, Callback } from './types';

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

export default function authenticate(message: Message, sendResponse: Callback) {
  const params = {
    client_id: aws.cognito.userPoolWebClientId,
    response_type: aws.cognito.oauth.responseType,
    scope: aws.cognito.oauth.scope,
    redirect_uri: aws.cognito.oauth.redirectSignIn,
  };

  const cognitoHostedUIUrl = new URL(aws.cognito.oauth.loginEndpoint, `https://${aws.cognito.oauth.domain}`);
  Object.entries(params).forEach(([key, value]) => cognitoHostedUIUrl.searchParams.set(key, value));

  console.log(`Requesting hosted UI using URL ${cognitoHostedUIUrl.href}`, message);

  chrome.identity.launchWebAuthFlow(
    {
      interactive: true,
      url: cognitoHostedUIUrl.href,
    },
    async (responseUrl?: string) => {
      if (!responseUrl) {
        // TODO
        console.log(chrome.runtime.lastError, message);
        sendResponse('Could not authenticate');
        return;
      }

      console.log(`Got response URL ${responseUrl}`, message);

      const code = new URL(responseUrl).searchParams.get('code');
      if (!code) {
        // TODO
        throw new Error('Missing code authorization parameter');
      }

      const pkceKey = random(128);

      const oauthTokenBody = new URLSearchParams({
        code,
        grant_type: 'authorization_code',
        client_id: aws.cognito.userPoolWebClientId,
        redirect_uri: aws.cognito.oauth.redirectSignIn,
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
          new URL(aws.cognito.oauth.tokenEndpoint, `https://${aws.cognito.oauth.domain}`).href,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: oauthTokenBody,
          },
        )).json();

        console.log('Received auth tokens', {
          accessToken,
          idToken,
          refreshToken,
          pkceKey,
        }, message);

        chrome.storage.sync.set({
          [message.storageKey]: {
            accessToken,
            idToken,
            refreshToken,
            pkceKey,
          },
        });
      } catch (error) {
        // TODO
        console.error('Failed to fetch authorization tokens', error, message);
      }
    },
  );
}
