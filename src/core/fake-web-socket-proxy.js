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

import {factory} from './common/factory.js';
import {flatten} from './common/flatten.js';
import {isArrayBuffer} from './common/is-array-buffer.js';
import {isString} from './common/is-string.js';
import {isBlob} from './common/is-blob.js';
import {isNull} from './common/is-null.js';
import {isUndefined} from './common/is-undefined.js';
import {tagName} from './common/tag-name.js';
import {values} from './common/values.js';

import {fakeMessageEventFactory} from './fake-message-event.js';
import {CONNECTING, OPEN, CLOSING, CLOSED} from './web-socket-state.js';

export const fakeWebSocketProxyFactory = factory(() => {
  const FakeMessageEvent = fakeMessageEventFactory();

  /**
   * The WebSocket Tracker.
   * @class
   */
  class FakeWebSocketProxy {
    /**
     * Create the `WebSocket` tracker instance.
     * @param {FakeWebSocket} ws The tracked `WebSocket`.
     */
    constructor(ws) {
      this._ws = ws;
    }

    /**
     * Returns the URL that was used to establish the `WebSocket` connection.
     *
     * @return {string} The URL.
     */
    get url() {
      return this._ws.url;
    }

    /**
     * Get the ready state value of the underlying `WebSocket` instance.
     *
     * @return {number} The state value.
     */
    get readyState() {
      return this._ws.readyState;
    }

    /**
     * Returns the subprotocol of the underlying `WebSocket` instance.
     *
     * @return {string} The selected subprotocol.
     */
    get protocol() {
      return this._ws.protocol;
    }

    /**
     * Returns the `extensions` of the underlying `WebSocket` instance.
     *
     * @return {string} The selected extensions.
     */
    get extensions() {
      return this._ws.extensions;
    }

    /**
     * Returns the `bufferedAmount` value of the underlying `WebSocket` instance.
     *
     * @return {number} The number of bytes of data not yet transmitted to the network.
     */
    get bufferedAmount() {
      return this._ws.bufferedAmount;
    }

    /**
     * Returns the `binaryType` of the underlying `WebSocket` instance.
     *
     * @return {string} The binary type.
     */
    get binaryType() {
      return this._ws.binaryType;
    }

    /**
     * Update the `binaryType` value of the underlying `WebSocket` instance.
     *
     * @param {string} binaryType New binary type value.
     * @return {void}
     */
    set binaryType(binaryType) {
      this._ws.binaryType = binaryType;
    }

    /**
     * Sets up an event listener on the underlying `WebSocket`.
     *
     * @param {string} event The event identifier.
     * @param {function} listener The listener function.
     * @return {void}
     */
    addEventListener(event, listener) {
      this._ws.addEventListener(event, listener);
    }

    /**
     * Removes event listener previously attached to the underlying `WebSocket`.
     *
     * @param {string} event The event name.
     * @param {function} listener The listener function.
     * @return {void}
     */
    removeEventListener(event, listener) {
      this._ws.removeEventListener(event, listener);
    }

    /**
     * Dispatches an Event on the underlying `WebSocket` instance.
     *
     * @param {Event} event The event to dispatch.
     * @return {void}
     */
    dispatchEvent(event) {
      return this._ws.dispatchEvent(event);
    }

    /**
     * Get the tracked `WebSocket` `onopen` handler.
     *
     * @return {function} The `onopen` handler.
     */
    get onopen() {
      return this._ws.onopen;
    }

    /**
     * Set the tacked `WebSocket` `onopen` handler.
     *
     * @param {function} onopen The `onopen` handler.
     * @return {void}
     */
    set onopen(onopen) {
      this._ws.onopen = onopen;
    }

    /**
     * Get the tracked `WebSocket` `onmessage` handler.
     *
     * @return {function} The `onmessage` handler.
     */
    get onmessage() {
      return this._ws.onmessage;
    }

    /**
     * Set the tacked `WebSocket` `onmessage` handler.
     *
     * @param {function} onmessage The `onmessage` handler.
     * @return {void}
     */
    set onmessage(onmessage) {
      this._ws.onmessage = onmessage;
    }

    /**
     * Get the tracked `WebSocket` `onerror` handler.
     *
     * @return {function} The `onerror` handler.
     */
    get onclose() {
      return this._ws.onclose;
    }

    /**
     * Set the tacked `WebSocket` `onclose` handler.
     *
     * @param {function} onclose The `onclose` handler.
     * @return {void}
     */
    set onclose(onclose) {
      this._ws.onclose = onclose;
    }

    /**
     * Get the tracked `WebSocket` `onerror` handler.
     *
     * @return {function} The `onerror` handler.
     */
    get onerror() {
      return this._ws.onerror;
    }

    /**
     * Set the tacked `WebSocket` `onerror` handler.
     *
     * @param {function} onerror The `onerror` handler.
     * @return {void}
     */
    set onerror(onerror) {
      this._ws.onerror = onerror;
    }

    /**
     * Transmits data using the `WebSocket` connection.
     *
     * @param {*} data The string data to send.
     * @return {void}
     */
    send(data) {
      this._ws.send(data);
    }

    /**
     * Closes the tracked `WebSocket` connection.
     *
     * @param {number} code A numeric value indicating the status code explaining why the connection is being closed.
     * @param {string} reason A human-readable string explaining why the connection is closing.
     * @return {void}
     */
    close(code, reason) {
      this._ws.close(code, reason);
    }

    /**
     * The handshake request.
     *
     * @return {FakeOpenHandshake} The handshake request.
     */
    openHandshake() {
      return this._ws._openHandshake;
    }

    /**
     * The handshake closing request.
     *
     * @return {FakeCloseHandshake} The close handshake.
     */
    closeHandshake() {
      return this._ws._closeHandshake;
    }

    /**
     * Get all sent messages.
     *
     * @return {Array<*>} All sent messages.
     */
    sentMessages() {
      return this._ws._sentMessages.slice();
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

      if (this.readyState !== OPEN) {
        throw new Error(
            `Failed to receive message on 'WebSocket': The websocket state must be OPEN.`
        );
      }

      this.dispatchEvent(new FakeMessageEvent(this._ws, data));
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
      if (this.readyState === CLOSED) {
        throw new Error(
            'Cannot emit a close event, WebSocket is already closed.'
        );
      }

      if (this.readyState === CLOSING) {
        throw new Error(
            'Cannot emit a close event, WebSocket is already closing.'
        );
      }

      this._ws._failConnection(code, reason, wasClean);
    }

    /**
     * Get all registered listeners, or listeners for given specific event
     * type.
     *
     * @param {string} type Event type (optional).
     * @return {Array<function>} The registered listeners.
     */
    getEventListeners(type = '') {
      const wsListeners = this._ws._listeners;
      const listeners = type ? wsListeners[type] : flatten(values(wsListeners));
      return listeners ? listeners.slice() : [];
    }
  }

  FakeWebSocketProxy.CONNECTING = CONNECTING;
  FakeWebSocketProxy.OPEN = OPEN;
  FakeWebSocketProxy.CLOSING = CLOSING;
  FakeWebSocketProxy.CLOSED = CLOSED;

  return FakeWebSocketProxy;
});
