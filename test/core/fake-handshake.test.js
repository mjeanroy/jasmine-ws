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

    expect(handshake._ws).toBe(ws);
    expect(handshake._method).toBe('GET');
    expect(handshake._url).toBe('http://localhost/');
    expect(handshake._headers).toEqual({
      'Upgrade': 'websocket',
      'Sec-WebSocket-Key': jasmine.any(String),
      'Sec-WebSocket-Version': '13',
    });
  });

  it('should create fake handshake request with wss', () => {
    const ws = new FakeWebSocket('wss://localhost');
    const handshake = new FakeHandshake(ws);

    expect(handshake._ws).toBe(ws);
    expect(handshake._method).toBe('GET');
    expect(handshake._url).toBe('https://localhost/');
    expect(handshake._headers).toEqual({
      'Upgrade': 'websocket',
      'Sec-WebSocket-Key': jasmine.any(String),
      'Sec-WebSocket-Version': '13',
    });
  });

  it('should create fake handshake request with a port', () => {
    const ws = new FakeWebSocket('ws://localhost:9200');
    const handshake = new FakeHandshake(ws);

    expect(handshake._ws).toBe(ws);
    expect(handshake._method).toBe('GET');
    expect(handshake._url).toBe('http://localhost:9200/');
    expect(handshake._headers).toEqual({
      'Upgrade': 'websocket',
      'Sec-WebSocket-Key': jasmine.any(String),
      'Sec-WebSocket-Version': '13',
    });
  });

  it('should create fake handshake request with a query string', () => {
    const ws = new FakeWebSocket('ws://localhost?test=true');
    const handshake = new FakeHandshake(ws);

    expect(handshake._ws).toBe(ws);
    expect(handshake._method).toBe('GET');
    expect(handshake._url).toBe('http://localhost/?test=true');
    expect(handshake._headers).toEqual({
      'Upgrade': 'websocket',
      'Sec-WebSocket-Key': jasmine.any(String),
      'Sec-WebSocket-Version': '13',
    });
  });

  it('should create fake handshake request with a path', () => {
    const ws = new FakeWebSocket('ws://localhost/test');
    const handshake = new FakeHandshake(ws);

    expect(handshake._ws).toBe(ws);
    expect(handshake._method).toBe('GET');
    expect(handshake._url).toBe('http://localhost/test');
    expect(handshake._headers).toEqual({
      'Upgrade': 'websocket',
      'Sec-WebSocket-Key': jasmine.any(String),
      'Sec-WebSocket-Version': '13',
    });
  });

  it('should get handshake request', () => {
    const ws = new FakeWebSocket('ws://localhost/');
    const handshake = new FakeHandshake(ws);
    const rq = handshake.getRequest();

    expect(rq).toEqual({
      method: 'GET',
      url: 'http://localhost/',
      headers: {
        'Upgrade': 'websocket',
        'Sec-WebSocket-Key': jasmine.any(String),
        'Sec-WebSocket-Version': '13',
      },
    });
  });
});
