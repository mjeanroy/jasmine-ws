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

import {factory} from './common/factory.js';

export const fakeEventFactory = factory(() => {
  /**
   * No event is being processed at this time.
   * @type {number}
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase#Constants
   */
  const NONE = 0;

  /**
   * The event is being propagated through the target's ancestor objects.
   * This process starts with the Window, then Document, then the HTMLHtmlElement, and so on through
   * the elements until the target's parent is reached.
   * Event listeners registered for capture mode when EventTarget.addEventListener() was called are
   * triggered during this phase.
   *
   * @type {number}
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase#Constants
   */
  const CAPTURING_PHASE = 1;

  /**
   * The event has arrived at the event's target. Event listeners registered for this phase are
   * called at this time.
   * If Event.bubbles is `false`, processing the event is finished after this phase is complete.
   *
   * @type {number}
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase#Constants
   */
  const AT_TARGET = 2;

  /**
   * The event is propagating back up through the target's ancestors in reverse order,
   * starting with the parent, and eventually reaching the containing Window.
   * This is known as bubbling, and occurs only if Event.bubbles is `true`.
   * Event listeners registered for this phase are triggered during this process.
   *
   * @type {number}
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase#Constants
   */
  const BUBBLING_PHASE = 3;

  /**
   * A fake implementation of `Event`.
   *
   * @class
   */
  class FakeEvent {
    /**
     * Create the fake `Event` class.
     *
     * @param {string} type The event type.
     * @param {*} target The event target.
     * @constructor
     */
    constructor(type, target) {
      this._type = type;
      this._eventPhase = NONE;
      this._cancelable = false;
      this._defaultPrevented = false;
      this._bubbles = false;
      this._isTrusted = true;
      this._composed = false;
      this._timeStamp = new Date().getTime();
      this._stopped = false;

      this._target = target;
      this._currentTarget = target;
      this._srcElement = target;

      // Non readonly properties.
      this.returnValue = true;
      this.cancelBubble = false;
    }

    /**
     * The name of the event (case-insensitive).
     *
     * @return {string} The event type.
     */
    get type() {
      return this._type;
    }

    /**
     * Indicates which phase of the event flow is currently being evaluated.
     *
     * @return {number} An integer value which specifies the current evaluation phase.
     */
    get eventPhase() {
      return this._eventPhase;
    }

    /**
     * A Boolean indicating whether the event is cancelable.
     *
     * @return {boolean} The `cancelable` flag.
     */
    get cancelable() {
      return this._cancelable;
    }

    /**
     * Indicates whether or not event.preventDefault() has been called on the event.
     *
     * @return {boolean} `true` if `preventDefault` has been called, `false` otherwise.
     */
    get defaultPrevented() {
      return this._defaultPrevented;
    }

    /**
     * A Boolean indicating whether the event bubbles up through the DOM or not.
     *
     * @return {boolean} The `bubbles` flag.
     */
    get bubbles() {
      return this._bubbles;
    }

    /**
     * A Boolean value indicating whether or not the event can bubble across the
     * boundary between the shadow DOM and the regular DOM.
     *
     * @return {boolean} The `composed` flag.
     */
    get composed() {
      return this._composed;
    }

    /**
     * The time at which the event was created (in milliseconds)
     *  By specification, this value is time since epoch.
     *
     * @return {number} The timestamp of event creation.
     */
    get timeStamp() {
      return this._timeStamp;
    }

    /**
     * The isTrusted read-only property of the Event interface is a boolean that is true
     * when the event was generated by a user action, and false when the event was
     * created or modified by a script or dispatched via dispatchEvent.
     *
     * @return {boolean} The `isTrusted` flag.
     */
    get isTrusted() {
      return this._isTrusted;
    }

    /**
     * A reference to the currently registered target for the event.
     * This is the object to which the event is currently slated to be sent; it's possible
     * this has been changed along the way through retargeting.
     *
     * @return {Object} The event target.
     */
    get currentTarget() {
      return this._currentTarget;
    }

    /**
     * A reference to the target to which the event was originally dispatched.
     *
     * @return {Object} The event target.
     */
    get target() {
      return this._target;
    }

    /**
     * The non-standard alias (from old versions of Microsoft Internet Explorer) for Event.target,
     * which is starting to be supported in some other browsers for web compatibility purposes.
     *
     * @return {Object} The event target.
     */
    get srcElement() {
      return this._srcElement;
    }

    /**
     * Initializes the value of an Event created. If the event has already being
     * dispatched, this method does nothing.
     *
     * @return {void}
     */
    initEvent() {
    }

    /**
     * Cancels the event (if it is cancelable).
     *
     * @return {void}
     */
    preventDefault() {
      if (this._cancelable) {
        this._defaultPrevented = true;
      }
    }

    /**
     * For this particular event, no other listener will be called.
     * Neither those attached on the same element, nor those attached on elements
     * which will be traversed later (in capture phase, for instance).
     *
     * @return {void}
     */
    stopImmediatePropagation() {
      this.cancelBubble = true;
      this._stopped = true;
    }

    /**
     * Stops the propagation of events further along in the DOM.
     *
     * @return {void}
     */
    stopPropagation() {
      this.cancelBubble = true;
    }
  }

  FakeEvent.NONE = NONE;
  FakeEvent.BUBBLING_PHASE = BUBBLING_PHASE;
  FakeEvent.CAPTURING_PHASE = CAPTURING_PHASE;
  FakeEvent.AT_TARGET = AT_TARGET;

  return FakeEvent;
});
