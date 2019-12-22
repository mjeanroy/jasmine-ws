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

import {forEach} from './for-each.js';
import {has} from './has.js';
import {keys} from './keys.js';

/**
 * Copy the values of all enumerable own properties from one or more source objects to a
 * target object
 *  It will return the target object.
 *
 * @param {*} target The target object.
 * @param  {...any} sources  The source objects.
 * @return {Object} The target object.
 */
export function assign(target, ...sources) {
  const to = Object(target);

  for (let i = 0, size = sources.length; i < size; ++i) {
    const current = sources[i];
    const currentKeys = keys(current);
    forEach(currentKeys, (k) => {
      if (!has(to, k)) {
        to[k] = current[k];
      }
    });
  }

  return to;
}
