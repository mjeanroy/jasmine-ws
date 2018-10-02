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

import {FakeHandshake} from '../../src/core/fake-handshake';
import {FakeWebSocket} from '../../src/core/fake-web-socket';

describe('FakeHandshake', () => {
  it('should create basic fake handshake request', () => {
    const ws = new FakeWebSocket('ws://localhost');
    const handshake = new FakeHandshake(ws);

    expect(handshake.getResponse()).toBeNull();
    expect(handshake.getRequest()).toEqual({
      method: 'GET',
      url: 'http://localhost/',
      headers: {
        'Upgrade': 'websocket',
        'Sec-WebSocket-Key': jasmine.any(String),
        'Sec-WebSocket-Version': '13',
      },
    });
  });

  it('should create fake handshake request with wss', () => {
    const ws = new FakeWebSocket('wss://localhost');
    const handshake = new FakeHandshake(ws);

    expect(handshake.getRequest()).toEqual({
      method: 'GET',
      url: 'https://localhost/',
      headers: {
        'Upgrade': 'websocket',
        'Sec-WebSocket-Key': jasmine.any(String),
        'Sec-WebSocket-Version': '13',
      },
    });
  });

  it('should create fake handshake request with a port', () => {
    const ws = new FakeWebSocket('ws://localhost:9200');
    const handshake = new FakeHandshake(ws);

    expect(handshake.getRequest()).toEqual({
      method: 'GET',
      url: 'http://localhost:9200/',
      headers: {
        'Upgrade': 'websocket',
        'Sec-WebSocket-Key': jasmine.any(String),
        'Sec-WebSocket-Version': '13',
      },
    });
  });

  it('should create fake handshake request with a query string', () => {
    const ws = new FakeWebSocket('ws://localhost?test=true');
    const handshake = new FakeHandshake(ws);

    expect(handshake.getRequest()).toEqual({
      method: 'GET',
      url: 'http://localhost/?test=true',
      headers: {
        'Upgrade': 'websocket',
        'Sec-WebSocket-Key': jasmine.any(String),
        'Sec-WebSocket-Version': '13',
      },
    });
  });

  it('should create fake handshake request with a path', () => {
    const ws = new FakeWebSocket('ws://localhost/test');
    const handshake = new FakeHandshake(ws);

    expect(handshake.getRequest()).toEqual({
      method: 'GET',
      url: 'http://localhost/test',
      headers: {
        'Upgrade': 'websocket',
        'Sec-WebSocket-Key': jasmine.any(String),
        'Sec-WebSocket-Version': '13',
      },
    });
  });

  it('should create fake handshake request with a single protocol', () => {
    const ws = new FakeWebSocket('ws://localhost/test', 'protocol');
    const handshake = new FakeHandshake(ws);

    expect(handshake.getRequest()).toEqual({
      method: 'GET',
      url: 'http://localhost/test',
      headers: {
        'Upgrade': 'websocket',
        'Sec-WebSocket-Key': jasmine.any(String),
        'Sec-WebSocket-Version': '13',
        'Sec-WebSocket-Protocol': 'protocol',
      },
    });
  });

  it('should create fake handshake request with a list of protocol', () => {
    const ws = new FakeWebSocket('ws://localhost/test', ['protocol1', 'protocol2']);
    const handshake = new FakeHandshake(ws);

    expect(handshake.getRequest()).toEqual({
      method: 'GET',
      url: 'http://localhost/test',
      headers: {
        'Upgrade': 'websocket',
        'Sec-WebSocket-Key': jasmine.any(String),
        'Sec-WebSocket-Version': '13',
        'Sec-WebSocket-Protocol': 'protocol1,protocol2',
      },
    });
  });

  describe('once created', () => {
    let ws;
    let handshake;

    beforeEach(() => {
      ws = new FakeWebSocket('ws://localhost/test', ['protocol1', 'protocol2']);
      handshake = new FakeHandshake(ws);
    });

    it('should trigger response', () => {
      spyOn(ws, '_openConnection').and.callThrough();

      handshake.respond();

      expect(handshake.getResponse()).toEqual({
        status: 101,
        headers: {
          'Upgrade': 'websocket',
          'Connection': 'Upgrade',
          'Sec-WebSocket-Accept': jasmine.any(String),
        },
      });

      expect(ws.readyState).toBe(1);
      expect(ws.protocol).toBeNull();
      expect(ws.extensions).toBeNull();
      expect(ws._openConnection).toHaveBeenCalledWith({
        status: 101,
        headers: {
          'Upgrade': 'websocket',
          'Connection': 'Upgrade',
          'Sec-WebSocket-Accept': jasmine.any(String),
        },
      });
    });
  });
});
