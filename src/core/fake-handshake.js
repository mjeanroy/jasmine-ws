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
 * A fake Handshake request.
 */
export class FakeHandshake {
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

    this._method = 'GET';
    this._url = `${scheme}://${host}${path}${search}`;
    this._headers = {
      'Upgrade': 'websocket',
      'Sec-WebSocket-Key': '',
      'Sec-WebSocket-Version': '13',
    };

    const protocols = ws._protocols.join(',');
    if (protocols) {
      this._headers['Sec-WebSocket-Protocol'] = protocols;
    }
  }

  /**
   * Get the handhake request.
   *
   * @return {Object} The request.
   */
  getRequest() {
    return {
      method: this._method,
      url: this._url,
      headers: this._headers,
    };
  }
}
