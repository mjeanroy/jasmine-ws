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

import {fakeWebSocketProxyFactory} from './fake-web-socket-proxy.js';

/**
 * The queue of opened WebSocket.
 * @type {Array<FakeWebSocketProxy>}
 */
const queue = [];

/**
 * Add `WebSocket` to the internal tracker.
 * @param {FakeWebSocket} ws The `WebSocket` to track.
 * @return {void}
 */
export function track(ws) {
  const FakeWebSocketProxy = fakeWebSocketProxyFactory();
  const proxy = new FakeWebSocketProxy(ws);
  queue.push(proxy);
}

/**
 * Reset all tracked `WebSocket`.
 *
 * @return {void}
 */
export function reset() {
  queue.splice(0, queue.length);
}

export const wsTracker = {
  /**
   * Get the most recent tracked `WebSocket`.
   *
   * @return {void}
   */
  mostRecent() {
    return queue[queue.length - 1];
  },

  /**
   * Get the first tracked `WebSocket`.
   *
   * @return {void}
   */
  first() {
    return queue[0];
  },

  /**
   * Get the tracked `WebSocket` at given index.
   *
   * @param {number} idx The tracked index.
   * @return {void}
   */
  at(idx) {
    return queue[idx];
  },

  /**
   * Get the number of previously opened `WebSocket` connections.
   *
   * @return {number} Number of tracked connections.
   */
  count() {
    return queue.length;
  },

  /**
   * Get all previously opened `WebSocket` connections.
   *
   * @return {Array<FakeWebSocket>} The list of tracked connections.
   */
  all() {
    return queue.slice();
  },
};
