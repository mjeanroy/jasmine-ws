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

import { has } from './has';

/**
 * Check that a given predicate returns a truthy value for each elements in the
 * given array (if array is empty, this function will returns `true`).
 *
 * @param {Array<*>} array The given array.
 * @param {function} iteratee The given predicate.
 * @return {boolean} `true` if `predicate` returns a truthy values for all elements in array, `false` otherwise.
 */
export function countBy(array, iteratee) {
  const counters = {};

  for (let i = 0, size = array.length; i < size; ++i) {
    const key = iteratee.call(null, array[i], i, array);
    const count = has(counters, key) ? counters[key] : 0;
    counters[key] = count + 1;
  }

  return counters;
}
