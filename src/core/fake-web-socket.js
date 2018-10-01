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

import {countBy} from './common/count-by.js';
import {includes} from './common/includes.js';
import {indexOf} from './common/index-of.js';
import {filter} from './common/filter.js';
import {find} from './common/find.js';
import {forEach} from './common/for-each.js';
import {has} from './common/has.js';
import {isFunction} from './common/is-function.js';
import {isString} from './common/is-string.js';
import {parseUrl} from './common/parse-url.js';
import {toPairs} from './common/to-pairs.js';
import {FakeHandshake} from './fake-handshake.js';
import {track} from './ws-tracker.js';

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
    // 1- Let urlRecord be the result of applying the URL parser to url.
    const urlRecord = parseUrl(url);

    // 2- If urlRecord is failure, then throw a "SyntaxError" DOMException.
    if (urlRecord == null) {
      throw new SyntaxError(`Failed to construct 'WebSocket': The URL '${url}' is invalid.`);
    }

    // 3- If urlRecord's scheme is not "ws" or "wss", then throw a "SyntaxError" DOMException.
    const protocol = urlRecord.protocol;
    const scheme = protocol.slice(0, protocol.length - 1);
    if (scheme !== 'ws' && scheme !== 'wss') {
      throw new SyntaxError(
          `Failed to construct 'WebSocket': The URL's scheme must be either 'ws' or 'wss'. '${scheme}' is not allowed.`
      );
    }

    // 4- If urlRecord's fragment is non-null, then throw a "SyntaxError" DOMException.
    const fragment = urlRecord.hash;
    if (fragment) {
      throw new SyntaxError(
          `Failed to construct 'WebSocket': The URL contains a fragment identifier ('${fragment}'). ` +
          `Fragment identifiers are not allowed in WebSocket URLs.`
      );
    }

    // 5- If protocols is a string, set protocols to a sequence consisting of just that string.
    if (isString(protocols)) {
      protocols = [protocols];
    }

    // 6- If any of the values in protocols occur more than once or otherwise fail to match the requirements fo
    // elements that comprise the value of `Sec-WebSocket-Protocol` fields as defined by the WebSocket protocol
    // specification, then throw a "SyntaxError" DOMException.
    const subProtocols = filter(protocols, (protocol) => isString(protocol));
    const counters = countBy(subProtocols, (subProtocol) => subProtocol);
    const pairs = toPairs(counters);
    const firstDuplicate = find(pairs, (pair) => pair[1] > 1);
    if (firstDuplicate) {
      throw new SyntaxError(
          `Failed to construct 'WebSocket': The subprotocol '${firstDuplicate[0]}' is duplicated.`
      );
    }

    // 7- Run this step in parallel:

    // 7-1 Establish a WebSocket connection given urlRecord, protocols, and the entry settings object.
    this._binaryType = 'blob';
    this._url = urlRecord;
    this._protocols = protocols;
    this._listeners = {};
    this._establishConnection();

    // 8- Return a new WebSocket object whose url is urlRecord.

    // Track this `WebSocket``
    track(this);
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
   * Get the ready state value, i.e the state of the WebSocket object's connection.
   *
   * @return {number} The state value.
   */
  get readyState() {
    return this._readyState;
  }

  /**
   * Returns the subprotocol selected by the server, if any.
   * It can be used in conjunction with the array form of the constructor's second argument to perform
   * subprotocol negotiation.
   *
   * @return {string} The selected subprotocol.
   */
  get protocol() {
    return this._protocol;
  }

  /**
   * Returns the extensions selected by the server, if any.
   *
   * @return {string} The selected extensions.
   */
  get extensions() {
    return this._extensions;
  }

  /**
   * Returns a string that indicates how binary data from the WebSocket object is exposed to scripts:
   * - `"blob"`: Binary data is returned in Blob form.
   * - `"arraybuffer"`: Binary data is returned in ArrayBuffer form.
   *
   * @return {string} The binary type.
   */
  get binaryType() {
    return this._binaryType;
  }

  /**
   * Update the binary type value.
   *
   * @param {string} binaryType New binary type value.
   * @return {void}
   */
  set binaryType(binaryType) {
    this._binaryType = this.binaryType;
  }

  /**
   * Sets up a function that will be called whenever the specified event is delivered to the target.
   *
   * @param {string} event The event identifier.
   * @param {function} listener The listener function.
   * @return {void}
   */
  addEventListener(event, listener) {
    const nbArguments = arguments.length;

    if (nbArguments !== 2) {
      throw new TypeError(
          `Failed to execute 'addEventListener' on 'EventTarget': 2 arguments required, ` +
          `but only ${nbArguments} present.`
      );
    }

    if (!has(this._listeners, event)) {
      this._listeners[event] = [];
    }

    const listeners = this._listeners[event];

    if (!includes(listeners, listener)) {
      listeners.push(listener);
    }
  }

  /**
   * Removes from the  event listener previously registered with `addEventListener()`.
   *
   * @param {string} event The event name.
   * @param {function} listener The listener function.
   * @return {void}
   */
  removeEventListener(event, listener) {
    const nbArguments = arguments.length;

    if (nbArguments !== 2) {
      throw new TypeError(
          `Failed to execute 'removeEventListener' on 'EventTarget': 2 arguments required, ` +
          `but only ${nbArguments} present.`
      );
    }

    if (!has(this._listeners, event)) {
      return;
    }

    const listeners = this._listeners[event];
    const idx = indexOf(listeners, listener);
    if (idx >= 0) {
      listeners.splice(idx, 1);
    }
  }

  /**
   * Dispatches an Event at the specified EventTarget, (synchronously) invoking
   * the affected EventListeners in the appropriate order.
   *
   * @param {Event} event The event to dispatch.
   * @return {void}
   */
  dispatchEvent(event) {
    const type = event.type;
    const listeners = has(this._listeners, type) ? this._listeners[type] : [];

    forEach(listeners, (listener) => {
      if (isFunction(listener)) {
        listener.call(this, event);
      } else if (isFunction(listener.handleEvent)) {
        listener.handleEvent(event);
      }
    });

    if (isFunction(this.onopen)) {
      this.onopen(event);
    }
  }

  /**
   * The default `onopen` method, a no-op.
   * @return {void}
   */
  onopen() {
  }

  /**
   * The default `onmessage` method, a no-op.
   * @return {void}
   */
  onmessage() {
  }

  /**
   * The default `onclose` method, a no-op.
   * @return {void}
   */
  onclose() {
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

  /**
   * Establish connection by triggering a fake handshake.
   *
   * @return {void}
   */
  _establishConnection() {
    this._readyState = CONNECTING;
    this._protocol = '';
    this._extensions = '';
    this._handshake = new FakeHandshake(this);
  }

  // The Fake WebSocket API

  /**
   * The handshake request.
   *
   * @return {Object} The handshake request.
   */
  handshake() {
    return this._handshake;
  }
}

FakeWebSocket.CONNECTING = CONNECTING;
FakeWebSocket.OPEN = OPEN;
FakeWebSocket.CLOSING = CLOSING;
FakeWebSocket.CLOSED = CLOSED;
