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
import {factory} from './common/factory.js';
import {filter} from './common/filter.js';
import {find} from './common/find.js';
import {forEach} from './common/for-each.js';
import {has} from './common/has.js';
import {isArrayBuffer} from './common/is-array-buffer.js';
import {isBlob} from './common/is-blob.js';
import {isFunction} from './common/is-function.js';
import {isNull} from './common/is-null.js';
import {isString} from './common/is-string.js';
import {isUndefined} from './common/is-undefined.js';
import {parseUrl} from './common/parse-url.js';
import {tagName} from './common/tag-name.js';
import {toPairs} from './common/to-pairs.js';

import {fakeOpenHandshakeFactory} from './fake-open-handshake.js';
import {fakeCloseHandshakeFactory} from './fake-close-handshake.js';
import {fakeEventFactory} from './fake-event.js';
import {fakeCloseEventFactory} from './fake-close-event.js';
import {fakeMessageEventFactory} from './fake-message-event.js';

import {track} from './ws-tracker.js';

export const fakeWebSocketFactory = factory(() => {
  const FakeOpenHandshake = fakeOpenHandshakeFactory();
  const FakeCloseHandshake = fakeCloseHandshakeFactory();
  const FakeEvent = fakeEventFactory();
  const FakeCloseEvent = fakeCloseEventFactory();
  const FakeMessageEvent = fakeMessageEventFactory();

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
  class FakeWebSocket {
    /**
     * Creates a fake `WebSocket` object, immediately establishing a fake `WebSocket` connection.
     *
     * The `url` is a `string` giving the URL over which the connection is established. Only `"ws"` or `"wss"`
     * schemes are allowed; others will cause a "SyntaxError" DOMException. URLs with fragments will also
     * cause such an exception.
     *
     * The `protocols` argument is either a string or an array of strings. If it is a string, it is equivalent to
     * an a consisting of just that string; if it is omitted, it is equivalent to the empty array.
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
            `Failed to construct 'WebSocket': The URL's scheme must be either 'ws' or 'wss'. ` +
            `'${scheme}' is not allowed.`
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
      this._sentMessages = [];
      this._openHandshake = null;
      this._closeHandhsake = null;
      this._bufferedAmount = 0;
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
      return this._url.toString();
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
     * Returns the number of bytes of application data (UTF-8 text and binary data) that have been queued using `send()`
     * but not yet been transmitted to the network.
     *
     * If the WebSocket connection is closed, this attribute's value will only increase with each call to
     * the `send()` method. (The number does not reset to zero once the connection closes.)
     *
     * @return {number} The number of bytes of data not yet transmitted to the network.
     */
    get bufferedAmount() {
      return this._bufferedAmount;
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

      // Ensure the event phase is correct.
      event._eventPhase = FakeEvent.AT_TARGET;

      const methodName = `on${type}`;
      const method = this[methodName];
      if (isFunction(method)) {
        method.call(this, event);
      }

      if (!event._stopped) {
        forEach(listeners, (listener) => {
          if (!event._stopped) {
            this._executeListener(listener, event);
          }
        });
      }

      // Ensure the event phase is correct.
      event._eventPhase = FakeEvent.NONE;

      return !!event.cancelable && !!event.defaultPrevented;
    }

    /**
     * Execute the listener function (it it is a real `function`).
     * Note that error are catched and logged to the console.
     *
     * @param {function} listener The listener function.
     * @param {Object} event The event to dispatch.
     * @return {void}
     */
    _executeListener(listener, event) {
      try {
        if (isFunction(listener)) {
          listener.call(this, event);
        } else if (isFunction(listener.handleEvent)) {
          listener.handleEvent(event);
        }
      } catch (e) {
        console.error(e);
        console.error(e.stack);
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
     * The default `onerror` method, a no-op.
     * @return {void}
     */
    onerror() {
    }

    /**
     * Transmits data using the `WebSocket` connection.
     *
     * @param {*} data The string data to send.
     * @return {void}
     */
    send(data) {
      const nbArguments = arguments.length;
      if (nbArguments === 0) {
        throw new Error('Failed to execute \'send\' on \'WebSocket\': 1 argument required, but only 0 present.');
      }

      if (this._readyState === CONNECTING) {
        throw new Error('Failed to execute \'send\' on \'WebSocket\': Still in CONNECTING state.');
      }

      if (this._readyState === CLOSING || this._readyState === CLOSED) {
        throw new Error('WebSocket is already in CLOSING or CLOSED state.');
      }

      if (data !== '') {
        this._sentMessages.push(data);
      }
    }

    /**
     * Closes the `WebSocket` connection, optionally using code as the the WebSocket connection close code and
     * reason as the the WebSocket connection close reason.
     *
     * If the close code is not specified, a default value of 1005 is assumed.
     * The close `reason` is a `string` that must be no longer than 123 bytes of UTF-8 text (not characters).
     *
     * @param {number} code A numeric value indicating the status code explaining why the connection is being closed.
     * @param {string} reason A human-readable string explaining why the connection is closing.
     * @return {void}
     * @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/close
     * @see https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent#Status_codes
     * @see https://html.spec.whatwg.org/multipage/web-sockets.html#dom-websocket-close
     */
    close(code, reason) {
      // 1- If code is present, but is neither an integer equal to 1000 nor an integer in the range 3000 to 4999,
      // inclusive, throw an "InvalidAccessError" DOMException.
      if (!isUndefined(code)) {
        code = Number(code) || 0;

        if (code != 1000 && (code < 3000 || code > 4999)) {
          throw new Error(
              `Failed to execute 'close' on 'WebSocket': The code must be either 1000, or between 3000 and 4999. ` +
              `${code} is neither.`
          );
        }
      }

      // 2- If reason is present, then run these substeps:
      //  2-1 Let reasonBytes be the result of encoding reason.
      //  2-2 If reasonBytes is longer than 123 bytes, then throw a "SyntaxError" DOMException.
      code = isUndefined(code) ? 1005 : code;
      reason = isUndefined(reason) ? '' : String(reason);

      if (reason.length > 123) {
        throw new Error(
            `Failed to execute 'close' on 'WebSocket': The message must not be greater than 123 bytes.`
        );
      }

      // 3- Run the first matching steps from the following list:

      // 3-1 If the readyState attribute is in the CLOSING (2) or CLOSED (3) state
      // Do nothing.
      if (this._readyState === CLOSING || this._readyState === CLOSED) {
        return;
      }

      // 3-2 If the WebSocket connection is not yet established
      // Fail the WebSocket connection and set the readyState attribute's value to CLOSING.
      if (this._readyState === CONNECTING) {
        this._failConnection();
      }

      // 3-3 If the WebSocket closing handshake has not yet been started [WSP]
      if (!this._closeHandhsake) {
        this._closeHandhsake = new FakeCloseHandshake(this, code, reason, true);
      }

      this._readyState = CLOSING;
    }

    // The Fake WebSocket API

    /**
     * Establish connection by triggering a fake handshake.
     *
     * @return {void}
     */
    _establishConnection() {
      this._readyState = CONNECTING;
      this._protocol = '';
      this._extensions = '';
      this._openHandshake = new FakeOpenHandshake(this);
    }

    /**
     * Mark the WebSocket connection as opened and trigger appropriate listeners.
     *
     * @param {Object} response The HTTP handshake response.
     * @return {void}
     */
    _openConnection(response) {
      this._readyState = OPEN;

      const headers = response.headers;
      if (headers) {
        this._protocol = has(headers, 'Sec-WebSocket-Protocol') ? headers['Sec-WebSocket-Protocol'] : null;
        this._extensions = has(headers, 'Sec-WebSocket-Extensions') ? headers['Sec-WebSocket-Extensions'] : null;
      }

      this.dispatchEvent(new FakeEvent('open', this));
    }

    /**
     * Mark the websocket as closed and trigger appropriate listeners.
     *
     * @param {number} code A numeric value indicating the status code explaining why the connection is being closed.
     * @param {string} reason A human-readable string explaining why the connection is closing.
     * @param {boolean} wasClean A `boolean` that Indicates whether or not the connection was cleanly closed.
     * @return {void}
     */
    _doClose(code, reason, wasClean) {
      this._readyState = CLOSED;
      this.dispatchEvent(new FakeCloseEvent(this, code, reason, wasClean));
    }

    /**
     * Fail the `WebSocket` connection as described in the `WebSocket` protocol.
     *
     * @param {number} code The close status code, defaults to `1006`.
     * @param {string} reason The close reason message, defaults to an empty string.
     * @param {boolean} wasClean A flag indicating if the connection is closed cleanly, defaults to `false`.
     * @return {void}
     */
    _failConnection(code = 1006, reason = '', wasClean = false) {
      this._readyState = CLOSING;
      this._closeHandhsake = new FakeCloseHandshake(this, code, reason, false);
      this.dispatchEvent(new FakeEvent('error', this));
    }

    /**
     * The handshake request.
     *
     * @return {FakeOpenHandshake} The handshake request.
     */
    openHandshake() {
      return this._openHandshake;
    }

    /**
     * The handshake closing request.
     *
     * @return {FakeCloseHandshake} The close handshake.
     */
    closeHandshake() {
      return this._closeHandhsake;
    }

    /**
     * Get all sent messages.
     *
     * @return {Array<*>} All sent messages.
     */
    sentMessages() {
      return this._sentMessages.slice();
    }

    /**
     * Emit data and trigger appropriate listeners.
     *
     * @param {*} data Emitted data.
     * @return {void}
     * @see https://html.spec.whatwg.org/multipage/web-sockets.html#feedback-from-the-protocol
     */
    emitMessage(data) {
      if (isNull(data) || isUndefined(data)) {
        throw new Error(
            `Failed to receive message on 'WebSocket': The message is ${String(data)}.`
        );
      }

      if (!isString(data) && !isBlob(data) && !isArrayBuffer(data)) {
        throw new Error(
            `Failed to receive message on 'WebSocket': Only String, Blob or ArrayBuffer are allowed. ` +
            `The message is: ${tagName(data)}.`
        );
      }

      if (this._readyState !== OPEN) {
        throw new Error(
            `Failed to receive message on 'WebSocket': The websocket state must be OPEN.`
        );
      }

      this.dispatchEvent(new FakeMessageEvent(this, data));
    }

    /**
     * Emit a closing request (i.e an abnormal closure requested by the server).
     *
     * @param {number} code The close status code, defaults to `1006`.
     * @param {string} reason The close reason, defaults to an empty string.
     * @param {boolean} wasClean A flag indicating if the connection is closed cleanly, defaults to `false`.
     * @return {void}
     * @see https://tools.ietf.org/html/rfc6455#page-44
     */
    emitClose(code = 1006, reason = '', wasClean = false) {
      if (this._readyState === CLOSED) {
        throw new Error(
            'Cannot emit a close event, WebSocket is already closed.'
        );
      }

      if (this.readyState === CLOSING) {
        throw new Error(
            'Cannot emit a close event, WebSocket is already closing.'
        );
      }

      this._failConnection(code, reason, wasClean);
    }
  }

  FakeWebSocket.CONNECTING = CONNECTING;
  FakeWebSocket.OPEN = OPEN;
  FakeWebSocket.CLOSING = CLOSING;
  FakeWebSocket.CLOSED = CLOSED;

  return FakeWebSocket;
});
