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

describe('FakeWebSocket', () => {
  it('should define state as static constant', () => {
    expect(FakeWebSocket.CONNECTING).toBe(0);
    expect(FakeWebSocket.OPEN).toBe(1);
    expect(FakeWebSocket.CLOSING).toBe(2);
    expect(FakeWebSocket.CLOSED).toBe(3);
  });

  it('should fail to create WebSocket with empty URL', () => {
    expect(() => new FakeWebSocket('')).toThrow(new SyntaxError(
        'Failed to construct \'WebSocket\': The URL \'\' is invalid.'
    ));
  });

  // Does not work when parseUrl use the polyfill, needs a better one.
  xit('should fail to create WebSocket with invalid URL', () => {
    expect(() => new FakeWebSocket('==://invalid==URL')).toThrow(new SyntaxError(
        'Failed to construct \'WebSocket\': The URL \'==://invalid==URL\' is invalid.'
    ));
  });

  it('should fail to create WebSocket if connection URL scheme is not ws nor wss', () => {
    expect(() => new FakeWebSocket('http://localhost')).toThrow(new SyntaxError(
        'Failed to construct \'WebSocket\': The URL\'s scheme must be either \'ws\' or \'wss\'. ' +
        '\'http\' is not allowed.'
    ));
  });

  it('should fail to create WebSocket if connection URL contains a fragment', () => {
    expect(() => new FakeWebSocket('wss://localhost#test')).toThrow(new SyntaxError(
        'Failed to construct \'WebSocket\': The URL contains a fragment identifier (\'#test\'). ' +
        'Fragment identifiers are not allowed in WebSocket URLs.'
    ));
  });

  it('should fail to create WebSocket with duplicated protocols', () => {
    expect(() => new FakeWebSocket('ws://localhost', ['foo', 'foo'])).toThrow(new SyntaxError(
        'Failed to construct \'WebSocket\': The subprotocol \'foo\' is duplicated.'
    ));
  });

  it('should initialize Fake WebSocket', () => {
    const ws = new FakeWebSocket('ws://localhost');

    expect(ws.readyState).toBe(0);
    expect(ws.url).toBeDefined();
    expect(ws.protocol).toBe('');
    expect(ws.extensions).toBe('');
    expect(ws.binaryType).toBe('blob');
  });

  describe('once initializes', () => {
    let ws;

    beforeEach(() => {
      ws = new FakeWebSocket('ws://localhost');
    });

    it('should get handshake request', () => {
      const handshake = ws.handshake();

      expect(handshake.url).toBe('http://localhost/');
      expect(handshake.method).toBe('GET');
      expect(handshake.headers).toEqual({
        'Upgrade': 'websocket',
        'Sec-WebSocket-Key': jasmine.any(String),
        'Sec-WebSocket-Version': '13',
      });

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
  });
});
