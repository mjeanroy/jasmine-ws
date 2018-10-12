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

import {FakeWebSocket} from './core/fake-web-socket.js';
import {wsTracker, reset} from './core/ws-tracker.js';

const _global = window || global;
const _WebSocket = _global.WebSocket;

jasmine.ws = () => ({
  /**
   * Install the fake WebSocket implementation, if and only if native WebSocket is supported
   * on runtime environment.
   *
   * @return {void}
   */
  install() {
    if (_WebSocket) {
      // Override the default `WebSocket` API.
      _global.WebSocket = FakeWebSocket;

      // Ensure the tracker is resetted.
      reset();
    }
  },

  /**
   * Uninstall the fake WebSocket implementation if it was previously installed.
   *
   * @return {void}
   */
  uninstall() {
    if (_WebSocket && _global.WebSocket == FakeWebSocket) {
      // Restore the default `WebSocket` API.
      _global.WebSocket = _WebSocket;

      // Ensure the tracker is resetted.
      reset();
    }
  },

  /**
   * Get the store of opened `WebSocket` connections.
   *
   * @return {Object} The store.
   */
  connections() {
    return wsTracker;
  },
});
