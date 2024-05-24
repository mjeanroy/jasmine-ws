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
import { fakeMessageEventFactory } from '../../src/core/fake-message-event';

describe('FakeMessageEvent', () => {
  let FakeWebSocket;
  let FakeMessageEvent;

  beforeAll(() => {
    FakeMessageEvent = fakeMessageEventFactory();
    FakeWebSocket = fakeWebSocketFactory();
  });

  it('should create the fake event', () => {
    const data = 'test';
    const target = new FakeWebSocket('ws://localhost');
    const event = new FakeMessageEvent(target, data);

    expect(event.type).toBe('message');
    expect(event.eventPhase).toBe(0);
    expect(event.cancelable).toBe(false);
    expect(event.composed).toBe(false);
    expect(event.defaultPrevented).toBe(false);
    expect(event.bubbles).toBe(false);
    expect(event.isTrusted).toBe(true);
    expect(event.timeStamp).toBeDefined();
    expect(event.cancelBubble).toBe(false);
    expect(event.returnValue).toBe(true);
    expect(event.target).toBe(target);
    expect(event.currentTarget).toBe(target);
    expect(event.srcElement).toBe(target);

    expect(event.data).toBe(data);
    expect(event.lastEventId).toBeDefined();
    expect(event.origin).toBe('ws://localhost');
    expect(event.source).toBeNull();
    expect(event.ports).toEqual([]);
  });

  it('should create the fake event and extract origin from URL', () => {
    const data = 'test';
    const target = new FakeWebSocket('ws://localhost/ws');
    const event = new FakeMessageEvent(target, data);
    expect(event.origin).toBe('ws://localhost');
  });

  describe('once created', () => {
    let event;

    beforeEach(() => {
      event = new FakeMessageEvent(
        new FakeWebSocket('ws://localhosot'),
      );
    });

    it('should prevent default if event is caccelable', () => {
      event._cancelable = true;
      event.preventDefault();
      expect(event.defaultPrevented).toBe(true);
    });

    it('should not prevent default if event is not caccelable', () => {
      event.preventDefault();
      expect(event.defaultPrevented).toBe(false);
    });

    it('should stop propagation', () => {
      event.stopPropagation();
      expect(event.cancelBubble).toBe(true);
    });

    it('should stop immediate propagation', () => {
      event.stopImmediatePropagation();
      expect(event.cancelBubble).toBe(true);
    });
  });
});
