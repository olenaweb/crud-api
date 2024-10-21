import { IncomingMessage, ServerResponse } from 'http';
import { errMessages, headers, endpoint } from '../types';
import { usersDB } from './usersDB';
export class RequestManager {
  endpoint = endpoint;
  headers = headers;
  constructor() {
  }
}