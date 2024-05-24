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

import { fakeWebSocketFactory } from '../../src/core/fake-web-socket';
import { fakeWebSocketProxyFactory } from '../../src/core/fake-web-socket-proxy';
import { assumeArrayBuffer } from '../support/assume-array-buffer';
import { assumeBlob } from '../support/assume-blob';

describe('FakeWebSocketTracker', () => {
  let FakeWebSocketProxy;
  let FakeWebSocket;

  beforeAll(() => {
    FakeWebSocket = fakeWebSocketFactory();
    FakeWebSocketProxy = fakeWebSocketProxyFactory();
  });

  it('should define state as static constant', () => {
    expect(FakeWebSocketProxy.CONNECTING).toBe(0);
    expect(FakeWebSocketProxy.OPEN).toBe(1);
    expect(FakeWebSocketProxy.CLOSING).toBe(2);
    expect(FakeWebSocketProxy.CLOSED).toBe(3);
  });

  it('should initialize Fake WebSocket', () => {
    const ws = new FakeWebSocket('ws://localhost');
    const proxy = new FakeWebSocketProxy(ws);

    expect(proxy.readyState).toBe(0);
    expect(proxy.url).toBe('ws://localhost/');
    expect(proxy.protocol).toBe('');
    expect(proxy.extensions).toBe('');
    expect(proxy.binaryType).toBe('blob');
    expect(proxy.bufferedAmount).toBe(0);
  });

  describe('once initialized', () => {
    let ws;
    let proxy;

    beforeEach(() => {
      ws = new FakeWebSocket('ws://localhost');
      proxy = new FakeWebSocketProxy(ws);
    });

    it('should initialize handlers to null', () => {
      expect(proxy.onerror).toBeNull();
      expect(proxy.onopen).toBeNull();
      expect(proxy.onclose).toBeNull();
      expect(proxy.onmessage).toBeNull();
    });

    it('should set ws handlers', () => {
      ws.onerror = jasmine.createSpy('onerror');
      ws.onopen = jasmine.createSpy('onopen');
      ws.onclose = jasmine.createSpy('onclose');
      ws.onmessage = jasmine.createSpy('onmessage');

      expect(proxy.onerror).toBe(ws.onerror);
      expect(proxy.onopen).toBe(ws.onopen);
      expect(proxy.onclose).toBe(ws.onclose);
      expect(proxy.onmessage).toBe(ws.onmessage);
    });

    it('should define ws handlers from proxy', () => {
      const onerror = jasmine.createSpy('onerror');
      const onopen = jasmine.createSpy('onopen');
      const onclose = jasmine.createSpy('onclose');
      const onmessage = jasmine.createSpy('onmessage');

      proxy.onerror = onerror;
      proxy.onopen = onopen;
      proxy.onclose = onclose;
      proxy.onmessage = onmessage;

      expect(proxy.onerror).toBe(onerror);
      expect(proxy.onopen).toBe(onopen);
      expect(proxy.onclose).toBe(onclose);
      expect(proxy.onmessage).toBe(onmessage);

      expect(proxy.onerror).toBe(ws.onerror);
      expect(proxy.onopen).toBe(ws.onopen);
      expect(proxy.onclose).toBe(ws.onclose);
      expect(proxy.onmessage).toBe(ws.onmessage);
    });

    it('should get ws url', () => {
      expect(proxy.url).toBe(ws.url);
    });

    it('should get ws readyState', () => {
      expect(proxy.readyState).toBe(ws.readyState);
    });

    it('should get ws protocol', () => {
      expect(proxy.protocol).toBe(ws.protocol);
    });

    it('should get ws extensions', () => {
      expect(proxy.extensions).toBe(ws.extensions);
    });

    it('should get ws bufferedAmount', () => {
      expect(proxy.bufferedAmount).toBe(ws.bufferedAmount);
    });

    it('should get ws binary type', () => {
      expect(proxy.binaryType).toBe(ws.binaryType);
    });

    it('should set ws binary type', () => {
      const binaryType = 'text';
      proxy.binaryType = binaryType;

      expect(proxy.binaryType).toBe(binaryType);
      expect(proxy.binaryType).toBe(ws.binaryType);
    });

    it('should add event listener', () => {
      const type = 'open';
      const listener = jasmine.createSpy('listener');

      spyOn(ws, 'addEventListener').and.callThrough();

      proxy.addEventListener(type, listener);

      expect(ws.addEventListener).toHaveBeenCalledWith(type, listener);
    });

    it('should remove event listener', () => {
      const type = 'open';
      const listener = jasmine.createSpy('listener');

      spyOn(ws, 'removeEventListener').and.callThrough();

      proxy.removeEventListener(type, listener);

      expect(ws.removeEventListener).toHaveBeenCalledWith(type, listener);
    });

    it('should dispatch event', () => {
      const event = {
        type: 'open',
      };

      spyOn(ws, 'dispatchEvent').and.callThrough();

      proxy.dispatchEvent(event);

      expect(ws.dispatchEvent).toHaveBeenCalledWith(event);
    });

    it('should close WebSocket', () => {
      const code = 3000;
      const reason = 'The reason';

      spyOn(ws, 'close').and.callThrough();

      proxy.close(code, reason);

      expect(ws.close).toHaveBeenCalledWith(code, reason);
    });

    it('should get handshake request', () => {
      const handshake = proxy.openHandshake();

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

    it('should open websocket after handshake response', () => {
      const expectEventPhase = (e) => expect(e.eventPhase).toBe(2);
      const onopen = jasmine.createSpy('onopen').and.callFake(expectEventPhase);
      const onOpenListener = jasmine.createSpy('onOpenListener').and.callFake(expectEventPhase);

      ws.onopen = onopen;
      ws.addEventListener('open', onOpenListener);

      proxy.openHandshake().respond();

      expect(onopen).toHaveBeenCalledTimes(1);
      expect(onOpenListener).toHaveBeenCalledTimes(1);
      expect(ws.readyState).toBe(1);

      const e1 = onopen.calls.mostRecent().args[0];
      const e2 = onOpenListener.calls.mostRecent().args[0];
      expect(e1).toBe(e2);
      expect(e1.type).toBe('open');
      expect(e1.eventPhase).toBe(0);
    });

    it('should fail to open websocket after error in handshake response', () => {
      const expectEventPhase = (e) => expect(e.eventPhase).toBe(2);
      const onopen = jasmine.createSpy('onopen');
      const onOpenListener = jasmine.createSpy('onOpenListener');
      const onerror = jasmine.createSpy('onerror').and.callFake(expectEventPhase);
      const onErrorListener = jasmine.createSpy('onErrorListener').and.callFake(expectEventPhase);

      ws.onopen = onopen;
      ws.addEventListener('open', onOpenListener);
      ws.onerror = onerror;
      ws.addEventListener('error', onErrorListener);

      proxy.openHandshake().respondWith({
        status: 401,
      });

      expect(ws.readyState).toBe(2);
      expect(onopen).not.toHaveBeenCalled();
      expect(onOpenListener).not.toHaveBeenCalled();
      expect(onerror).toHaveBeenCalledTimes(1);
      expect(onErrorListener).toHaveBeenCalledTimes(1);

      const e1 = onerror.calls.mostRecent().args[0];
      const e2 = onErrorListener.calls.mostRecent().args[0];
      expect(e1).toBe(e2);
      expect(e1.type).toBe('error');
      expect(e1.eventPhase).toBe(0);
    });

    it('should fail to open websocket when handshake response is failed', () => {
      const onOpenListener = jasmine.createSpy('onOpenListener');
      const onErrorListener = jasmine.createSpy('onErrorListener');

      ws.addEventListener('open', onOpenListener);
      ws.addEventListener('error', onErrorListener);

      proxy.openHandshake().fail();

      expect(ws.readyState).toBe(2);
      expect(onOpenListener).not.toHaveBeenCalled();
      expect(onErrorListener).toHaveBeenCalledTimes(1);

      const event = onErrorListener.calls.mostRecent().args[0];
      expect(event.type).toBe('error');
      expect(event.eventPhase).toBe(0);
    });

    it('should fail to receive a message if the open handshake is still pending', () => {
      const onmessage = jasmine.createSpy('onmessage');
      const onMessageListener = jasmine.createSpy('onMessageListener');
      const data = 'test';

      ws.onmessage = onmessage;
      ws.addEventListener('message', onMessageListener);

      expect(() => proxy.emitMessage(data)).toThrow(new Error(
        "Failed to receive message on 'WebSocket': The websocket state must be OPEN.",
      ));

      expect(onmessage).not.toHaveBeenCalled();
      expect(onMessageListener).not.toHaveBeenCalled();
    });

    it('should fail to close the connection if the handshake is still pending', () => {
      const onCloseListener = jasmine.createSpy('onCloseListener');

      ws.addEventListener('close', onCloseListener);
      ws.close();

      expect(ws.readyState).toBe(2);
      expect(onCloseListener).not.toHaveBeenCalled();

      proxy.closeHandshake().respond();

      expect(ws.readyState).toBe(3);
      expect(onCloseListener).toHaveBeenCalledTimes(1);

      const event = onCloseListener.calls.mostRecent().args[0];
      expect(event.code).toBe(1006);
      expect(event.reason).toBe('');
      expect(event.wasClean).toBe(false);
    });

    it('should get register listeners', () => {
      const listener1 = jasmine.createSpy('listener1');
      const listener2 = jasmine.createSpy('listener2');
      ws.addEventListener('open', listener1);
      ws.addEventListener('close', listener2);

      const listeners = proxy.getEventListeners();

      expect(listeners.length).toBe(2);
      expect(listeners).toContain(listener1);
      expect(listeners).toContain(listener2);
    });

    it('should get register listeners for given event type', () => {
      const listener1 = jasmine.createSpy('listener1');
      const listener2 = jasmine.createSpy('listener2');
      const listener3 = jasmine.createSpy('listener3');

      ws.addEventListener('open', listener1);
      ws.addEventListener('close', listener2);
      ws.addEventListener('close', listener3);

      const listeners = proxy.getEventListeners('close');

      expect(listeners).toEqual([listener2, listener3]);
    });

    it('should get empty array if there is not registered listener', () => {
      expect(proxy.getEventListeners()).toEqual([]);
    });

    it('should get empty array if there is not registered listener for given event type', () => {
      ws.addEventListener('open', jasmine.createSpy('listener1'));

      expect(proxy.getEventListeners('close')).toEqual([]);
    });

    describe('once opened', () => {
      beforeEach(() => {
        ws = new FakeWebSocket('ws://localhost');
        proxy = new FakeWebSocketProxy(ws);
        proxy.openHandshake().respond();
      });

      it('should send message', () => {
        const message = 'test';

        spyOn(ws, 'send').and.callThrough();

        proxy.send(message);

        expect(ws.send).toHaveBeenCalledWith(message);
      });

      it('should get sent messages in order', () => {
        const data1 = 'test1';
        const data2 = 'test2';

        ws.send(data1);
        expect(proxy.sentMessages()).toEqual([data1]);

        ws.send(data2);
        expect(proxy.sentMessages()).toEqual([data1, data2]);
      });

      it('should close websocket', () => {
        const onCloseListener = jasmine.createSpy('onCloseListener');
        const onClose = jasmine.createSpy('onclose');

        ws.addEventListener('close', onCloseListener);
        ws.onclose = onClose;
        ws.close();

        expect(proxy.readyState).toBe(2);
        expect(proxy.closeHandshake()).not.toBeNull();

        proxy.closeHandshake().respond();

        expect(onCloseListener).toHaveBeenCalledTimes(1);
        expect(onClose).toHaveBeenCalledTimes(1);

        const e1 = onCloseListener.calls.mostRecent().args[0];
        const e2 = onClose.calls.mostRecent().args[0];
        expect(e1).toBe(e2);
        expect(e1.code).toBe(1005);
        expect(e1.reason).toBe('');
        expect(e1.wasClean).toBe(true);
      });

      it('should emit a string message and trigger listeners', () => {
        const onmessage = jasmine.createSpy('onmessage');
        const onMessageListener = jasmine.createSpy('onMessageListener');
        const data = 'test';

        ws.onmessage = onmessage;
        ws.addEventListener('message', onMessageListener);

        proxy.emitMessage(data);

        expect(onmessage).toHaveBeenCalledTimes(1);
        expect(onMessageListener).toHaveBeenCalledTimes(1);

        const e1 = onmessage.calls.mostRecent().args[0];
        const e2 = onMessageListener.calls.mostRecent().args[0];
        expect(e1).toBe(e2);
        expect(e1.data).toBe(data);
        expect(e1.origin).toBe('ws://localhost');
      });

      it('should emit a blob message and trigger listeners', () => {
        assumeBlob();

        const onMessageListener = jasmine.createSpy('onMessageListener');
        const data = new Blob(['test'], {
          type: 'plain/text',
        });

        ws.addEventListener('message', onMessageListener);

        proxy.emitMessage(data);

        expect(onMessageListener).toHaveBeenCalledTimes(1);
        expect(onMessageListener.calls.mostRecent().args[0].data).toBe(data);
      });

      it('should emit an ArrayBuffer message and trigger listeners', () => {
        assumeArrayBuffer();

        const onMessageListener = jasmine.createSpy('onMessageListener');
        const data = new ArrayBuffer(8);

        ws.addEventListener('message', onMessageListener);

        proxy.emitMessage(data);

        expect(onMessageListener).toHaveBeenCalledTimes(1);
        expect(onMessageListener.calls.mostRecent().args[0].data).toBe(data);
      });

      it('should fail to emit an invalid message', () => {
        const onMessageListener = jasmine.createSpy('onMessageListener');
        const data = [];

        ws.addEventListener('message', onMessageListener);

        expect(() => proxy.emitMessage(data)).toThrow(new Error(
          "Failed to receive message on 'WebSocket': Only String, Blob or ArrayBuffer are allowed. " +
          'The message is: [object Array].',
        ));

        expect(onMessageListener).not.toHaveBeenCalled();
      });

      it('should fail to emit a null message', () => {
        const onmessage = jasmine.createSpy('onmessage');
        const onMessageListener = jasmine.createSpy('onMessageListener');
        const data = null;

        ws.onmessage = onmessage;
        ws.addEventListener('message', onMessageListener);

        expect(() => proxy.emitMessage(data)).toThrow(new Error(
          "Failed to receive message on 'WebSocket': The message is null.",
        ));

        expect(onmessage).not.toHaveBeenCalled();
        expect(onMessageListener).not.toHaveBeenCalled();
      });

      it('should fail to emit an undefined message', () => {
        const onmessage = jasmine.createSpy('onmessage');
        const onMessageListener = jasmine.createSpy('onMessageListener');

        ws.onmessage = onmessage;
        ws.addEventListener('message', onMessageListener);

        expect(() => proxy.emitMessage()).toThrow(new Error(
          "Failed to receive message on 'WebSocket': The message is undefined.",
        ));

        expect(onmessage).not.toHaveBeenCalled();
        expect(onMessageListener).not.toHaveBeenCalled();
      });

      it('should close websocket with a code and a reason', () => {
        const onCloseListener = jasmine.createSpy('onCloseListener');
        const onClose = jasmine.createSpy('onclose');
        const code = 1000;
        const reason = 'Closed Manually';

        ws.addEventListener('close', onCloseListener);
        ws.onclose = onClose;
        ws.close(code, reason);

        expect(proxy.readyState).toBe(2);
        expect(proxy.closeHandshake()).not.toBeNull();

        proxy.closeHandshake().respond();

        expect(onCloseListener).toHaveBeenCalledTimes(1);
        expect(onClose).toHaveBeenCalledTimes(1);

        const e1 = onCloseListener.calls.mostRecent().args[0];
        const e2 = onClose.calls.mostRecent().args[0];
        expect(e1).toBe(e2);
        expect(e1.code).toBe(code);
        expect(e1.reason).toBe(reason);
        expect(e1.wasClean).toBe(true);
      });

      it('should close websocket with a code and a `null` reason', () => {
        const onCloseListener = jasmine.createSpy('onCloseListener');
        const code = 1000;
        const reason = null;

        ws.addEventListener('close', onCloseListener);
        ws.close(code, reason);

        proxy.closeHandshake().respond();

        expect(onCloseListener).toHaveBeenCalledTimes(1);

        const event = onCloseListener.calls.mostRecent().args[0];
        expect(event.code).toBe(code);
        expect(event.reason).toBe('null');
        expect(event.wasClean).toBe(true);
      });

      it('should close websocket with a code and a non string reason', () => {
        const onCloseListener = jasmine.createSpy('onCloseListener');
        const code = 1000;
        const reason = true;

        ws.addEventListener('close', onCloseListener);
        ws.close(code, reason);

        proxy.closeHandshake().respond();

        expect(onCloseListener).toHaveBeenCalledTimes(1);

        const event = onCloseListener.calls.mostRecent().args[0];
        expect(event.code).toBe(code);
        expect(event.reason).toBe('true');
        expect(event.wasClean).toBe(true);
      });

      it('should emit a close operation', () => {
        const onCloseListener = jasmine.createSpy('onCloseListener');
        ws.addEventListener('close', onCloseListener);

        proxy.emitClose();

        expect(proxy.readyState).toBe(2);
        expect(proxy.closeHandshake()).toBeDefined();
        expect(onCloseListener).not.toHaveBeenCalled();

        proxy.closeHandshake().respond();

        expect(proxy.readyState).toBe(3);
        expect(onCloseListener).toHaveBeenCalledTimes(1);

        const event = onCloseListener.calls.mostRecent().args[0];
        expect(event.code).toBe(1006);
        expect(event.reason).toBe('');
        expect(event.wasClean).toBe(false);
      });

      it('should emit a close operation with a custom code', () => {
        const onCloseListener = jasmine.createSpy('onCloseListener');
        const code = 1008;
        ws.addEventListener('close', onCloseListener);

        proxy.emitClose(code);

        expect(proxy.readyState).toBe(2);
        expect(proxy.closeHandshake()).toBeDefined();
        expect(onCloseListener).not.toHaveBeenCalled();

        proxy.closeHandshake().respond();

        expect(proxy.readyState).toBe(3);
        expect(onCloseListener).toHaveBeenCalledTimes(1);

        const event = onCloseListener.calls.mostRecent().args[0];
        expect(event.code).toBe(code);
        expect(event.reason).toBe('');
        expect(event.wasClean).toBe(false);
      });

      it('should emit a close operation with a custom code and reason', () => {
        const onCloseListener = jasmine.createSpy('onCloseListener');
        const code = 1008;
        const reason = 'Policy Violation';
        ws.addEventListener('close', onCloseListener);

        proxy.emitClose(code, reason);

        expect(proxy.readyState).toBe(2);
        expect(proxy.closeHandshake()).toBeDefined();
        expect(onCloseListener).not.toHaveBeenCalled();

        proxy.closeHandshake().respond();

        expect(proxy.readyState).toBe(3);
        expect(onCloseListener).toHaveBeenCalledTimes(1);

        const event = onCloseListener.calls.mostRecent().args[0];
        expect(event.code).toBe(code);
        expect(event.reason).toBe(reason);
        expect(event.wasClean).toBe(false);
      });
    });

    describe('once closing', () => {
      beforeEach(() => {
        ws = new FakeWebSocket('ws://localhost');
        proxy = new FakeWebSocketProxy(ws);
        proxy.openHandshake().respond();
        proxy.close();
      });

      it('should not re-close the websocket', () => {
        const closeHandshake = proxy.closeHandshake();
        const onCloseListener = jasmine.createSpy('onCloseListener');

        ws.addEventListener('close', onCloseListener);
        ws.close();

        expect(proxy.closeHandshake()).toBe(closeHandshake);
        expect(proxy.readyState).toBe(2);
        expect(onCloseListener).not.toHaveBeenCalled();
      });

      it('should failt to emit a close event', () => {
        expect(() => proxy.emitClose()).toThrow(new Error(
          'Cannot emit a close event, WebSocket is already closing.',
        ));
      });
    });

    describe('once closed', () => {
      beforeEach(() => {
        ws = new FakeWebSocket('ws://localhost');
        proxy = new FakeWebSocketProxy(ws);

        proxy.openHandshake().respond();
        proxy.close();
        proxy.closeHandshake().respond();
      });

      it('should not re-close the websocket', () => {
        const closeHandshake = proxy.closeHandshake();
        const onCloseListener = jasmine.createSpy('onCloseListener');

        ws.addEventListener('close', onCloseListener);
        ws.close();

        expect(proxy.closeHandshake()).toBe(closeHandshake);
        expect(proxy.readyState).toBe(3);
        expect(onCloseListener).not.toHaveBeenCalled();
      });

      it('should failt to emit a close event', () => {
        expect(() => proxy.emitClose()).toThrow(new Error(
          'Cannot emit a close event, WebSocket is already closed.',
        ));
      });
    });
  });
});
