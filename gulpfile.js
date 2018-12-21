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

const gulp = require('gulp');
const clean = require('./tasks/clean.js');
const lint = require('./tasks/lint.js');
const bundle = require('./tasks/bundle.js');
const test = require('./tasks/test.js');
const release = require('./tasks/release.js');

const prepare = gulp.parallel(clean, lint);
const build = gulp.series(prepare, bundle);

module.exports = {
  'clean': clean,
  'lint': lint,
  'build': build,
  'tdd': test.tdd,
  'test': gulp.series(prepare, test.test),
  'travis': gulp.series(prepare, test.travis),
  'release:patch': gulp.series(build, release.patch),
  'release:minor': gulp.series(build, release.minor),
  'release:major': gulp.series(build, release.major),
};
