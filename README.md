
## Jasmine-WS

[![Greenkeeper badge](https://badges.greenkeeper.io/mjeanroy/jasmine-ws.svg)](https://greenkeeper.io/)

A simple addon for [](Jasmine) to test a WebSocket application easily!

### Installation

- Install the latest version: `npm run install --save-dev jasmine-ws`.
- Add the `main` (i.e `dist/jasmine-ws.js`) file to your test suite.

### Example

Suppose this (very) simple WebSocket chat application:

```javascript
let ws;
let messages = [];

function onNewMessage(e) {
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
    expect(ws.sentMessages()).toEqual(['Hi dude']);

    // Trigger close event and trigger close handshake response.
    disconnect();
    ws.closeHandshake().respond();
    expect(ws.getEventListeners()).toEqual([]);
  });
});
```

### API

#### `jasmine.ws`

`jasmine.ws().install()`

Install the fake `WebSocket` implementation, typically called in a `beforeEach` method.
Note that:
  - The fake implementation if, and only if, a native `WebSocket` implementaton is available (i.e if browser supports `WebSocket`), otherwise
this method do nothing (and do not fail).
  - This method will fail if `jasmine-ws` has already been installed.

`jasmine.ws().uninstall()`

Install the fake `WebSocket` implementation, typically called in a `beforeEach` method.
Note that:
  - Like the `jasmine.ws().install()` method, if browser does not support native `WebSocket` this method do nothing (and do not fail).
  - This method will fail if `jasmine-ws` has not been previously installed.

`jasmine.ws().connections()`

Returns an object containing method to get tracked connection:
  - `count(): number` Get the number of tracked connections.
  - `all(): Array<FakeWebSocket>` Get an array of all tracked connections.
  - `first(): FakeWebSocket` Get the first tracked connections or `undefined`.
  - `last(): FakeWebSocket` Get the last tracked connections or `undefined`.
  - `at(idx: number): FakeWebSocket` Get the tracked connection at given index or `undefined`.

#### `FakeWebSocket`

A tracked connection is a `WebSocket` (so contains all methods of `WebSocket` object as documented [here]()) with additional methods:

- `openHandshake(): FakeOpenHandshake` Get the "open" handshake request, that can be used to trigger handshake response.
- `closeHandshake(): FakeCloseHandshake` Get the "close" handshake request, that can be used to trigger handshake response.
- `emitMessage(message: string): void` Emit a message from the server.
- `emitClose(): void` Emit a close event triggered from server.
- `sentMessages(): Array<string>` Get all sent messages (i.e parameters passed to the `WebSocket#send` method).
- `getEventListeners(eventType?: string): Array<function>` Get registered listeners (passing string parameter will return registered event listeners for given event type).

#### `FakeOpenHandshake`

A fake handshake request that can simulate the open handshake with given properties and methods:

- `url: string` The request URL.
- `headers: object` The request headers, can be used to check for requested `WebSocket` subprotocols.
- `getRequest(): object` Get the original sent request.
- `respond(): void` Trigger the handshake response with a success status code (i.e 101) (will trigger the listeners for the `WebSocket` `open` event).
- `fail(status = 500): void` Trigger handshake with a non-success status code (will trigger the listeners for the `WebSocket` `error` event).
- `respondWith(response: object): void` Trigger custom handshake response (will trigger appropriate listeners).

#### `FakeCloseHandshake`

A fake handshake request that can simulate the close handshake with given properties and methods:

- `code: number` The close code identifier.
- `reason: string` The close reason.
- `wasClean: boolean` Indicates whether or not the connection was cleanly closed.
- `respond(): void` Trigger the handshake response (will trigger the listeners for the `WebSocket` `close` event).

### Licence

MIT License (MIT)

### Contributing

If you find a bug or you think something is missing, feel free to contribute and submit an issue or a pull request.
