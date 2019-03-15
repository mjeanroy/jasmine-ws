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

import {factory} from './common/factory';

interface Handshake {
  code: number;
  reason: string;
  wasClean: boolean;
}

export const fakeCloseHandshakeFactory = factory(() => {
  /**
   * A fake Handshake for the close request.
   */
  return class FakeCloseHandshake {
    private _ws: any;
    private _request: Handshake;
    private _response: Handshake | null;

    /**
     * Create the fake event.
     *
     * @param {FakeWebSocket} ws The WebSocket.
     * @param {number} code The close code.
     * @param {string} reason The close reason.
     * @param {boolean} wasClean A `boolean` that Indicates whether or not the connection was cleanly closed.
     * @constructor
     */
    constructor(ws, code: number, reason: string, wasClean: boolean) {
      this._ws = ws;
      this._request = {code, reason, wasClean};
      this._response = null;
    }

    /**
     * Trigger the close handshake response.
     *
     * @return {void}
     */
    respond(): void {
      this._triggerResponse({
        code: this._request.code,
        reason: this._request.reason,
        wasClean: this._request.wasClean,
      });
    }

    /**
     * The close code identifier.
     *
     * @return {number} The close code.
     */
    get code(): number {
      return this._request.code;
    }

    /**
     * The close reason.
     *
     * @return {string} The close r
     */
    get reason(): string {
      return this._request.reason;
    }

    /**
     * A `boolean` that Indicates whether or not the connection was cleanly closed.
     *
     * @return {boolean} The clean flag.
     */
    get wasClean(): boolean {
      return this._request.wasClean;
    }

    /**
     * Trigger the handshake response.
     *
     * @param {Object} response The handshake response.
     * @return {void}
     */
    private _triggerResponse(response: Handshake): void {
      if (this._isClosed()) {
        throw new Error(
            'Cannot trigger handshake response since the close handshake is already closed.'
        );
      }

      this._response = response;
      this._ws._doClose(
          response.code,
          response.reason,
          response.wasClean
      );
    }

    /**
     * Check if the handshake operation is closed, i.e if the response has already
     * been triggered.
     *
     * @return {boolean} `true` if the handshake response has been triggered, `false` otherwise.
     */
    private _isClosed(): boolean {
      return this._response !== null;
    }
  }
});
