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

/**
 * A fake Handshake for the open request.
 */
export class FakeOpenHandshake {
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
        'Sec-WebSocket-Key': '',
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
    this._response = {
      status: 101,
      headers: {
        'Upgrade': 'websocket',
        'Connection': 'Upgrade',
        'Sec-WebSocket-Accept': '',
      },
    };

    this._ws._openConnection(this._response);
  }
}
