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

/* eslint-disable prefer-arrow-callback */
/* eslint-disable prefer-template */
/* eslint-disable wrap-iife */
/* eslint-disable func-names */
/* eslint-disable no-var */
/* eslint-disable no-invalid-this */
/* eslint-disable require-jsdoc */
/* eslint-disable no-console */

(function () {
  var $output = document.getElementById('output');
  var $connect = document.getElementById('connect-btn');
  var $disconnect = document.getElementById('disconnect-btn');
  var $send = document.getElementById('send-btn');
  var $input = document.getElementById('input-message');
  var $form = document.getElementById('message-form');

  var wsUri = 'ws://localhost:3000/echo';
  var ws = null;

  function createWebSocket() {
    if (!ws) {
      ws = new WebSocket(wsUri);

      ws.onopen = onopen;
      ws.onerror = onerror;
      ws.onmessage = onmessage;
      ws.onclose = onclose;

      ws.addEventListener('open', onOpenListener);
      ws.addEventListener('close', onCloseListener);
      ws.addEventListener('message', onMessageListener);
      ws.addEventListener('error', onErrorListener);
    }
  }

  function closeWebSocket() {
    if (ws) {
      ws.close();
    }
  }

  $disconnect.addEventListener('click', function () {
    closeWebSocket();
  });

  $connect.addEventListener('click', function () {
    createWebSocket();
  });

  $form.addEventListener('submit', function (e) {
    e.preventDefault();

    ws.send($input.value);

    $input.value = '';
  });

  function appendToOutput(message) {
    $output.innerHTML += message + '<br />';
  }

  function onOpenListener(e) {
    console.log('Event listener `open` called:', this, e);
    appendToOutput('WebSocket connected, `open` listener executed');
  }

  function onCloseListener(e) {
    console.log('Event listener `close` called:', this, e);
    appendToOutput('WebSocket closed, `close` listener executed');

    setTimeout(function () {
      ws.removeEventListener('open', onOpenListener);
      ws.removeEventListener('close', onCloseListener);
      ws.removeEventListener('message', onMessageListener);
      ws.removeEventListener('error', onErrorListener);
      ws = null;
    });
  }

  function onMessageListener(e) {
    console.log('Event listener `message` called:', this, e);
    appendToOutput('WebSocket message, `message` listener executed');
  }

  function onErrorListener(e) {
    console.log('Event listener `error` called: ', this, e);
    appendToOutput('WebSocket error, `error` listener executed');
  }

  function onopen(e) {
    $disconnect.disabled = false;
    $send.disabled = false;
    $connect.disabled = true;

    console.log('Method `onopen` called:', this, e);
    appendToOutput('WebSocket connected, `onpen` callback executed');
  }

  function onclose(e) {
    $disconnect.disabled = true;
    $send.disabled = false;
    $connect.disabled = false;

    console.log('Method `onclose` called:', this, e);
    appendToOutput('WebSocket closed, `onclose` callback executed');
  }

  function onmessage(e) {
    console.log('Method `onmessage` called:', this, e);
    appendToOutput('WebSocket message, `onmessage` callback executed');
  }

  function onerror(e) {
    console.log('Method `onerror` called:', e);
    appendToOutput('WebSocket error, `onerror` callback executed');
  }
})();
