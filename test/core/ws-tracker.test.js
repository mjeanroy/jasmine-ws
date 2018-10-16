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

import {track, reset, wsTracker} from '../../src/core/ws-tracker.js';

describe('wsTracker', () => {
  it('should get mostRecent connection', () => {
    const ws = jasmine.createSpyObj('FakeWebSocket', ['send', 'close']);

    track(ws);

    expect(wsTracker.mostRecent()).toBe(ws);
    expect(wsTracker.first()).toBe(ws);
    expect(wsTracker.at(0)).toBe(ws);
    expect(wsTracker.count()).toBe(1);
    expect(wsTracker.all()).toEqual([ws]);
  });

  it('should get first connection', () => {
    const ws1 = jasmine.createSpyObj('FakeWebSocket', ['send', 'close']);
    const ws2 = jasmine.createSpyObj('FakeWebSocket', ['send', 'close']);

    track(ws1);
    track(ws2);

    expect(wsTracker.mostRecent()).toBe(ws2);
    expect(wsTracker.first()).toBe(ws1);
    expect(wsTracker.at(0)).toBe(ws1);
    expect(wsTracker.at(1)).toBe(ws2);
    expect(wsTracker.count()).toBe(2);
    expect(wsTracker.all()).toEqual([ws1, ws2]);
  });

  it('should reset tracked connection', () => {
    const ws1 = jasmine.createSpyObj('FakeWebSocket', ['send', 'close']);
    const ws2 = jasmine.createSpyObj('FakeWebSocket', ['send', 'close']);

    track(ws1);
    track(ws2);

    expect(wsTracker.mostRecent()).toBe(ws2);
    expect(wsTracker.first()).toBe(ws1);
    expect(wsTracker.at(0)).toBe(ws1);
    expect(wsTracker.at(1)).toBe(ws2);
    expect(wsTracker.count()).toBe(2);
    expect(wsTracker.all()).toEqual([ws1, ws2]);

    reset();

    expect(wsTracker.mostRecent()).toBeUndefined();
    expect(wsTracker.first()).toBeUndefined();
    expect(wsTracker.at(0)).toBeUndefined();
    expect(wsTracker.at(1)).toBeUndefined();
    expect(wsTracker.count()).toBe(0);
    expect(wsTracker.all()).toEqual([]);
  });
});
