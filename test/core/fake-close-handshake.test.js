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

import {FakeWebSocket} from '../../src/core/fake-web-socket.js';
import {FakeCloseHandshake} from '../../src/core/fake-close-handshake.js';

describe('FakeOpenHandshake', () => {
  it('should create close handshake request', () => {
    const ws = new FakeWebSocket('ws://localhost');
    const code = 1000;
    const reason = 'Connection Aborted';
    const wasClean = true;
    const handshake = new FakeCloseHandshake(ws, code, reason, wasClean);

    expect(handshake.code).toBe(code);
    expect(handshake.reason).toBe(reason);
    expect(handshake.wasClean).toBe(wasClean);
  });

  describe('once created', () => {
    let ws;
    let handshake;

    beforeEach(() => {
      ws = new FakeWebSocket('ws://localhost/test', ['protocol1', 'protocol2']);
      handshake = new FakeCloseHandshake(ws, 1000, 'Aborted', true);
    });

    it('should trigger response', () => {
      spyOn(ws, '_doClose').and.callThrough();

      handshake.respond();

      expect(ws._doClose).toHaveBeenCalledWith(handshake.code, handshake.reason, handshake.wasClean);
      expect(ws.readyState).toBe(3);
    });
  });
});
