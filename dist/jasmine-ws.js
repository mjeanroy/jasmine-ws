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
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

(function() {
  'use strict';

  /**
   * Iterates over elements of collection, returning the first element predicate returns truthy for.
   *
   * @param {Array<*>} array The given array.
   * @param {function} predicate The given predicate.
   * @return {*} The first result.
   */
  function find(array, predicate) {
    for (var i = 0, size = array.length; i < size; ++i) {
      if (predicate.call(null, array[i], i, array)) {
        return array[i];
      }
    }

    return undefined;
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor)
        descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    }
  }

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  /**
   * The `Object` prototype.
   * @type {Object}
   */
  var ObjectProto = Object.prototype;

  /**
   * Check if a given object has given key as own property.
   *
   * @param {Object} object The given object.
   * @param {string} key The given key.
   * @return {boolean} `true` if `objecct` has given `key`, `false`otherwise.
   */

  function has(object, key) {
    return ObjectProto.hasOwnProperty.call(object, key);
  }

  /**
   * Check that a given predicate returns a truthy value for each elements in the
   * given array (if array is empty, this function will returns `true`).
   *
   * @param {Array<*>} array The given array.
   * @param {function} iteratee The given predicate.
   * @return {boolean} `true` if `predicate` returns a truthy values for all elements in array, `false` otherwise.
   */

  function countBy(array, iteratee) {
    var counters = {};

    for (var i = 0, size = array.length; i < size; ++i) {
      var key = iteratee.call(null, array[i], i, array);
      var count = has(counters, key) ? counters[key] : 0;
      counters[key] = count + 1;
    }

    return counters;
  }

  /**
   * Returns the first index at which a given element can be found in the array, or -1 if it is not present.
   *
   * @param {Array<*>} array The array.
   * @param {*} item The element to look for.
   * @return {number} The index of element in the array, -1 otherwise.
   */
  function indexOf(array, item) {
    return array.indexOf(item);
  }

  /**
   * Returns the first index at which a given element can be found in the array, or -1 if it is not present.
   *
   * @param {Array<*>} array The array.
   * @param {*} item The element to look for.
   * @return {number} The index of element in the array, -1 otherwise.
   */

  function includes(array, item) {
    return indexOf(array, item) >= 0;
  }

  /**
   * The factory value initializer.
   * @type {Object}
   */
  var NULL_OBJECT = {};
  /**
   * A factory that will build a given getter function to compute a value once (and
   * only once).
   *
   * @param {function} factoryFn The factory function.
   * @return {function} The getter function.
   */

  function factory(factoryFn) {
    var value = NULL_OBJECT;
    return function() {
      if (value === NULL_OBJECT) {
        value = factoryFn();
      }

      return value;
    };
  }

  /**
   * Returns elements in given array for wich predicate returns a truthy value.
   *
   * @param {Array<*>} array The given array.
   * @param {function} iteratee The given predicate.
   * @return {Array<*>} Filtered results.
   */
  function filter(array, iteratee) {
    var results = [];

    for (var i = 0, size = array.length; i < size; ++i) {
      if (iteratee.call(null, array[i], i, array)) {
        results.push(array[i]);
      }
    }

    return results;
  }

  /**
   * Iterates over elements of collection and invokes iteratee for each element.
   *
   * @param {Array<*>} array The given array.
   * @param {function} iteratee The given iteratee function.
   * @return {void}
   */
  function forEach(array, iteratee) {
    for (var i = 0, size = array.length; i < size; ++i) {
      iteratee.call(null, array[i], i, array);
    }
  }

  /**
   * Check if a given value is `null`.
   *
   * @param {*} value The value to check.
   * @return {boolean} `true` if `value` is a `null`, `false`otherwise.
   */
  function isNull(value) {
    return value === null;
  }

  /**
   * Check if a given value is `undefined`.
   *
   * @param {*} value The value to check.
   * @return {boolean} `true` if `value` is a `undefined`, `false`otherwise.
   */
  function isUndefined(value) {
    return value === void 0;
  }

  /**
   * Return the tag name of the object (a.k.a the result of `Object.prototype.toString`).
   *
   * @param {*} value Object to get tag name.
   * @return {string} Tag name.
   */

  function tagName(value) {
    if (isNull(value)) {
      return '[object Null]';
    }

    if (isUndefined(value)) {
      return '[object Undefined]';
    }

    return ObjectProto.toString.call(value);
  }

  /**
   * Check that a given value is of a given type.
   * The type is the tag name displayed with `Object.prototype.toString`
   * function call.
   *
   * @param {*} value Value to check.
   * @param {string} type The type id.
   * @return {boolean} `true` if `obj` is of given type, `false` otherwise.
   */

  function is(value, type) {
    return tagName(value) === "[object ".concat(type, "]");
  }

  /**
   * Check if a given value is a `string` value.
   *
   * @param {*} value The value to check.
   * @return {boolean} `true` if `value` is a `string`, `false`otherwise.
   */

  function isFunction(value) {
    return is(value, 'Function');
  }

  /**
   * Check if a given value is a `string` value.
   *
   * @param {*} value The value to check.
   * @return {boolean} `true` if `value` is a `string`, `false`otherwise.
   */

  function isString(value) {
    return is(value, 'String');
  }

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

  /**
   * A fake `URL` implementation.
   *
   * @class
   */
  var FakeUrl =
  /*#__PURE__*/
  function() {
    /**
     * Build the fake `URL`.
     *
     * @param {string} protocol The URL protocol.
     * @param {string} username  The URL username.
     * @param {string} password The URL password.
     * @param {string} host The URL host.
     * @param {string} hostname The URL hostname.
     * @param {string} port The URL port.
     * @param {string} pathname The URL pathname.
     * @param {string} search  The URL search (a.k.a the query string).
     * @param {string} hash The URL hash (a.k.a the fragment).
     * @constructor
     */
    function FakeUrl(protocol, username, password, host, hostname, port, pathname, search, hash) {
      _classCallCheck(this, FakeUrl);

      this.protocol = protocol;
      this.username = username || '';
      this.password = password || '';
      this.host = host || null;
      this.hostname = hostname || null;
      this.port = port || null;
      this.pathname = pathname || '';
      this.search = search || '';
      this.hash = hash || ''; // Ensure the pathname always starts with a '/'

      if (this.pathname[0] !== '/') {
        this.pathname = '/' + this.pathname;
      }
    }
    /**
     * Serialize the URL to a `string`.
     *
     * @return {string} The serialized value.
     * @override
     */


    _createClass(FakeUrl, [{
      key: "toString",
      value: function toString() {
        // 1- Let output be url’s scheme and U+003A (:) concatenated.
        var output = this.protocol; // 2- If url’s host is non-null:

        if (this.host !== null) {
          // 2-1 Append "//" to output.
          output += '//'; // 2-2 If url includes credentials, then:

          if (this.username !== '' || this.password !== '') {
            // 2-2-1 Append url’s username to output.
            output += this.username; // 2-2-2 If url’s password is not the empty string, then append U+003A (:), followed by url’s
            // password, to output.

            if (this.password !== '') {
              output += this.password;
              output += ':';
            } // 2-2-3 Append U+0040 (@) to output.


            output += '@';
          } // 2-3 Append url’s host, serialized, to output.


          output += this.hostname; // 2-4 If url’s port is non-null, append U+003A (:) followed by url’s port, serialized, to output.

          if (this.port !== null) {
            output += ':';
            output += this.port;
          }
        } // 3- Otherwise, if url’s host is null and url’s scheme is "file", append "//" to output.


        if (this.host === null && this.protocol === 'file:') {
          output += '//';
        } // 4- Otherwise, then for each string in url’s path, append U+002F (/) followed by the string to output.


        output += this.pathname; // 5- If url’s query is non-null, append U+003F (?), followed by url’s query, to output.

        if (this.search !== '') {
          output += this.search;
        } // 6- If the exclude fragment flag is unset and url’s fragment is non-null, append U+0023 (#),
        // followed by url’s fragment, to output.


        if (this.hash !== '') {
          output += this.hash;
        }

        return output;
      }
    }]);

    return FakeUrl;
  }();
  /**
   * Parse URL using native API.
   *
   * @param {string} url The URL.
   * @return {FakeUrl} The parsed URL.
   */


  function nativeUrl(url) {
    var result = new URL(url);
    return new FakeUrl(result.protocol, result.username, result.password, result.host, result.hostname, result.port, result.pathname, result.search, result.hash);
  }
  /**
   * Parse URL using polyfill url parser.
   *
   * @param {string} url The URL.
   * @return {FakeUrl} The parsed URL.
   */


  function polyfillUrl(url) {
    var a = document.createElement('a');
    a.href = url;
    return new FakeUrl(a.protocol, a.username, a.password, a.host, a.hostname, a.port, a.pathname, a.search, a.hash);
  }
  /**
   * Ensure that given URL is valid with expected values.
   *
   * @param {URL} url The URL.
   * @param {string} protocol The expected protocol part.
   * @param {string} hostname The expected hostname part.
   * @param {string} port The expected port part.
   * @param {string} pathname The expected pathname part.
   * @param {string} search The expected search part.
   * @return {boolean} `true` if `url` has expected settings, `false` otherwise.
   */


  function ensureUrl(url, protocol, hostname, port, pathname, search) {
    return url !== null && url.protocol === protocol && url.hostname === hostname && url.port === port && url.host === "".concat(hostname, ":").concat(port) && url.pathname === pathname;
  }
  /**
   * Check for `URL` support in current environment.
   *
   * @return {boolean} `true` if `URL` supported, `false` otherwise.
   */


  function checkUrlSupport() {
    try {
      var url = new URL('http://localhost:8080/test?q') !== null;
      return ensureUrl(url, 'http:', 'localhost', '8080', '/test', '?q');
    } catch (e) {
      return false;
    }
  }

  var toUrl = checkUrlSupport() ? nativeUrl : polyfillUrl;
  /**
   * Parse given URL to a new `URL` instance, returns `null` if URL parsing fails.
   *
   * @param {string} url The URL.
   * @return {FakeUrl} The parsed URL.
   */

  function parseUrl(url) {
    if (!url) {
      return null;
    }

    try {
      return toUrl(url);
    } catch (e) {
      return null;
    }
  }

  /**
   * Get all own enumerable keys of given `object`.
   *
   * @param {Object} object The object.
   * @return {Array<string>} The own enumerable keys of given `object`.
   */
  function keys(object) {
    return Object.keys(object);
  }

  /**
   * Map each elements of given array to an array of new elements, each one
   * being the results of the `iteratee` function.
   *
   * @param {Array<*>} array The given array.
   * @param {function} iteratee The given predicate.
   * @return {Array<*>} The new results.
   */
  function map(array, iteratee) {
    var results = [];

    for (var i = 0, size = array.length; i < size; ++i) {
      results.push(iteratee.call(null, array[i], i, array));
    }

    return results;
  }

  /**
   * Creates an array of own enumerable string keyed-value pairs for object.
   *
   * @param {Object} object The given object.
   * @return {Array<Object>} The array of pairs.
   */

  function toPairs(object) {
    return map(keys(object), function(k) {
      return [k, object[k]];
    });
  }

  /**
   * Copy the values of all enumerable own properties from one or more source objects to a
   * target object
   *  It will return the target object.
   *
   * @param {*} target The target object.
   * @param  {...any} sources  The source objects.
   * @return {Object} The target object.
   */

  function assign(target) {
    var _arguments = arguments;
    var to = Object(target);

    var _loop = function _loop(i, size) {
      var current = i + 1 < 1 || _arguments.length <= i + 1 ? undefined : _arguments[i + 1];
      var currentKeys = keys(current);
      forEach(currentKeys, function(k) {
        if (!has(to, k)) {
          to[k] = current[k];
        }
      });
    };

    for (var i = 0, size = arguments.length <= 1 ? 0 : arguments.length - 1; i < size; ++i) {
      _loop(i, size);
    }

    return to;
  }

  var fakeOpenHandshakeFactory = factory(function() {
    /**
     * A fake Handshake for the open request.
     */
    var FakeOpenHandshake =
    /*#__PURE__*/
    function() {
      /**
       * Create the fake handshake request.
       *
       * @param {FakeWebSocket} ws The WebSocket.
       * @constructor
       */
      function FakeOpenHandshake(ws) {
        _classCallCheck(this, FakeOpenHandshake);

        this._ws = ws;
        var scheme = ws._url.protocol === 'ws:' ? 'http' : 'https';
        var host = ws._url.host;
        var path = ws._url.pathname;
        var search = ws._url.search;
        this._response = null;
        this._request = {
          method: 'GET',
          url: "".concat(scheme, "://").concat(host).concat(path).concat(search),
          headers: {
            'Upgrade': 'websocket',
            'Sec-WebSocket-Key': 'AQIDBAUGBwgJCgsMDQ4PEC==',
            'Sec-WebSocket-Version': '13'
          }
        };

        var protocols = ws._protocols.join(',');

        if (protocols) {
          this._request.headers['Sec-WebSocket-Protocol'] = protocols;
        }
      }
      /**
       * Get the request handshake URL.
       *
       * @return {string} The request URL.
       */


      _createClass(FakeOpenHandshake, [{
        key: "getRequest",

        /**
         * Get the handhake request.
         *
         * @return {Object} The request.
         */
        value: function getRequest() {
          return this._request;
        }
        /**
         * Get the triggered handshake response, `null` until the response
         * has not been triggered.
         *
         * @return {Object} The handshake response.
         */

      }, {
        key: "getResponse",
        value: function getResponse() {
          return this._response;
        }
        /**
         * Trigger handshake response.
         *
         * @return {void}
         */

      }, {
        key: "respond",
        value: function respond() {
          this.respondWith({
            status: 101
          });
        }
        /**
         * Trigger handshake response error with a default status of `500`.
         *
         * @param {number} status The handshake response status.
         * @return {void}
         */

      }, {
        key: "fail",
        value: function fail() {
          var status = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 500;

          if (status === 101) {
            throw new Error('Cannot fail open handshake with status 101, use `respond` method instead.');
          }

          this.respondWith({
            status: status
          });
        }
        /**
         * Trigger handshake response, filled unkown field with
         * default values:
         * - Default status is `101`,
         * - Default headers are:
         *   - `Upgrade: websocket`
         *   - `Connection: Upgrade`
         *   - `Sec-WebSocket-Accept: [a given accept key]`
         *
         * @param {Object} response The handshake response.
         * @return {void}
         */

      }, {
        key: "respondWith",
        value: function respondWith() {
          var response = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
          var responseStatus = response.status;
          var responseHeaders = responseStatus !== 101 ? {} : {
            'Upgrade': 'websocket',
            'Connection': 'Upgrade',
            'Sec-WebSocket-Accept': 's3pPLMBiTxaQ9kYGzzhZRbK+xOo='
          };

          this._triggerResponse(assign({}, response, {
            status: 101,
            headers: responseHeaders
          }));
        }
        /**
         * Trigger the handshake response (note that if the handshake response has already been triggered,
         * this method will throw an error).
         *
         * @param {object} response The handshake response.
         * @return {void}
         */

      }, {
        key: "_triggerResponse",
        value: function _triggerResponse(response) {
          if (this._isClosed()) {
            throw new Error('Cannot trigger handshake response since the open handshake is already closed.');
          }

          this._response = response; // If the handhsake response does not a return a status code strictly equals to 101, then it means
          // that the connection cannot be opened.
          // For example, it may return a redirect code (3XX) or a forbidden code (401, 403).
          // Note that the `WebSocket` protocol does not specify that a connection must be retried or that
          // redirect should be followed.

          if (response.status === 101) {
            this._ws._openConnection(response);
          } else {
            this._ws._failConnection(response);
          }
        }
        /**
         * Check if the handshake operation is closed, i.e if the response has already
         * been triggered.
         *
         * @return {boolean} `true` if the handshake response has been triggered, `false` otherwise.
         */

      }, {
        key: "_isClosed",
        value: function _isClosed() {
          return this._response !== null;
        }
      }, {
        key: "url",
        get: function get() {
          return this._request.url;
        }
        /**
         * Get the request handshake method (for now, always returns `'GET'`).
         *
         * @return {string} The request method.
         */

      }, {
        key: "method",
        get: function get() {
          return this._request.method;
        }
        /**
         * Get the request handshake headers (containing for example the `Sec-WebSocket-Protocol` header).
         *
         * @return {Object} The headers dictionary.
         */

      }, {
        key: "headers",
        get: function get() {
          return this._request.headers;
        }
      }]);

      return FakeOpenHandshake;
    }();

    return FakeOpenHandshake;
  });

  var fakeCloseHandshakeFactory = factory(function() {
    /**
     * A fake Handshake for the close request.
     */
    var FakeCloseHandshake =
    /*#__PURE__*/
    function() {
      /**
       * Create the fake event.
       *
       * @param {FakeWebSocket} ws The WebSocket.
       * @param {number} code The close code.
       * @param {string} reason The close reason.
       * @param {boolean} wasClean A `boolean` that Indicates whether or not the connection was cleanly closed.
       * @constructor
       */
      function FakeCloseHandshake(ws, code, reason, wasClean) {
        _classCallCheck(this, FakeCloseHandshake);

        this._ws = ws;
        this._request = {
          code: code,
          reason: reason,
          wasClean: wasClean
        };
        this._response = null;
      }
      /**
       * Trigger the close handshake response.
       *
       * @return {void}
       */


      _createClass(FakeCloseHandshake, [{
        key: "respond",
        value: function respond() {
          this._triggerResponse({
            code: this._request.code,
            reason: this._request.reason,
            wasClean: this._request.wasClean
          });
        }
        /**
         * The close code identifier.
         *
         * @return {number} The close code.
         */

      }, {
        key: "_triggerResponse",

        /**
         * Trigger the handshake response.
         *
         * @param {Object} response The handshake response.
         * @return {void}
         */
        value: function _triggerResponse(response) {
          if (this._isClosed()) {
            throw new Error('Cannot trigger handshake response since the close handshake is already closed.');
          }

          this._response = response;

          this._ws._doClose(response.code, response.reason, response.wasClean);
        }
        /**
         * Check if the handshake operation is closed, i.e if the response has already
         * been triggered.
         *
         * @return {boolean} `true` if the handshake response has been triggered, `false` otherwise.
         */

      }, {
        key: "_isClosed",
        value: function _isClosed() {
          return this._response !== null;
        }
      }, {
        key: "code",
        get: function get() {
          return this._request.code;
        }
        /**
         * The close reason.
         *
         * @return {string} The close r
         */

      }, {
        key: "reason",
        get: function get() {
          return this._request.reason;
        }
        /**
         * A `boolean` that Indicates whether or not the connection was cleanly closed.
         *
         * @return {boolean} The clean flag.
         */

      }, {
        key: "wasClean",
        get: function get() {
          return this._request.wasClean;
        }
      }]);

      return FakeCloseHandshake;
    }();

    return FakeCloseHandshake;
  });

  var fakeEventFactory = factory(function() {
    /**
     * No event is being processed at this time.
     * @type {number}
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase#Constants
     */
    var NONE = 0;
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

    var CAPTURING_PHASE = 1;
    /**
     * The event has arrived at the event's target. Event listeners registered for this phase are
     * called at this time.
     * If Event.bubbles is `false`, processing the event is finished after this phase is complete.
     *
     * @type {number}
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase#Constants
     */

    var AT_TARGET = 2;
    /**
     * The event is propagating back up through the target's ancestors in reverse order,
     * starting with the parent, and eventually reaching the containing Window.
     * This is known as bubbling, and occurs only if Event.bubbles is `true`.
     * Event listeners registered for this phase are triggered during this process.
     *
     * @type {number}
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase#Constants
     */

    var BUBBLING_PHASE = 3;
    /**
     * A fake implementation of `Event`.
     *
     * @class
     */

    var FakeEvent =
    /*#__PURE__*/
    function() {
      /**
       * Create the fake `Event` class.
       *
       * @param {string} type The event type.
       * @param {*} target The event target.
       * @constructor
       */
      function FakeEvent(type, target) {
        _classCallCheck(this, FakeEvent);

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
        this._srcElement = target; // Non readonly properties.

        this.returnValue = true;
        this.cancelBubble = false;
      }
      /**
       * The name of the event (case-insensitive).
       *
       * @return {string} The event type.
       */


      _createClass(FakeEvent, [{
        key: "initEvent",

        /**
         * Initializes the value of an Event created. If the event has already being
         * dispatched, this method does nothing.
         *
         * @return {void}
         */
        value: function initEvent() {}
        /**
         * Cancels the event (if it is cancelable).
         *
         * @return {void}
         */

      }, {
        key: "preventDefault",
        value: function preventDefault() {
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

      }, {
        key: "stopImmediatePropagation",
        value: function stopImmediatePropagation() {
          this.cancelBubble = true;
          this._stopped = true;
        }
        /**
         * Stops the propagation of events further along in the DOM.
         *
         * @return {void}
         */

      }, {
        key: "stopPropagation",
        value: function stopPropagation() {
          this.cancelBubble = true;
        }
      }, {
        key: "type",
        get: function get() {
          return this._type;
        }
        /**
         * Indicates which phase of the event flow is currently being evaluated.
         *
         * @return {number} An integer value which specifies the current evaluation phase.
         */

      }, {
        key: "eventPhase",
        get: function get() {
          return this._eventPhase;
        }
        /**
         * A Boolean indicating whether the event is cancelable.
         *
         * @return {boolean} The `cancelable` flag.
         */

      }, {
        key: "cancelable",
        get: function get() {
          return this._cancelable;
        }
        /**
         * Indicates whether or not event.preventDefault() has been called on the event.
         *
         * @return {boolean} `true` if `preventDefault` has been called, `false` otherwise.
         */

      }, {
        key: "defaultPrevented",
        get: function get() {
          return this._defaultPrevented;
        }
        /**
         * A Boolean indicating whether the event bubbles up through the DOM or not.
         *
         * @return {boolean} The `bubbles` flag.
         */

      }, {
        key: "bubbles",
        get: function get() {
          return this._bubbles;
        }
        /**
         * A Boolean value indicating whether or not the event can bubble across the
         * boundary between the shadow DOM and the regular DOM.
         *
         * @return {boolean} The `composed` flag.
         */

      }, {
        key: "composed",
        get: function get() {
          return this._composed;
        }
        /**
         * The time at which the event was created (in milliseconds)
         *  By specification, this value is time since epoch.
         *
         * @return {number} The timestamp of event creation.
         */

      }, {
        key: "timeStamp",
        get: function get() {
          return this._timeStamp;
        }
        /**
         * The isTrusted read-only property of the Event interface is a boolean that is true
         * when the event was generated by a user action, and false when the event was
         * created or modified by a script or dispatched via dispatchEvent.
         *
         * @return {boolean} The `isTrusted` flag.
         */

      }, {
        key: "isTrusted",
        get: function get() {
          return this._isTrusted;
        }
        /**
         * A reference to the currently registered target for the event.
         * This is the object to which the event is currently slated to be sent; it's possible
         * this has been changed along the way through retargeting.
         *
         * @return {Object} The event target.
         */

      }, {
        key: "currentTarget",
        get: function get() {
          return this._currentTarget;
        }
        /**
         * A reference to the target to which the event was originally dispatched.
         *
         * @return {Object} The event target.
         */

      }, {
        key: "target",
        get: function get() {
          return this._target;
        }
        /**
         * The non-standard alias (from old versions of Microsoft Internet Explorer) for Event.target,
         * which is starting to be supported in some other browsers for web compatibility purposes.
         *
         * @return {Object} The event target.
         */

      }, {
        key: "srcElement",
        get: function get() {
          return this._srcElement;
        }
      }]);

      return FakeEvent;
    }();

    FakeEvent.NONE = NONE;
    FakeEvent.BUBBLING_PHASE = BUBBLING_PHASE;
    FakeEvent.CAPTURING_PHASE = CAPTURING_PHASE;
    FakeEvent.AT_TARGET = AT_TARGET;
    return FakeEvent;
  });

  var fakeCloseEventFactory = factory(function() {
    var FakeEvent = fakeEventFactory();
    /**
     * A fake close event.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent
     */

    var FakeCloseEvent =
    /*#__PURE__*/
    function(_FakeEvent) {
      _inherits(FakeCloseEvent, _FakeEvent);

      /**
       * Create the fake event.
       *
       * @param {FakeWebSocket} ws The WebSocket.
       * @param {number} code The close code.
       * @param {string} reason The close reason.
       * @param {boolean} wasClean A `boolean` that Indicates whether or not the connection was cleanly closed.
       * @constructor
       */
      function FakeCloseEvent(ws, code, reason, wasClean) {
        var _this;

        _classCallCheck(this, FakeCloseEvent);

        _this = _possibleConstructorReturn(this, _getPrototypeOf(FakeCloseEvent).call(this, 'close', ws));
        _this._code = code;
        _this._reason = reason;
        _this._wasClean = wasClean;
        return _this;
      }
      /**
       * Initializes the value of a CloseEvent created.
       *
       * This method is deprecated and is here just to make the event compatible with a "real"
       * close event.
       *
       * @return {void}
       */


      _createClass(FakeCloseEvent, [{
        key: "initCloseEvent",
        value: function initCloseEvent() {}
        /**
         * The close code identifier.
         *
         * @return {number} The close code.
         */

      }, {
        key: "code",
        get: function get() {
          return this._code;
        }
        /**
         * The close reason.
         *
         * @return {string} The close r
         */

      }, {
        key: "reason",
        get: function get() {
          return this._reason;
        }
        /**
         * A `boolean` that Indicates whether or not the connection was cleanly closed.
         *
         * @return {boolean} The clean flag.
         */

      }, {
        key: "wasClean",
        get: function get() {
          return this._wasClean;
        }
      }]);

      return FakeCloseEvent;
    }(FakeEvent);

    return FakeCloseEvent;
  });

  /**
   * The connection has not yet been established.
   * @type {number}
   */
  var CONNECTING = 0;
  /**
   * The WebSocket connection is established and communication is possible.
   * @type {string}
   */

  var OPEN = 1;
  /**
   * The connection is going through the closing handshake, or the close() method has been invoked.
   * @type {number}
   */

  var CLOSING = 2;
  /**
   * The connection has been closed or could not be opened.
   * @type {number}
   */

  var CLOSED = 3;

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

  /**
   * Flatten all given array into a new single flat array.
   *
   * @param {Array<Array<*>>} arrays Array of given arrays.
   * @return {Array<*>} An array containing all arrays elements.
   */
  function flatten(arrays) {
    var _ref;

    return (_ref = []).concat.apply(_ref, _toConsumableArray(arrays));
  }

  /**
   * Check if a given value is an `ArrayBuffer` value.
   *
   * @param {*} value The value to check.
   * @return {boolean} `true` if `value` is a `ArrayBuffer`, `false`otherwise.
   */

  function isArrayBuffer(value) {
    return is(value, 'ArrayBuffer');
  }

  /**
   * Check if a given value is a `Blob` value.
   *
   * @param {*} value The value to check.
   * @return {boolean} `true` if `value` is a `Blob`, `false`otherwise.
   */

  function isBlob(value) {
    return is(value, 'Blob');
  }

  /**
   * Get array of all object values.
   *
   * @param {Object} object The given object.
   * @return {Array<Object>} The array of values.
   */

  function values(object) {
    return map(keys(object), function(k) {
      return object[k];
    });
  }

  var fakeMessageEventFactory = factory(function() {
    var FakeEvent = fakeEventFactory();
    /**
     * An integer that will be incremented each a new `FakeMessageEvent` is created, will
     * be used to get unique identifiers.
     * @type {number}
     */

    var _id = 0;
    /**
     * A fake Message Event.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/MessageEvent
     */

    var FakeMessageEvent =
    /*#__PURE__*/
    function(_FakeEvent) {
      _inherits(FakeMessageEvent, _FakeEvent);

      /**
       * Create the fake event.
       *
       * @param {FakeWebSocket} ws The WebSocket.
       * @param {*} data The sent data.
       * @constructor
       */
      function FakeMessageEvent(ws, data) {
        var _this;

        _classCallCheck(this, FakeMessageEvent);

        _this = _possibleConstructorReturn(this, _getPrototypeOf(FakeMessageEvent).call(this, 'message', ws));
        _this._data = data;
        _this._lastEventId = (_id++).toString();
        _this._origin = "".concat(ws._url.protocol, "//").concat(ws._url.host);
        return _this;
      }
      /**
       * Initializes a message event.
       *
       * This method is deprecated and is here just to make the event compatible with a "real"
       * message event.
       *
       * @return {void}
       */


      _createClass(FakeMessageEvent, [{
        key: "initMessageEvent",
        value: function initMessageEvent() {}
        /**
         * The data sent by the message emitter.
         *
         * @return {*} The sent data.
         * @see https://developer.mozilla.org/en-US/docs/Web/API/MessageEvent/data
         */

      }, {
        key: "data",
        get: function get() {
          return this._data;
        }
        /**
         * A `string` representing a unique ID for the event.
         *
         * @return {string} The unique event identifier.
         * @see https://developer.mozilla.org/en-US/docs/Web/API/MessageEvent/lastEventId
         */

      }, {
        key: "lastEventId",
        get: function get() {
          return this._lastEventId;
        }
        /**
         * An array of `MessagePort` objects representing the ports associated with the channel the message is being sent
         * through (where appropriate, e.g. in channel messaging or when sending a message to a shared worker).
         *
         * In this implementation, this method always returns an empty array.
         *
         * @return {Array<Object>} The message ports.
         * @see https://developer.mozilla.org/en-US/docs/Web/API/MessageEvent/ports
         */

      }, {
        key: "ports",
        get: function get() {
          return [];
        }
        /**
         * A USVString representing the origin of the message emitter.
         *
         * @return {string} The message emitter origin.
         * @see https://developer.mozilla.org/en-US/docs/Web/API/MessageEvent/origin
         */

      }, {
        key: "origin",
        get: function get() {
          return this._origin;
        }
        /**
         * A `MessageEventSource` (which can be a `WindowProxy`, `MessagePort`, or `ServiceWorker` object) representing
         * the message emitter.
         *
         * In this implementation, this method always returns `null`.
         *
         * @return {Object} The message emitter source.
         * @see https://developer.mozilla.org/en-US/docs/Web/API/MessageEvent/source
         */

      }, {
        key: "source",
        get: function get() {
          return null;
        }
      }]);

      return FakeMessageEvent;
    }(FakeEvent);

    return FakeMessageEvent;
  });

  var fakeWebSocketProxyFactory = factory(function() {
    var FakeMessageEvent = fakeMessageEventFactory();
    /**
     * The WebSocket Tracker.
     * @class
     */

    var FakeWebSocketProxy =
    /*#__PURE__*/
    function() {
      /**
       * Create the `WebSocket` tracker instance.
       * @param {FakeWebSocket} ws The tracked `WebSocket`.
       */
      function FakeWebSocketProxy(ws) {
        _classCallCheck(this, FakeWebSocketProxy);

        this._ws = ws;
      }
      /**
       * Returns the URL that was used to establish the `WebSocket` connection.
       *
       * @return {string} The URL.
       */


      _createClass(FakeWebSocketProxy, [{
        key: "addEventListener",

        /**
         * Sets up an event listener on the underlying `WebSocket`.
         *
         * @param {string} event The event identifier.
         * @param {function} listener The listener function.
         * @return {void}
         */
        value: function addEventListener(event, listener) {
          this._ws.addEventListener(event, listener);
        }
        /**
         * Removes event listener previously attached to the underlying `WebSocket`.
         *
         * @param {string} event The event name.
         * @param {function} listener The listener function.
         * @return {void}
         */

      }, {
        key: "removeEventListener",
        value: function removeEventListener(event, listener) {
          this._ws.removeEventListener(event, listener);
        }
        /**
         * Dispatches an Event on the underlying `WebSocket` instance.
         *
         * @param {Event} event The event to dispatch.
         * @return {void}
         */

      }, {
        key: "dispatchEvent",
        value: function dispatchEvent(event) {
          return this._ws.dispatchEvent(event);
        }
        /**
         * Get the tracked `WebSocket` `onopen` handler.
         *
         * @return {function} The `onopen` handler.
         */

      }, {
        key: "send",

        /**
         * Transmits data using the `WebSocket` connection.
         *
         * @param {*} data The string data to send.
         * @return {void}
         */
        value: function send(data) {
          this._ws.send(data);
        }
        /**
         * Closes the tracked `WebSocket` connection.
         *
         * @param {number} code A numeric value indicating the status code explaining why the connection is being closed.
         * @param {string} reason A human-readable string explaining why the connection is closing.
         * @return {void}
         */

      }, {
        key: "close",
        value: function close(code, reason) {
          this._ws.close(code, reason);
        }
        /**
         * The handshake request.
         *
         * @return {FakeOpenHandshake} The handshake request.
         */

      }, {
        key: "openHandshake",
        value: function openHandshake() {
          return this._ws._openHandshake;
        }
        /**
         * The handshake closing request.
         *
         * @return {FakeCloseHandshake} The close handshake.
         */

      }, {
        key: "closeHandshake",
        value: function closeHandshake() {
          return this._ws._closeHandshake;
        }
        /**
         * Get all sent messages.
         *
         * @return {Array<*>} All sent messages.
         */

      }, {
        key: "sentMessages",
        value: function sentMessages() {
          return this._ws._sentMessages.slice();
        }
        /**
         * Emit data and trigger appropriate listeners.
         *
         * @param {*} data Emitted data.
         * @return {void}
         * @see https://html.spec.whatwg.org/multipage/web-sockets.html#feedback-from-the-protocol
         */

      }, {
        key: "emitMessage",
        value: function emitMessage(data) {
          if (isNull(data) || isUndefined(data)) {
            throw new Error("Failed to receive message on 'WebSocket': The message is ".concat(String(data), "."));
          }

          if (!isString(data) && !isBlob(data) && !isArrayBuffer(data)) {
            throw new Error("Failed to receive message on 'WebSocket': Only String, Blob or ArrayBuffer are allowed. " + "The message is: ".concat(tagName(data), "."));
          }

          if (this.readyState !== OPEN) {
            throw new Error("Failed to receive message on 'WebSocket': The websocket state must be OPEN.");
          }

          this.dispatchEvent(new FakeMessageEvent(this._ws, data));
        }
        /**
         * Emit a closing request (i.e an abnormal closure requested by the server).
         *
         * @param {number} code The close status code, defaults to `1006`.
         * @param {string} reason The close reason, defaults to an empty string.
         * @param {boolean} wasClean A flag indicating if the connection is closed cleanly, defaults to `false`.
         * @return {void}
         * @see https://tools.ietf.org/html/rfc6455#page-44
         */

      }, {
        key: "emitClose",
        value: function emitClose() {
          var code = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1006;
          var reason = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
          var wasClean = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

          if (this.readyState === CLOSED) {
            throw new Error('Cannot emit a close event, WebSocket is already closed.');
          }

          if (this.readyState === CLOSING) {
            throw new Error('Cannot emit a close event, WebSocket is already closing.');
          }

          this._ws._failConnection(code, reason, wasClean);
        }
        /**
         * Get all registered listeners, or listeners for given specific event
         * type.
         *
         * @param {string} type Event type (optional).
         * @return {Array<function>} The registered listeners.
         */

      }, {
        key: "getEventListeners",
        value: function getEventListeners() {
          var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
          var wsListeners = this._ws._listeners;
          var listeners = type ? wsListeners[type] : flatten(values(wsListeners));
          return listeners ? listeners.slice() : [];
        }
      }, {
        key: "url",
        get: function get() {
          return this._ws.url;
        }
        /**
         * Get the ready state value of the underlying `WebSocket` instance.
         *
         * @return {number} The state value.
         */

      }, {
        key: "readyState",
        get: function get() {
          return this._ws.readyState;
        }
        /**
         * Returns the subprotocol of the underlying `WebSocket` instance.
         *
         * @return {string} The selected subprotocol.
         */

      }, {
        key: "protocol",
        get: function get() {
          return this._ws.protocol;
        }
        /**
         * Returns the `extensions` of the underlying `WebSocket` instance.
         *
         * @return {string} The selected extensions.
         */

      }, {
        key: "extensions",
        get: function get() {
          return this._ws.extensions;
        }
        /**
         * Returns the `bufferedAmount` value of the underlying `WebSocket` instance.
         *
         * @return {number} The number of bytes of data not yet transmitted to the network.
         */

      }, {
        key: "bufferedAmount",
        get: function get() {
          return this._ws.bufferedAmount;
        }
        /**
         * Returns the `binaryType` of the underlying `WebSocket` instance.
         *
         * @return {string} The binary type.
         */

      }, {
        key: "binaryType",
        get: function get() {
          return this._ws.binaryType;
        }, /**
         * Update the `binaryType` value of the underlying `WebSocket` instance.
         *
         * @param {string} binaryType New binary type value.
         * @return {void}
         */
        set: function set(binaryType) {
          this._ws.binaryType = binaryType;
        }
      }, {
        key: "onopen",
        get: function get() {
          return this._ws.onopen;
        }, /**
         * Set the tacked `WebSocket` `onopen` handler.
         *
         * @param {function} onopen The `onopen` handler.
         * @return {void}
         */
        set: function set(onopen) {
          this._ws.onopen = onopen;
        }
        /**
         * Get the tracked `WebSocket` `onmessage` handler.
         *
         * @return {function} The `onmessage` handler.
         */

      }, {
        key: "onmessage",
        get: function get() {
          return this._ws.onmessage;
        }, /**
         * Set the tacked `WebSocket` `onmessage` handler.
         *
         * @param {function} onmessage The `onmessage` handler.
         * @return {void}
         */
        set: function set(onmessage) {
          this._ws.onmessage = onmessage;
        }
        /**
         * Get the tracked `WebSocket` `onerror` handler.
         *
         * @return {function} The `onerror` handler.
         */

      }, {
        key: "onclose",
        get: function get() {
          return this._ws.onclose;
        }, /**
         * Set the tacked `WebSocket` `onclose` handler.
         *
         * @param {function} onclose The `onclose` handler.
         * @return {void}
         */
        set: function set(onclose) {
          this._ws.onclose = onclose;
        }
        /**
         * Get the tracked `WebSocket` `onerror` handler.
         *
         * @return {function} The `onerror` handler.
         */

      }, {
        key: "onerror",
        get: function get() {
          return this._ws.onerror;
        }, /**
         * Set the tacked `WebSocket` `onerror` handler.
         *
         * @param {function} onerror The `onerror` handler.
         * @return {void}
         */
        set: function set(onerror) {
          this._ws.onerror = onerror;
        }
      }]);

      return FakeWebSocketProxy;
    }();

    FakeWebSocketProxy.CONNECTING = CONNECTING;
    FakeWebSocketProxy.OPEN = OPEN;
    FakeWebSocketProxy.CLOSING = CLOSING;
    FakeWebSocketProxy.CLOSED = CLOSED;
    return FakeWebSocketProxy;
  });

  /**
   * The queue of opened WebSocket.
   * @type {Array<FakeWebSocketProxy>}
   */

  var queue = [];
  /**
   * Add `WebSocket` to the internal tracker.
   * @param {FakeWebSocket} ws The `WebSocket` to track.
   * @return {void}
   */

  function track(ws) {
    var FakeWebSocketProxy = fakeWebSocketProxyFactory();
    var proxy = new FakeWebSocketProxy(ws);
    queue.push(proxy);
  }
  /**
   * Reset all tracked `WebSocket`.
   *
   * @return {void}
   */

  function reset() {
    queue.splice(0, queue.length);
  }
  var wsTracker = {
    /**
     * Get the most recent tracked `WebSocket`.
     *
     * @return {void}
     */
    mostRecent: function mostRecent() {
      return queue[queue.length - 1];
    },

    /**
     * Get the first tracked `WebSocket`.
     *
     * @return {void}
     */
    first: function first() {
      return queue[0];
    },

    /**
     * Get the tracked `WebSocket` at given index.
     *
     * @param {number} idx The tracked index.
     * @return {void}
     */
    at: function at(idx) {
      return queue[idx];
    },

    /**
     * Get the number of previously opened `WebSocket` connections.
     *
     * @return {number} Number of tracked connections.
     */
    count: function count() {
      return queue.length;
    },

    /**
     * Get all previously opened `WebSocket` connections.
     *
     * @return {Array<FakeWebSocket>} The list of tracked connections.
     */
    all: function all() {
      return queue.slice();
    }
  };

  var fakeWebSocketFactory = factory(function() {
    var FakeOpenHandshake = fakeOpenHandshakeFactory();
    var FakeCloseHandshake = fakeCloseHandshakeFactory();
    var FakeEvent = fakeEventFactory();
    var FakeCloseEvent = fakeCloseEventFactory();
    /**
     * A Fake WebSocket implementation.
     * @class
     * @see https://html.spec.whatwg.org/multipage/web-sockets.html
     */

    var FakeWebSocket =
    /*#__PURE__*/
    function() {
      /**
       * Creates a fake `WebSocket` object, immediately establishing a fake `WebSocket` connection.
       *
       * The `url` is a `string` giving the URL over which the connection is established. Only `"ws"` or `"wss"`
       * schemes are allowed; others will cause a "SyntaxError" DOMException. URLs with fragments will also
       * cause such an exception.
       *
       * The `protocols` argument is either a string or an array of strings. If it is a string, it is equivalent to
       * an a consisting of just that string; if it is omitted, it is equivalent to the empty array.
       * Each string in the array is a subprotocol name.
       *
       * The connection will only be established if the server reports that it has selected one of these subprotocols.
       * The subprotocol names have to match the requirements for elements that comprise the
       * value of `Sec-WebSocket-Protocol` fields as defined by the `WebSocket` protocol specification.
       *
       * @param {string} url The connection URL
       * @param {string|Array<string>} protocols The subprotocol names
       */
      function FakeWebSocket(url) {
        var protocols = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

        _classCallCheck(this, FakeWebSocket);

        // 1- Let urlRecord be the result of applying the URL parser to url.
        var urlRecord = parseUrl(url); // 2- If urlRecord is failure, then throw a "SyntaxError" DOMException.

        if (urlRecord == null) {
          throw new SyntaxError("Failed to construct 'WebSocket': The URL '".concat(url, "' is invalid."));
        } // 3- If urlRecord's scheme is not "ws" or "wss", then throw a "SyntaxError" DOMException.


        var protocol = urlRecord.protocol;
        var scheme = protocol.slice(0, protocol.length - 1);

        if (scheme !== 'ws' && scheme !== 'wss') {
          throw new SyntaxError("Failed to construct 'WebSocket': The URL's scheme must be either 'ws' or 'wss'. " + "'".concat(scheme, "' is not allowed."));
        } // 4- If urlRecord's fragment is non-null, then throw a "SyntaxError" DOMException.


        var fragment = urlRecord.hash;

        if (fragment) {
          throw new SyntaxError("Failed to construct 'WebSocket': The URL contains a fragment identifier ('".concat(fragment, "'). ") + "Fragment identifiers are not allowed in WebSocket URLs.");
        } // 5- If protocols is a string, set protocols to a sequence consisting of just that string.


        if (isString(protocols)) {
          protocols = [protocols];
        } // 6- If any of the values in protocols occur more than once or otherwise fail to match the requirements fo
        // elements that comprise the value of `Sec-WebSocket-Protocol` fields as defined by the WebSocket protocol
        // specification, then throw a "SyntaxError" DOMException.


        var subProtocols = filter(protocols, function(protocol) {
          return isString(protocol);
        });
        var counters = countBy(subProtocols, function(subProtocol) {
          return subProtocol;
        });
        var pairs = toPairs(counters);
        var firstDuplicate = find(pairs, function(pair) {
          return pair[1] > 1;
        });

        if (firstDuplicate) {
          throw new SyntaxError("Failed to construct 'WebSocket': The subprotocol '".concat(firstDuplicate[0], "' is duplicated."));
        } // 7- Run this step in parallel:
        // 7-1 Establish a WebSocket connection given urlRecord, protocols, and the entry settings object.


        this.onerror = null;
        this.onopen = null;
        this.onmessage = null;
        this.onclose = null;
        this._binaryType = 'blob';
        this._url = urlRecord;
        this._protocols = protocols;
        this._listeners = {};
        this._sentMessages = [];
        this._openHandshake = null;
        this._closeHandshake = null;
        this._bufferedAmount = 0;

        this._establishConnection(); // 8- Return a new WebSocket object whose url is urlRecord.
        // Track this `WebSocket``


        track(this);
      }
      /**
       * Returns the URL that was used to establish the `WebSocket` connection.
       *
       * @return {string} The URL.
       */


      _createClass(FakeWebSocket, [{
        key: "addEventListener",

        /**
         * Sets up a function that will be called whenever the specified event is delivered to the target.
         *
         * @param {string} event The event identifier.
         * @param {function} listener The listener function.
         * @return {void}
         */
        value: function addEventListener(event, listener) {
          var nbArguments = arguments.length;

          if (nbArguments !== 2) {
            throw new TypeError("Failed to execute 'addEventListener' on 'EventTarget': 2 arguments required, " + "but only ".concat(nbArguments, " present."));
          }

          if (!has(this._listeners, event)) {
            this._listeners[event] = [];
          }

          var listeners = this._listeners[event];

          if (!includes(listeners, listener)) {
            listeners.push(listener);
          }
        }
        /**
         * Removes from the  event listener previously registered with `addEventListener()`.
         *
         * @param {string} event The event name.
         * @param {function} listener The listener function.
         * @return {void}
         */

      }, {
        key: "removeEventListener",
        value: function removeEventListener(event, listener) {
          var nbArguments = arguments.length;

          if (nbArguments !== 2) {
            throw new TypeError("Failed to execute 'removeEventListener' on 'EventTarget': 2 arguments required, " + "but only ".concat(nbArguments, " present."));
          }

          if (!has(this._listeners, event)) {
            return;
          }

          var listeners = this._listeners[event];
          var idx = indexOf(listeners, listener);

          if (idx >= 0) {
            listeners.splice(idx, 1);
          }
        }
        /**
         * Dispatches an Event at the specified EventTarget, (synchronously) invoking
         * the affected EventListeners in the appropriate order.
         *
         * @param {Event} event The event to dispatch.
         * @return {void}
         */

      }, {
        key: "dispatchEvent",
        value: function dispatchEvent(event) {
          var _this = this;

          var type = event.type;
          var listeners = has(this._listeners, type) ? this._listeners[type] : []; // Ensure the event phase is correct.

          event._eventPhase = FakeEvent.AT_TARGET;
          var methodName = "on".concat(type);
          var method = this[methodName];

          if (isFunction(method)) {
            method.call(this, event);
          }

          if (!event._stopped) {
            forEach(listeners, function(listener) {
              if (!event._stopped) {
                _this._executeListener(listener, event);
              }
            });
          } // Ensure the event phase is correct.


          event._eventPhase = FakeEvent.NONE;
          return !!event.cancelable && !!event.defaultPrevented;
        }
        /**
         * Transmits data using the `WebSocket` connection.
         *
         * @param {*} data The string data to send.
         * @return {void}
         */

      }, {
        key: "send",
        value: function send(data) {
          var nbArguments = arguments.length;

          if (nbArguments === 0) {
            throw new Error('Failed to execute \'send\' on \'WebSocket\': 1 argument required, but only 0 present.');
          }

          if (this._readyState === CONNECTING) {
            throw new Error('Failed to execute \'send\' on \'WebSocket\': Still in CONNECTING state.');
          }

          if (this._readyState === CLOSING || this._readyState === CLOSED) {
            throw new Error('WebSocket is already in CLOSING or CLOSED state.');
          }

          if (data !== '') {
            this._sentMessages.push(data);
          }
        }
        /**
         * Closes the `WebSocket` connection, optionally using code as the the WebSocket connection close code and
         * reason as the the WebSocket connection close reason.
         *
         * If the close code is not specified, a default value of 1005 is assumed.
         * The close `reason` is a `string` that must be no longer than 123 bytes of UTF-8 text (not characters).
         *
         * @param {number} code A numeric value indicating the status code explaining why the connection is being closed.
         * @param {string} reason A human-readable string explaining why the connection is closing.
         * @return {void}
         * @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/close
         * @see https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent#Status_codes
         * @see https://html.spec.whatwg.org/multipage/web-sockets.html#dom-websocket-close
         */

      }, {
        key: "close",
        value: function close(code, reason) {
          // 1- If code is present, but is neither an integer equal to 1000 nor an integer in the range 3000 to 4999,
          // inclusive, throw an "InvalidAccessError" DOMException.
          if (!isUndefined(code)) {
            code = Number(code) || 0;

            if (code != 1000 && (code < 3000 || code > 4999)) {
              throw new Error("Failed to execute 'close' on 'WebSocket': The code must be either 1000, or between 3000 and 4999. " + "".concat(code, " is neither."));
            }
          } // 2- If reason is present, then run these substeps:
          //  2-1 Let reasonBytes be the result of encoding reason.
          //  2-2 If reasonBytes is longer than 123 bytes, then throw a "SyntaxError" DOMException.


          code = isUndefined(code) ? 1005 : code;
          reason = isUndefined(reason) ? '' : String(reason);

          if (reason.length > 123) {
            throw new Error("Failed to execute 'close' on 'WebSocket': The message must not be greater than 123 bytes.");
          } // 3- Run the first matching steps from the following list:
          // 3-1 If the readyState attribute is in the CLOSING (2) or CLOSED (3) state
          // Do nothing.


          if (this._readyState === CLOSING || this._readyState === CLOSED) {
            return;
          } // 3-2 If the WebSocket connection is not yet established
          // Fail the WebSocket connection and set the readyState attribute's value to CLOSING.


          if (this._readyState === CONNECTING) {
            this._failConnection();
          } // 3-3 If the WebSocket closing handshake has not yet been started [WSP]


          if (!this._closeHandshake) {
            this._closeHandshake = new FakeCloseHandshake(this, code, reason, true);
          }

          this._readyState = CLOSING;
        } // The Fake WebSocket API

        /**
         * Establish connection by triggering a fake handshake.
         *
         * @return {void}
         */

      }, {
        key: "_establishConnection",
        value: function _establishConnection() {
          this._readyState = CONNECTING;
          this._protocol = '';
          this._extensions = '';
          this._openHandshake = new FakeOpenHandshake(this);
        }
        /**
         * Mark the WebSocket connection as opened and trigger appropriate listeners.
         *
         * @param {Object} response The HTTP handshake response.
         * @return {void}
         */

      }, {
        key: "_openConnection",
        value: function _openConnection(response) {
          this._readyState = OPEN;
          var headers = response.headers;

          if (headers) {
            this._protocol = has(headers, 'Sec-WebSocket-Protocol') ? headers['Sec-WebSocket-Protocol'] : null;
            this._extensions = has(headers, 'Sec-WebSocket-Extensions') ? headers['Sec-WebSocket-Extensions'] : null;
          }

          this.dispatchEvent(new FakeEvent('open', this));
        }
        /**
         * Execute the listener function (it it is a real `function`).
         * Note that error are catched and logged to the console.
         *
         * @param {function} listener The listener function.
         * @param {Object} event The event to dispatch.
         * @return {void}
         */

      }, {
        key: "_executeListener",
        value: function _executeListener(listener, event) {
          try {
            if (isFunction(listener)) {
              listener.call(this, event);
            } else if (isFunction(listener.handleEvent)) {
              listener.handleEvent(event);
            }
          } catch (e) {
            console.error(e);
            console.error(e.stack);
          }
        }
        /**
         * Mark the websocket as closed and trigger appropriate listeners.
         *
         * @param {number} code A numeric value indicating the status code explaining why the connection is being closed.
         * @param {string} reason A human-readable string explaining why the connection is closing.
         * @param {boolean} wasClean A `boolean` that Indicates whether or not the connection was cleanly closed.
         * @return {void}
         */

      }, {
        key: "_doClose",
        value: function _doClose(code, reason, wasClean) {
          this._readyState = CLOSED;
          this.dispatchEvent(new FakeCloseEvent(this, code, reason, wasClean));
        }
        /**
         * Fail the `WebSocket` connection as described in the `WebSocket` protocol.
         *
         * @param {number} code The close status code, defaults to `1006`.
         * @param {string} reason The close reason message, defaults to an empty string.
         * @param {boolean} wasClean A flag indicating if the connection is closed cleanly, defaults to `false`.
         * @return {void}
         */

      }, {
        key: "_failConnection",
        value: function _failConnection() {
          var code = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1006;
          var reason = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
          this._readyState = CLOSING;
          this._closeHandshake = new FakeCloseHandshake(this, code, reason, false);
          this.dispatchEvent(new FakeEvent('error', this));
        }
      }, {
        key: "url",
        get: function get() {
          return this._url.toString();
        }
        /**
         * Get the ready state value, i.e the state of the WebSocket object's connection.
         *
         * @return {number} The state value.
         */

      }, {
        key: "readyState",
        get: function get() {
          return this._readyState;
        }
        /**
         * Returns the subprotocol selected by the server, if any.
         * It can be used in conjunction with the array form of the constructor's second argument to perform
         * subprotocol negotiation.
         *
         * @return {string} The selected subprotocol.
         */

      }, {
        key: "protocol",
        get: function get() {
          return this._protocol;
        }
        /**
         * Returns the extensions selected by the server, if any.
         *
         * @return {string} The selected extensions.
         */

      }, {
        key: "extensions",
        get: function get() {
          return this._extensions;
        }
        /**
         * Returns the number of bytes of application data (UTF-8 text and binary data) that have been queued using `send()`
         * but not yet been transmitted to the network.
         *
         * If the WebSocket connection is closed, this attribute's value will only increase with each call to
         * the `send()` method. (The number does not reset to zero once the connection closes.)
         *
         * @return {number} The number of bytes of data not yet transmitted to the network.
         */

      }, {
        key: "bufferedAmount",
        get: function get() {
          return this._bufferedAmount;
        }
        /**
         * Returns a string that indicates how binary data from the WebSocket object is exposed to scripts:
         * - `"blob"`: Binary data is returned in Blob form.
         * - `"arraybuffer"`: Binary data is returned in ArrayBuffer form.
         *
         * @return {string} The binary type.
         */

      }, {
        key: "binaryType",
        get: function get() {
          return this._binaryType;
        }, /**
         * Update the binary type value.
         *
         * @param {string} binaryType New binary type value.
         * @return {void}
         */
        set: function set(binaryType) {
          this._binaryType = binaryType;
        }
      }]);

      return FakeWebSocket;
    }();

    FakeWebSocket.CONNECTING = CONNECTING;
    FakeWebSocket.OPEN = OPEN;
    FakeWebSocket.CLOSING = CLOSING;
    FakeWebSocket.CLOSED = CLOSED;
    return FakeWebSocket;
  });

  var GLOBAL = window || global;
  var WEB_SOCKET_IMPL_NAME = find(['WebSocket', 'MozWebSocket'], function(impl) {
    return impl in GLOBAL;
  });
  var WEB_SOCKET = WEB_SOCKET_IMPL_NAME ? GLOBAL[WEB_SOCKET_IMPL_NAME] : null;
  /**
   * Update the global `WebSocket` API in the current running environment.
   *
   * @param {function} impl The `WebSocket` API implementation.
   * @return {void}
   */

  function setWebSocketImpl(impl) {
    GLOBAL[WEB_SOCKET_IMPL_NAME] = impl;
  }
  /**
   * Check if the current installed `WebSocket` in the running environment is strictly
   * equal to the one in parameter.
   *
   * @param {function} impl The `WebSocket` API implementation to check.
   * @return {boolean} `true` if the global `WebSocket` is equal to `impl`, `false` otherwise.
   */


  function checkWebSocketImpl(impl) {
    return GLOBAL[WEB_SOCKET_IMPL_NAME] === impl;
  }

  var FakeWebSocket;

  jasmine.ws = function() {
    return {
      /**
       * Install the fake WebSocket implementation, if and only if native WebSocket is supported
       * on runtime environment.
       *
       * @return {void}
       */
      install: function install() {
        if (WEB_SOCKET) {
          // Create the `FakeWebSocket` once.
          if (!FakeWebSocket) {
            FakeWebSocket = fakeWebSocketFactory();
          }

          if (checkWebSocketImpl(FakeWebSocket)) {
            throw new Error('It seems that jasmine-ws has already been installed, make sure `jasmine.ws().uninstall()` ' + 'has been called after test suite.');
          } // Override the default `WebSocket` API.


          setWebSocketImpl(FakeWebSocket); // Ensure the tracker is resetted.

          reset();
        }
      },

      /**
       * Uninstall the fake WebSocket implementation if it was previously installed.
       *
       * @return {void}
       */
      uninstall: function uninstall() {
        if (WEB_SOCKET) {
          if (!checkWebSocketImpl(FakeWebSocket)) {
            throw new Error('It seems that `jasmine.ws` has not been installed, make sure `jasmine.ws().install()` ' + 'has been called before uninstalling it.');
          } // Restore the default `WebSocket` API.


          setWebSocketImpl(WEB_SOCKET); // Ensure the tracker is resetted.

          reset();
        }
      },

      /**
       * Allow to use fake `WebSocket` API in a single test function (without dealing
       * with `jasmine.ws().install` and `jasmine.ws().uninstall()`).
       *
       * @param {function} testFn The test function.
       * @return {*} The return value of the test function.
       */
      withMock: function withMock(testFn) {
        this.install();

        try {
          return testFn();
        } finally {
          this.uninstall();
        }
      },

      /**
       * Get the store of opened `WebSocket` connections.
       *
       * @return {Object} The store.
       */
      connections: function connections() {
        return wsTracker;
      }
    };
  };

}());
