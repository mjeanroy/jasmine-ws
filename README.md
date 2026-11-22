## Jasmine-WS

A simple addon for [Jasmine](https://jasmine.github.io/) to test a WebSocket application easily!

### Installation

- Install the latest version: `npm install --save-dev jasmine-ws`.
- Add the `main` file (i.e `node_modules/jasmine-ws/dist/jasmine-ws.js`) to your test suite, after Jasmine itself.

### Example

Suppose this (very) simple WebSocket chat application:

```javascript
let ws;
let messages = [];

function displayMessage(e) {
  messages.push(e.data);
}

function connect() {
  if (ws) {
    return;
  }

  ws = new WebSocket(wssUrl);
  ws.addEventListener('message', displayMessage);
}

function sendMessage(message) {
  if (ws) {
    ws.send(message);
  }
}

function disconnect() {
  if (ws) {
    ws.close();
    ws.removeEventListener('message', displayMessage);
    ws = null;
  }
}
```

Testing this application can be easy with `jasmine-ws`:

```javascript
describe('app', () => {
  beforeEach(() => {
    jasmine.ws().install();
  });

  afterEach(() => {
    jasmine.ws().uninstall();
  });

  it('should connect ws', () => {
    connect();

    const connections = jasmine.ws().connections();
    expect(connections.count()).toBe(1);
    
    const conn = connections.mostRecent();
    expect(conn.url).toBe('...');
    expect(conn.readyState).toBe(0);

    // Trigger the open handshake response and emit message from server.
    conn.openHandshake().respond();
    conn.emitMessage('Hello World');
    expect(messages).toEqual(['Hello World']);

    // Send message
    sendMessage('Hi dude');
    expect(conn.sentMessages()).toEqual(['Hi dude']);

    // Trigger close event and trigger close handshake response.
    disconnect();
    conn.closeHandshake().respond();
    expect(conn.getEventListeners()).toEqual([]);
  });
});
```

### API

#### `jasmine.ws`

`jasmine.ws().install()` (@since 0.1.0)

Install the fake `WebSocket` implementation, typically called in a `beforeEach` method.
Note that:
  - The fake implementation is installed if, and only if, a native `WebSocket` implementation is available (i.e if browser supports `WebSocket`), otherwise
this method does nothing (and does not fail).
  - This method will fail if `jasmine-ws` has already been installed.

`jasmine.ws().uninstall()` (@since 0.1.0)

Uninstall the fake `WebSocket` implementation (i.e restore the native one), typically called in an `afterEach` method.
Note that:
  - Like the `jasmine.ws().install()` method, if browser does not support native `WebSocket` this method does nothing (and does not fail).
  - This method will fail if `jasmine-ws` has not been previously installed.

`jasmine.ws().connections()` (@since 0.1.0)

Returns an object containing methods to get tracked connections:
  - `count(): number` Get the number of tracked connections.
  - `all(): Array<FakeWebSocket>` Get an array of all tracked connections.
  - `first(): FakeWebSocket` Get the first tracked connection or `undefined`.
  - `mostRecent(): FakeWebSocket` Get the most recent tracked connection or `undefined`.
  - `at(idx: number): FakeWebSocket` Get the tracked connection at given index or `undefined`.

`jasmine.ws().withMock(testFn)` (@since 0.2.0)

Install the fake `WebSocket` implementation, execute the test function `testFn`, then uninstall the fake implementation (even if `testFn` throws).
It returns the value returned by `testFn`. This method can be used to install/uninstall fake `WebSocket` API in a single test, for example:

```javascript
it('should run test with fake WebSocket', () => {
  jasmine.ws().withMock(() => {
    doYourTest();
    doYourExpect();
  });
});
```

#### `FakeWebSocket`

A tracked connection is like a `WebSocket` (so contains all methods of `WebSocket` object as documented [here](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)) with additional methods:

- `openHandshake(): FakeOpenHandshake` Get the "open" handshake request, that can be used to trigger handshake response.
- `closeHandshake(): FakeCloseHandshake` Get the "close" handshake request, that can be used to trigger handshake response.
- `emitMessage(message: string|Blob|ArrayBuffer): void` Emit a message from the server (the connection must be open).
- `emitClose(code = 1006, reason = '', wasClean = false): void` Emit a close event triggered from server (fails if the connection is already closing or closed).
- `sentMessages(): Array<string>` Get all sent messages (i.e parameters passed to the `WebSocket#send` method).
- `getEventListeners(eventType?: string): Array<function>` Get registered listeners (passing string parameter will return registered event listeners for given event type).

#### `FakeOpenHandshake`

A fake handshake request that can simulate the open handshake with given properties and methods:

- `url: string` The request URL.
- `method: string` The request method (always `'GET'`).
- `headers: object` The request headers, can be used to check for requested `WebSocket` subprotocols.
- `getRequest(): object` Get the original sent request.
- `getResponse(): object` Get the triggered handshake response, or `null` if it has not been triggered yet.
- `respond(): void` Trigger the handshake response with a success status code (i.e 101) (will trigger the listeners for the `WebSocket` `open` event).
- `fail(status = 500): void` Trigger handshake with a non-success status code (will trigger the listeners for the `WebSocket` `error` event). Status `101` is not allowed, use `respond()` instead.
- `respondWith(response: object): void` Trigger custom handshake response, e.g `respondWith({ status: 401 })` (will trigger appropriate listeners; status defaults to `101`).

Note that a handshake response can only be triggered once.

#### `FakeCloseHandshake`

A fake handshake request that can simulate the close handshake with given properties and methods:

- `code: number` The close code identifier.
- `reason: string` The close reason.
- `wasClean: boolean` Indicates whether or not the connection was cleanly closed.
- `respond(): void` Trigger the handshake response (will trigger the listeners for the `WebSocket` `close` event).

### License

MIT License (MIT)

### Contributing

If you find a bug or you think something is missing, feel free to contribute and submit an issue or a pull request.
