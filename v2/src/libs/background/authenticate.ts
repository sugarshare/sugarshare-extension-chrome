/// <reference types="chrome" />

import log from '../log';
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

  log.debug('Requesting hosted UI', {
    url: cognitoHostedUIUrl.href,
    ...message,
  });

  chrome.identity.launchWebAuthFlow(
    {
      interactive: true,
      url: cognitoHostedUIUrl.href,
    },
    async (responseUrl?: string) => {
      if (!responseUrl) {
        // TODO
        log.error(chrome.runtime.lastError?.message ?? 'Error while launching web auth flow', { ...message });
        sendResponse('Could not authenticate');
        return;
      }

      log.debug('Got response URL', {
        responseUrl,
        ...message,
      });

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

        log.debug('Received auth tokens', { ...message });

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
        log.error('Failed to fetch authorization tokens', { ...message }, error as Error);
      }
    },
  );
}
