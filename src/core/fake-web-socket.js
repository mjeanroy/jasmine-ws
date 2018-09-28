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
 * The connection has not yet been established.
 * @type {number}
 */
const CONNECTING = 0;

/**
 * The WebSocket connection is established and communication is possible.
 * @type {string}
 */
const OPEN = 1;

/**
 * The connection is going through the closing handshake, or the close() method has been invoked.
 * @type {number}
 */
const CLOSING = 2;

/**
 * The connection has been closed or could not be opened.
 * @type {number}
 */
const CLOSED = 3;

/**
 * A Fake WebSocket implementation.
 * @class
 * @see https://html.spec.whatwg.org/multipage/web-sockets.html
 */
export class FakeWebSocket {
  /**
   * Creates a fake `WebSocket` object, immediately establishing a fake `WebSocket` connection.
   *
   * The `url` is a `string` giving the URL over which the connection is established. Only `"ws"` or `"wss"`
   * schemes are allowed; others will cause a "SyntaxError" DOMException. URLs with fragments will also
   * cause such an exception.
   *
   * The `protocols` argument is either a string or an array of strings. If it is a string, it is equivalent to an array
   * consisting of just that string; if it is omitted, it is equivalent to the empty array.
   * Each string in the array is a subprotocol name.
   *
   * The connection will only be established if the server reports that it has selected one of these subprotocols.
   * The subprotocol names have to match the requirements for elements that comprise the
   * value of `Sec-WebSocket-Protocol` fields as defined by the `WebSocket` protocol specification.
   *
   * @param {string} url The connection URL
   * @param {string|Array<string>} protocols The subprotocol names
   */
  constructor(url, protocols = []) {
    this._url = url;
    this._protocols = protocols;
  }

  /**
   * Returns the URL that was used to establish the `WebSocket` connection.
   *
   * @return {string} The URL.
   */
  get url() {
    return this._url;
  }

  /**
   * Transmits data using the `WebSocket` connection. data can be a `string`,
   * a `Blob`, an `ArrayBuffer`, or an `ArrayBufferView`.
   *
   * @return {void}
   */
  send() {
    // TODO
  }

  /**
   * Closes the `WebSocket` connection, optionally using code as the the WebSocket connection close code and
   * reason as the the WebSocket connection close reason.
   *
   * @return {void}
   */
  close() {
    // TODO
  }
}

FakeWebSocket.CONNECTING = CONNECTING;
FakeWebSocket.OPEN = OPEN;
FakeWebSocket.CLOSING = CLOSING;
FakeWebSocket.CLOSED = CLOSED;
