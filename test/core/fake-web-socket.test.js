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

import {fakeEventFactory} from '../../src/core/fake-event.js';
import {fakeWebSocketFactory} from '../../src/core/fake-web-socket.js';

describe('FakeWebSocket', () => {
  let FakeWebSocket;
  let FakeEvent;

  beforeAll(() => {
    FakeEvent = fakeEventFactory();
    FakeWebSocket = fakeWebSocketFactory();
  });

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
    expect(ws.url).toBe('ws://localhost/');
    expect(ws.protocol).toBe('');
    expect(ws.extensions).toBe('');
    expect(ws.binaryType).toBe('blob');
    expect(ws.bufferedAmount).toBe(0);
  });

  describe('once initialized', () => {
    let ws;

    beforeEach(() => {
      ws = new FakeWebSocket('ws://localhost');
    });

    it('should set binaryType', () => {
      ws.binaryType = 'text';
      expect(ws.binaryType).toBe('text');
    });

    it('should initialize handlers to null', () => {
      expect(ws.onerror).toBeNull();
      expect(ws.onopen).toBeNull();
      expect(ws.onclose).toBeNull();
      expect(ws.onmessage).toBeNull();
    });

    it('should open websocket after handshake response', () => {
      const expectEventPhase = (e) => expect(e.eventPhase).toBe(2);
      const onopen = jasmine.createSpy('onopen').and.callFake(expectEventPhase);
      const onOpenListener = jasmine.createSpy('onOpenListener').and.callFake(expectEventPhase);

      ws.onopen = onopen;
      ws.addEventListener('open', onOpenListener);
      ws._openHandshake.respond();

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
      ws._openHandshake.respondWith({
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
      ws._openHandshake.fail();

      expect(ws.readyState).toBe(2);
      expect(onOpenListener).not.toHaveBeenCalled();
      expect(onErrorListener).toHaveBeenCalledTimes(1);

      const event = onErrorListener.calls.mostRecent().args[0];
      expect(event.type).toBe('error');
      expect(event.eventPhase).toBe(0);
    });

    it('should add event listener', () => {
      const event = new FakeEvent('open', ws);
      const listener = jasmine.createSpy('listener').and.callFake((e) => (
        expect(e.eventPhase).toBe(2)
      ));

      ws.addEventListener('open', listener);
      ws.dispatchEvent(event);

      expect(listener).toHaveBeenCalledWith(event);
      expect(event.eventPhase).toBe(0);
    });

    it('should not add duplicated event listener', () => {
      const listener = jasmine.createSpy('listener');
      const event = {type: 'open'};

      ws.addEventListener('open', listener);
      ws.dispatchEvent(event);

      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should not try to remove unregistered event listener', () => {
      const listener = jasmine.createSpy('listener');
      const event = {type: 'open'};

      ws.removeEventListener('open', listener);
      ws.dispatchEvent(event);

      expect(listener).not.toHaveBeenCalled();
    });

    it('should remove event listener', () => {
      const listener = jasmine.createSpy('listener');
      const event = new FakeEvent('open', ws);

      ws.addEventListener('open', listener);
      ws.removeEventListener('open', listener);
      ws.dispatchEvent(event);

      expect(listener).not.toHaveBeenCalled();
    });

    it('should dispatch event to event listeners', () => {
      const event = new FakeEvent('open', ws);
      const onmessage = jasmine.createSpy('onmessage');
      const onopen = jasmine.createSpy('onopen').and.callFake((e) => (
        expect(e.eventPhase).toBe(2)
      ));

      ws.addEventListener('open', onopen);
      ws.addEventListener('message', onmessage);

      const canceled = ws.dispatchEvent(event);

      expect(canceled).toBe(false);
      expect(onopen).toHaveBeenCalledWith(event);
      expect(onopen.calls.mostRecent().object).toBe(ws);
      expect(onmessage).not.toHaveBeenCalledWith();
      expect(event.eventPhase).toBe(0);
    });

    it('should catch errors in event listeners and execute next listeners', () => {
      spyOn(console, 'error');

      const onOpenListener1 = jasmine.createSpy('onOpenListener1').and.throwError('Error With Listener 1');
      const onOpenListener2 = jasmine.createSpy('onOpenListener2');
      const event = new FakeEvent('open', ws);

      ws.addEventListener('open', onOpenListener1);
      ws.addEventListener('open', onOpenListener2);
      ws.dispatchEvent(event);

      expect(onOpenListener1).toHaveBeenCalled();
      expect(onOpenListener2).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalled();
    });

    it('should dispatch event on objects implemeting the handleEvent method', () => {
      const onopen = {
        handleEvent: jasmine.createSpy('onopen').and.callFake((e) => (
          expect(e.eventPhase).toBe(2)
        )),
      };

      const onmessage = {
        handleEvent: jasmine.createSpy('onmessage'),
      };

      const event = new FakeEvent('open', ws);

      ws.addEventListener('open', onopen);
      ws.addEventListener('message', onmessage);

      const canceled = ws.dispatchEvent(event);

      expect(canceled).toBe(false);
      expect(onopen.handleEvent).toHaveBeenCalledWith(event);
      expect(onopen.handleEvent.calls.mostRecent().object).toBe(onopen);
      expect(onmessage.handleEvent).not.toHaveBeenCalledWith();
      expect(event.eventPhase).toBe(0);
    });

    it('should call direct method listeners', () => {
      const onmessage = jasmine.createSpy('onmessage');
      const event = new FakeEvent('open', ws);
      const onopen = jasmine.createSpy('onopen').and.callFake((e) => (
        expect(e.eventPhase).toBe(2)
      ));

      ws.onopen = onopen;
      ws.onmessage = onmessage;

      const canceled = ws.dispatchEvent(event);

      expect(canceled).toBe(false);
      expect(onopen).toHaveBeenCalledWith(event);
      expect(onopen.calls.mostRecent().object).toBe(ws);
      expect(onmessage).not.toHaveBeenCalledWith();
      expect(event.eventPhase).toBe(0);
    });

    it('should stop immediate propagation of event', () => {
      const listener1 = jasmine.createSpy('listener1').and.callFake((e) => e.stopImmediatePropagation());
      const listener2 = jasmine.createSpy('listener2');
      const event = new FakeEvent('open', ws);

      ws.addEventListener('open', listener1);
      ws.addEventListener('open', listener2);
      ws.dispatchEvent(event);

      expect(listener1).toHaveBeenCalledWith(event);
      expect(listener2).not.toHaveBeenCalled();
    });

    it('mark the connection as opened', () => {
      ws._openConnection({
        status: 101,
        headers: {
        },
      });

      expect(ws.readyState).toBe(1);
      expect(ws.protocol).toBeNull();
      expect(ws.extensions).toBeNull();
    });

    it('mark the connection as opened and trigger appropriate listeners', () => {
      const listener1 = jasmine.createSpy('listener1');
      const listener2 = jasmine.createSpy('listener2');

      ws.onopen = listener1;
      ws.addEventListener('open', listener2);
      ws._openConnection({
        status: 101,
        headers: {
        },
      });

      expect(ws.readyState).toBe(1);
      expect(listener1).toHaveBeenCalled();
      expect(listener2).toHaveBeenCalled();
    });

    it('fail to send a message if the open handshake is still pending', () => {
      const onErrorListener = jasmine.createSpy('onErrorListener');
      const onerror = jasmine.createSpy('onerror');

      ws.onerror = onerror;
      ws.addEventListener('error', onErrorListener);

      expect(() => ws.send('test')).toThrow(new Error(
          'Failed to execute \'send\' on \'WebSocket\': Still in CONNECTING state.'
      ));

      expect(onerror).not.toHaveBeenCalled();
      expect(onErrorListener).not.toHaveBeenCalled();
    });

    it('should fail to close the connection if the handshake is still pending', () => {
      const onCloseListener = jasmine.createSpy('onCloseListener');

      ws.addEventListener('close', onCloseListener);
      ws.close();

      expect(ws.readyState).toBe(2);
      expect(onCloseListener).not.toHaveBeenCalled();

      ws._closeHandshake.respond();

      expect(ws.readyState).toBe(3);
      expect(onCloseListener).toHaveBeenCalledTimes(1);

      const event = onCloseListener.calls.mostRecent().args[0];
      expect(event.code).toBe(1006);
      expect(event.reason).toBe('');
      expect(event.wasClean).toBe(false);
    });

    describe('once opened', () => {
      let ws;

      beforeEach(() => {
        ws = new FakeWebSocket('ws://localhost');
        ws._openHandshake.respond();
      });

      it('should fail to send data without argument', () => {
        expect(() => ws.send()).toThrow(new Error(
            'Failed to execute \'send\' on \'WebSocket\': 1 argument required, but only 0 present.'
        ));
      });

      it('should send string data', () => {
        const data1 = 'test1';
        const data2 = 'test2';

        ws.send(data1);
        expect(ws._sentMessages).toEqual([data1]);

        ws.send(data2);
        expect(ws._sentMessages).toEqual([data1, data2]);
      });

      it('should not send the empty string', () => {
        ws.send('');
        expect(ws._sentMessages).toEqual([]);
      });

      it('should close websocket', () => {
        const onCloseListener = jasmine.createSpy('onCloseListener');
        const onClose = jasmine.createSpy('onclose');

        ws.addEventListener('close', onCloseListener);
        ws.onclose = onClose;
        ws.close();

        expect(ws.readyState).toBe(2);
        expect(ws._closeHandshake).not.toBeNull();

        ws._closeHandshake.respond();

        expect(onCloseListener).toHaveBeenCalledTimes(1);
        expect(onClose).toHaveBeenCalledTimes(1);

        const e1 = onCloseListener.calls.mostRecent().args[0];
        const e2 = onClose.calls.mostRecent().args[0];
        expect(e1).toBe(e2);
        expect(e1.code).toBe(1005);
        expect(e1.reason).toBe('');
        expect(e1.wasClean).toBe(true);
      });

      it('should close websocket with a code and a reason', () => {
        const onCloseListener = jasmine.createSpy('onCloseListener');
        const onClose = jasmine.createSpy('onclose');
        const code = 1000;
        const reason = 'Closed Manually';

        ws.addEventListener('close', onCloseListener);
        ws.onclose = onClose;
        ws.close(code, reason);

        expect(ws.readyState).toBe(2);
        expect(ws._closeHandshake).not.toBeNull();

        ws._closeHandshake.respond();

        expect(onCloseListener).toHaveBeenCalledTimes(1);
        expect(onClose).toHaveBeenCalledTimes(1);

        const e1 = onCloseListener.calls.mostRecent().args[0];
        const e2 = onClose.calls.mostRecent().args[0];
        expect(e1).toBe(e2);
        expect(e1.code).toBe(code);
        expect(e1.reason).toBe(reason);
        expect(e1.wasClean).toBe(true);
      });

      it('should fail close websocket with a code reason with a lenth > 123', () => {
        const onCloseListener = jasmine.createSpy('onCloseListener');
        const onClose = jasmine.createSpy('onclose');
        const code = 1000;
        const reason = (() => {
          let str = '';

          for (let i = 0; i < 125; ++i) {
            str += 'x';
          }

          return str;
        })();

        ws.addEventListener('close', onCloseListener);
        ws.onclose = onClose;
        expect(() => ws.close(code, reason)).toThrow(new Error(
            'Failed to execute \'close\' on \'WebSocket\': The message must not be greater than 123 bytes.'
        ));

        expect(onCloseListener).not.toHaveBeenCalled();
        expect(onClose).not.toHaveBeenCalled();
      });

      it('should close websocket with a code and a `null` reason', () => {
        const onCloseListener = jasmine.createSpy('onCloseListener');
        const code = 1000;
        const reason = null;

        ws.addEventListener('close', onCloseListener);
        ws.close(code, reason);
        ws._closeHandshake.respond();

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
        ws._closeHandshake.respond();

        expect(onCloseListener).toHaveBeenCalledTimes(1);

        const event = onCloseListener.calls.mostRecent().args[0];
        expect(event.code).toBe(code);
        expect(event.reason).toBe('true');
        expect(event.wasClean).toBe(true);
      });

      it('should fail to close websocket with invalid code', () => {
        const onCloseListener = jasmine.createSpy('onCloseListener');
        const onClose = jasmine.createSpy('onclose');

        ws.addEventListener('close', onCloseListener);
        ws.onclose = onClose;

        const verify = (i) => (
          expect(() => ws.close(i)).toThrow(new Error(
              `Failed to execute 'close' on 'WebSocket': The code must be either 1000, or between 3000 and 4999. ` +
              `${i} is neither.`
          ))
        );

        for (let i = 0; i < 1000; ++i) {
          verify(i);
        }

        for (let i = 1001; i < 3000; ++i) {
          verify(i);
        }

        for (let i = 5000; i < 6000; ++i) {
          verify(i);
        }

        expect(onCloseListener).not.toHaveBeenCalled();
        expect(onClose).not.toHaveBeenCalled();
      });
    });

    describe('once closing', () => {
      let ws;

      beforeEach(() => {
        ws = new FakeWebSocket('ws://localhost');
        ws._openHandshake.respond();
        ws.close();
      });

      it('should faile to send data', () => {
        expect(() => ws.send('test')).toThrow(new Error(
            'WebSocket is already in CLOSING or CLOSED state.'
        ));
      });

      it('should not re-close the websocket', () => {
        const closeHandshake = ws._closeHandshake;
        const onCloseListener = jasmine.createSpy('onCloseListener');

        ws.addEventListener('close', onCloseListener);
        ws.close();

        expect(ws._closeHandshake).toBe(closeHandshake);
        expect(ws.readyState).toBe(2);
        expect(onCloseListener).not.toHaveBeenCalled();
      });
    });

    describe('once closed', () => {
      let ws;

      beforeEach(() => {
        ws = new FakeWebSocket('ws://localhost');
        ws._openHandshake.respond();
        ws.close();
        ws._closeHandshake.respond();
      });

      it('should fail to send data', () => {
        expect(() => ws.send('test')).toThrow(new Error(
            'WebSocket is already in CLOSING or CLOSED state.'
        ));
      });

      it('should not re-close the websocket', () => {
        const closeHandshake = ws._closeHandshake;
        const onCloseListener = jasmine.createSpy('onCloseListener');

        ws.addEventListener('close', onCloseListener);
        ws.close();

        expect(ws._closeHandshake).toBe(closeHandshake);
        expect(ws.readyState).toBe(3);
        expect(onCloseListener).not.toHaveBeenCalled();
      });
    });
  });
});
