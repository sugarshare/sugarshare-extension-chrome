/// <reference types="chrome" />

import type { Message, Callback } from './types';
import Auth from 'libs/auth';
import log from 'libs/log';
import settings, { aws } from 'settings';

const AUTHENTICATION_URL = () => {
  const params = {
    redirect_uri: aws.cognito.redirectSignIn,
  };

  const url = new URL('/login', `https://${settings.siteDomainName}`);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));

  return url.href;
};

export default function authenticate(message: Message, sendResponse: Callback) {
  const url = AUTHENTICATION_URL();

  log.debug('Requesting hosted UI', {
    url,
    ...message,
  });

  chrome.identity.launchWebAuthFlow(
    {
      url,
      interactive: true,
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

      const params = new URL(responseUrl).searchParams;
      const accessToken = params.get('a');
      const idToken = params.get('i');
      const refreshToken = params.get('r');

      if (!accessToken || !idToken || !refreshToken) {
        // TODO
        log.error('Missing tokens');
        throw new Error('Missing tokens');
      }

      new Auth().set({
        accessToken,
        idToken,
        refreshToken,
      });
    },
  );
}
