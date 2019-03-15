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

interface Iteratee<T> {
  (x: T, idx?: number, array?: T[]): boolean;
}

/**
 * Returns elements in given array for wich predicate returns a truthy value.
 *
 * @param {Array<*>} array The given array.
 * @param {function} iteratee The given predicate.
 * @return {Array<*>} Filtered results.
 */
export function filter<T>(array: T[], iteratee: Iteratee<T>): T[] {
  const results: T[] = [];

  for (let i: number = 0, size: number = array.length; i < size; ++i) {
    const current: T = array[i];
    if (iteratee.call(null, current, i, array)) {
      results.push(current);
    }
  }

  return results;
}
