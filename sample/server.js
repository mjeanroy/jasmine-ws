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

/* eslint-env node */
/* eslint-disable no-console */

const express = require('express');

const app = express();

require('express-ws')(app);

app.use('/', express.static(__dirname));

app.ws('/echo', (ws) => {
  ws.on('error', (msg) => {
    console.log('[ERROR] Error on WebSocket connection: ', msg);
  });

  ws.on('close', (code, reason) => {
    console.log('[ERROR] Closing WebSocket connection: ', code, reason);
  });

  ws.on('message', (msg) => {
    console.log('[DEBUG] Receiving message: ', msg);

    setTimeout(() => {
      console.log('[DEBUG] Sending message: ', msg);
      ws.send(msg);
    });
  });
});

app.listen(3000, () => {
  console.log('[INFO] App listening on port 3000...');
});
