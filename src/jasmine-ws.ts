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

import {find} from './core/common/find.js';
import {fakeWebSocketFactory} from './core/fake-web-socket.js';
import {wsTracker, reset} from './core/ws-tracker.js';

const GLOBAL = window || global;
const WEB_SOCKET_IMPL_NAME = find(['WebSocket', 'MozWebSocket'], (impl) => impl in GLOBAL);
const WEB_SOCKET = WEB_SOCKET_IMPL_NAME ? GLOBAL[WEB_SOCKET_IMPL_NAME] : null;

/**
 * Update the global `WebSocket` API in the current running environment.
 *
 * @param {function} impl The `WebSocket` API implementation.
 * @return {void}
 */
function setWebSocketImpl(impl) {
  GLOBAL[WEB_SOCKET_IMPL_NAME] = impl;
}

/**
 * Check if the current installed `WebSocket` in the running environment is strictly
 * equal to the one in parameter.
 *
 * @param {function} impl The `WebSocket` API implementation to check.
 * @return {boolean} `true` if the global `WebSocket` is equal to `impl`, `false` otherwise.
 */
function checkWebSocketImpl(impl) {
  return GLOBAL[WEB_SOCKET_IMPL_NAME] === impl;
}

let FakeWebSocket;

jasmine['ws'] = () => ({
  /**
   * Install the fake WebSocket implementation, if and only if native WebSocket is supported
   * on runtime environment.
   *
   * @return {void}
   */
  install() {
    if (WEB_SOCKET) {
      // Create the `FakeWebSocket` once.
      if (!FakeWebSocket) {
        FakeWebSocket = fakeWebSocketFactory();
      }

      if (checkWebSocketImpl(FakeWebSocket)) {
        throw new Error(
            'It seems that jasmine-ws has already been installed, make sure `jasmine.ws().uninstall()` ' +
            'has been called after test suite.'
        );
      }

      // Override the default `WebSocket` API.
      setWebSocketImpl(FakeWebSocket);

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
    if (WEB_SOCKET) {
      if (!checkWebSocketImpl(FakeWebSocket)) {
        throw new Error(
            'It seems that `jasmine.ws` has not been installed, make sure `jasmine.ws().install()` ' +
            'has been called before uninstalling it.'
        );
      }

      // Restore the default `WebSocket` API.
      setWebSocketImpl(WEB_SOCKET);

      // Ensure the tracker is resetted.
      reset();
    }
  },

  /**
   * Allow to use fake `WebSocket` API in a single test function (without dealing
   * with `jasmine.ws().install` and `jasmine.ws().uninstall()`).
   *
   * @param {function} testFn The test function.
   * @return {*} The return value of the test function.
   */
  withMock(testFn) {
    this.install();

    try {
      return testFn();
    } finally {
      this.uninstall();
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
