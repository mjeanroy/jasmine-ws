/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2018-2019 Mickael Jeanroy
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

import { factory } from './common/factory';
import { parseUrlOrigin } from './common/parse-url-origin';
import { fakeEventFactory } from './fake-event';

export const fakeMessageEventFactory = factory(() => {
  const FakeEvent = fakeEventFactory();

  /**
   * An integer that will be incremented each a new `FakeMessageEvent` is created, will
   * be used to get unique identifiers.
   * @type {number}
   */
  let _id = 0;

  /**
   * A fake Message Event.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/MessageEvent
   */
  class FakeMessageEvent extends FakeEvent {
    /**
     * Create the fake event.
     *
     * @param {FakeWebSocket} ws The WebSocket.
     * @param {*} data The sent data.
     * @constructor
     */
    constructor(ws, data) {
      super('message', ws);
      this._data = data;
      this._lastEventId = (_id++).toString();
      this._origin = parseUrlOrigin(ws.url);
    }

    /**
     * Initializes a message event.
     *
     * This method is deprecated and is here just to make the event compatible with a "real"
     * message event.
     *
     * @return {void}
     */
    // eslint-disable-next-line class-methods-use-this
    initMessageEvent() {
    }

    /**
     * The data sent by the message emitter.
     *
     * @return {*} The sent data.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/MessageEvent/data
     */
    get data() {
      return this._data;
    }

    /**
     * A `string` representing a unique ID for the event.
     *
     * @return {string} The unique event identifier.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/MessageEvent/lastEventId
     */
    get lastEventId() {
      return this._lastEventId;
    }

    /**
     * An array of `MessagePort` objects representing the ports associated with the channel the message is being sent
     * through (where appropriate, e.g. in channel messaging or when sending a message to a shared worker).
     *
     * In this implementation, this method always returns an empty array.
     *
     * @return {Array<Object>} The message ports.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/MessageEvent/ports
     */
    // eslint-disable-next-line class-methods-use-this
    get ports() {
      return [];
    }

    /**
     * A USVString representing the origin of the message emitter.
     *
     * @return {string} The message emitter origin.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/MessageEvent/origin
     */
    get origin() {
      return this._origin;
    }

    /**
     * A `MessageEventSource` (which can be a `WindowProxy`, `MessagePort`, or `ServiceWorker` object) representing
     * the message emitter.
     *
     * In this implementation, this method always returns `null`.
     *
     * @return {Object} The message emitter source.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/MessageEvent/source
     */
    // eslint-disable-next-line class-methods-use-this
    get source() {
      return null;
    }
  }

  return FakeMessageEvent;
});
