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

import {assumeWebSocket} from './support/assume-websocket.js';
import {assumeNonWebSocket} from './support/assume-non-websocket.js';
import '../src/jasmine-ws.js';

describe('jasmine-ws', () => {
  describe('with a browser supporting WebSocket', () => {
    let _WebSocket;

    beforeAll(() => {
      assumeWebSocket();
    });

    beforeEach(() => {
      _WebSocket = window.WebSocket;
    });

    afterEach(() => {
      window.WebSocket = _WebSocket;
    });

    it('should install/uninstall jasmine-ws', () => {
      debugger;
      jasmine.ws().install();

      expect(window.WebSocket).toBeDefined();
      expect(window.WebSocket).not.toBe(_WebSocket);

      jasmine.ws().uninstall();

      expect(window.WebSocket).toBeDefined();
      expect(window.WebSocket).toBe(_WebSocket);
    });

    it('should allow installation of jasmine-ws in a single shot', () => {
      const testFn = jasmine.createSpy('testFn').and.callFake(() => {
        expect(window.WebSocket).toBeDefined();
        expect(window.WebSocket).not.toBe(_WebSocket);
      });

      jasmine.ws().withMock(testFn);

      expect(testFn).toHaveBeenCalledTimes(1);
      expect(window.WebSocket).toBeDefined();
      expect(window.WebSocket).toBe(_WebSocket);
    });

    it('should allow installation of jasmine-ws in a single shot and reset spies if test throw an exception', () => {
      const testFn = jasmine.createSpy('testFn').and.callFake(() => {
        throw new Error('Fail Test');
      });

      expect(() => jasmine.ws().withMock(testFn)).toThrow();

      expect(testFn).toHaveBeenCalledTimes(1);
      expect(window.WebSocket).toBeDefined();
      expect(window.WebSocket).toBe(_WebSocket);
    });

    it('should allow installation of jasmine-ws in a single shot and return that value', () => {
      const testFn = jasmine.createSpy('testFn').and.callFake(() => {
        expect(window.WebSocket).toBeDefined();
        expect(window.WebSocket).not.toBe(_WebSocket);
        return true;
      });

      const result = jasmine.ws().withMock(testFn);

      expect(testFn).toHaveBeenCalledTimes(1);
      expect(window.WebSocket).toBeDefined();
      expect(window.WebSocket).toBe(_WebSocket);
      expect(result).toBe(true);
    });

    it('should fail to uninstall jasmine-ws if it has not been previously installed', () => {
      expect(() => jasmine.ws().uninstall()).toThrow(new Error(
          'It seems that `jasmine.ws` has not been installed, make sure `jasmine.ws().install()` ' +
          'has been called before uninstalling it.'
      ));
    });

    it('should fail to install jasmine-ws if it is already installed', () => {
      jasmine.ws().install();

      expect(() => jasmine.ws().install()).toThrow(new Error(
          'It seems that jasmine-ws has already been installed, make sure `jasmine.ws().uninstall()` ' +
          'has been called after test suite.'
      ));

      jasmine.ws().uninstall();
    });

    describe('once initialized', () => {
      beforeEach(() => {
        jasmine.ws().install();
      });

      it('should verify handshake', () => {
        const protocolName = 'customProtocol';
        const ws = new WebSocket('ws://localhost:9200', protocolName);
        ws.onopen = jasmine.createSpy('onopen');
        ws.onmessage = jasmine.createSpy('onmessage');

        const connection = jasmine.ws().connections().first();
        expect(connection.url).toBe('ws://localhost:9200/');
        expect(connection.readyState).toBe(0);
        expect(connection.protocol).toBe('');
        expect(connection.extensions).toBe('');
        expect(connection.onopen).not.toHaveBeenCalled();
        expect(connection.onmessage).not.toHaveBeenCalled();

        expect(connection.openHandshake().getRequest()).toEqual({
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

  describe('with a browser that does not support WebSocket', () => {
    beforeAll(() => {
      assumeNonWebSocket();
    });

    it('should skip installation/uninstallation', () => {
      jasmine.ws().install();
      expect(window.WebSocket).not.toBeDefined();

      jasmine.ws().uninstall();
      expect(window.WebSocket).not.toBeDefined();
    });
  });
});
