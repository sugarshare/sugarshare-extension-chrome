/// <reference types="chrome" />

import Auth from '../auth';
import { Message, Callback } from './types';

export default function signout(message: Message, sendResponse: Callback) {
  new Auth().signOut();
  sendResponse('Signed out');
}
