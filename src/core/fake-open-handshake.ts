/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2018 Mickael Jeanroy
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import {assign} from './common/assign';
import {factory} from './common/factory';

export const fakeOpenHandshakeFactory = factory(() => {
  /**
   * A fake Handshake for the open request.
   */
  class FakeOpenHandshake {
    private _ws: any;
    private _request: any;
    private _response: object;

    /**
     * Create the fake handshake request.
     *
     * @param {FakeWebSocket} ws The WebSocket.
     * @constructor
     */
    constructor(ws) {
      this._ws = ws;

      const scheme = ws._url.protocol === 'ws:' ? 'http' : 'https';
      const host = ws._url.host;
      const path = ws._url.pathname;
      const search = ws._url.search;

      this._response = null;
      this._request = {
        method: 'GET',
        url: `${scheme}://${host}${path}${search}`,
        headers: {
          'Upgrade': 'websocket',
          'Sec-WebSocket-Key': 'AQIDBAUGBwgJCgsMDQ4PEC==',
          'Sec-WebSocket-Version': '13',
        },
      };

      const protocols = ws._protocols.join(',');
      if (protocols) {
        this._request.headers['Sec-WebSocket-Protocol'] = protocols;
      }
    }

    /**
     * Get the request handshake URL.
     *
     * @return {string} The request URL.
     */
    get url() {
      return this._request.url;
    }

    /**
     * Get the request handshake method (for now, always returns `'GET'`).
     *
     * @return {string} The request method.
     */
    get method() {
      return this._request.method;
    }

    /**
     * Get the request handshake headers (containing for example the `Sec-WebSocket-Protocol` header).
     *
     * @return {Object} The headers dictionary.
     */
    get headers() {
      return this._request.headers;
    }

    /**
     * Get the handhake request.
     *
     * @return {Object} The request.
     */
    getRequest() {
      return this._request;
    }

    /**
     * Get the triggered handshake response, `null` until the response
     * has not been triggered.
     *
     * @return {Object} The handshake response.
     */
    getResponse() {
      return this._response;
    }

    /**
     * Trigger handshake response.
     *
     * @return {void}
     */
    respond() {
      this.respondWith({
        status: 101,
      });
    }

    /**
     * Trigger handshake response error with a default status of `500`.
     *
     * @param {number} status The handshake response status.
     * @return {void}
     */
    fail(status = 500) {
      if (status === 101) {
        throw new Error(
            'Cannot fail open handshake with status 101, use `respond` method instead.'
        );
      }

      this.respondWith({
        status,
      });
    }

    /**
     * Trigger handshake response, filled unkown field with
     * default values:
     * - Default status is `101`,
     * - Default headers are:
     *   - `Upgrade: websocket`
     *   - `Connection: Upgrade`
     *   - `Sec-WebSocket-Accept: [a given accept key]`
     *
     * @param {Object} response The handshake response.
     * @return {void}
     */
    respondWith(response = {}) {
      const responseStatus = response['status'];
      const responseHeaders = responseStatus !== 101 ? {} : {
        'Upgrade': 'websocket',
        'Connection': 'Upgrade',
        'Sec-WebSocket-Accept': 's3pPLMBiTxaQ9kYGzzhZRbK+xOo=',
      };

      this._triggerResponse(assign({}, response, {
        status: 101,
        headers: responseHeaders,
      }));
    }

    /**
     * Trigger the handshake response (note that if the handshake response has already been triggered,
     * this method will throw an error).
     *
     * @param {object} response The handshake response.
     * @return {void}
     */
    _triggerResponse(response) {
      if (this._isClosed()) {
        throw new Error(
            'Cannot trigger handshake response since the open handshake is already closed.'
        );
      }

      this._response = response;

      // If the handhsake response does not a return a status code strictly equals to 101, then it means
      // that the connection cannot be opened.
      // For example, it may return a redirect code (3XX) or a forbidden code (401, 403).
      // Note that the `WebSocket` protocol does not specify that a connection must be retried or that
      // redirect should be followed.
      if (response.status === 101) {
        this._ws._openConnection(response);
      } else {
        this._ws._failConnection(response);
      }
    }

    /**
     * Check if the handshake operation is closed, i.e if the response has already
     * been triggered.
     *
     * @return {boolean} `true` if the handshake response has been triggered, `false` otherwise.
     */
    _isClosed() {
      return this._response !== null;
    }
  }

  return FakeOpenHandshake;
});
