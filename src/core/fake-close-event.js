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
import { fakeEventFactory } from './fake-event';

export const fakeCloseEventFactory = factory(() => {
  const FakeEvent = fakeEventFactory();

  /**
   * A fake close event.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent
   */
  class FakeCloseEvent extends FakeEvent {
    /**
     * Create the fake event.
     *
     * @param {FakeWebSocket} ws The WebSocket.
     * @param {number} code The close code.
     * @param {string} reason The close reason.
     * @param {boolean} wasClean A `boolean` that Indicates whether or not the connection was cleanly closed.
     * @constructor
     */
    constructor(ws, code, reason, wasClean) {
      super('close', ws);
      this._code = code;
      this._reason = reason;
      this._wasClean = wasClean;
    }

    /**
     * Initializes the value of a CloseEvent created.
     *
     * This method is deprecated and is here just to make the event compatible with a "real"
     * close event.
     *
     * @return {void}
     */
    // eslint-disable-next-line class-methods-use-this
    initCloseEvent() {
    }

    /**
     * The close code identifier.
     *
     * @return {number} The close code.
     */
    get code() {
      return this._code;
    }

    /**
     * The close reason.
     *
     * @return {string} The close r
     */
    get reason() {
      return this._reason;
    }

    /**
     * A `boolean` that Indicates whether or not the connection was cleanly closed.
     *
     * @return {boolean} The clean flag.
     */
    get wasClean() {
      return this._wasClean;
    }
  }

  return FakeCloseEvent;
});
