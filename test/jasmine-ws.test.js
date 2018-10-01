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

import '../src/jasmine-ws.js';

describe('jasmine-ws', () => {
  let _WebSocket;

  beforeEach(() => {
    _WebSocket = window.WebSocket;
  });

  afterEach(() => {
    window.WebSocket = _WebSocket;
  });

  it('should install/uninstall jasmine-ws', () => {
    jasmine.ws.install();

    expect(window.WebSocket).toBeDefined();
    expect(window.WebSocket).not.toBe(_WebSocket);

    jasmine.ws.uninstall();

    expect(window.WebSocket).toBeDefined();
    expect(window.WebSocket).toBe(_WebSocket);
  });

  describe('once initialized', () => {
    beforeEach(() => {
      jasmine.ws.install();
    });

    it('should verify handshake', () => {
      const protocolName = 'customProtocol';
      const ws = new WebSocket('ws://localhost:9200', protocolName);

      ws.onopen = jasmine.createSpy('onopen');
      ws.onmessage = jasmine.createSpy('onmessage');

      expect(ws.readyState).toBe(0);
      expect(ws.protocol).toBe('');
      expect(ws.extensions).toBe('');
      expect(ws.onopen).not.toHaveBeenCalled();
      expect(ws.onmessage).not.toHaveBeenCalled();
      expect(jasmine.ws.connections().mostRecent()).toBe(ws);

      expect(ws.handshake().getRequest()).toEqual({
        method: 'GET',
        url: 'http://localhost:9200/',
        headers: {
          'Upgrade': 'websocket',
          'Sec-WebSocket-Key': jasmine.any(String),
          'Sec-WebSocket-Version': '13',
          'Sec-WebSocket-Protocol': protocolName,
        },
      });
    });
  });
});
