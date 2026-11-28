# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

`jasmine-ws` is a Jasmine add-on that replaces the browser's global `WebSocket` with a spec-following fake, so apps using WebSockets can be tested without a server. It is a browser-only library (ESLint env has `node: false` for `src/`), bundled with Rollup into a single IIFE (`dist/jasmine-ws.js`, global name `JasmineWS`). The public API and usage are documented in `README.md`.

## Commands

Package manager is pnpm (see CI: Node 26, pnpm 12.23.0). `pnpm-workspace.yaml` disables the lockfile and enforces `saveExact` and `minimumReleaseAge`, so dependencies in `package.json` are pinned to exact versions.

All tasks go through gulp (`gulpfile.js` → `scripts/<task>/index.js`):

- `pnpm test` — lint, then run Karma once in headless Chrome. If `SAUCE_USERNAME`/`SAUCE_ACCESS_KEY` are set it runs on SauceLabs instead (`karma.saucelab.conf.js`).
- `pnpm run tdd` — Karma in watch mode with a real (non-headless) Chrome.

Both need a local Chrome install, because karma-chrome-launcher drives it.
- `pnpm run lint` — ESLint (airbnb-base + `.eslintrc`) on root, `src`, `test`, `sample`, `scripts`. Any warning fails the task. Add `--file <path>` (repeatable; file, directory or glob) to lint only those paths, e.g. `pnpm run lint --file src/jasmine-ws.js --file test/core`. A path that matches nothing is an error. `build`, `test` and `release:*` always lint the whole project and ignore `--file`.
- `pnpm run build` — clean + lint + Rollup bundle to `dist/`.
- `pnpm start` — runs the demo chat app in `sample/` (Express + express-ws echo server on port 3000). It's a manual example of an app to test, and doesn't load jasmine-ws.
- `pnpm run release:{patch,minor,major}` — lint, test, build, then force-adds `dist/`, runs `npm version`, and removes `dist/` again in a follow-up commit. `dist/` is only committed on release tags.

### Running a subset of tests

`test` and `tdd` accept these flags. They're parsed by `scripts/cli/index.js` (shared with `lint`), as `--flag value` or `--flag=value`:

- `--file <path>`: can be repeated, and takes a file or a glob, relative to the repo root. These files replace `test/index.js` as Karma's entry points.
- `--filter <text>`: runs only specs whose full name (`describe` names + `it` name) contains the text. karma-jasmine 1.x escapes regex characters, so this is a plain substring match, not a regex.

```sh
pnpm test --file test/core/ws-tracker.test.js
pnpm test --file "test/core/common/*.test.js" --filter isString
pnpm test --filter "should reset tracked connection"
pnpm run tdd --file test/core/fake-web-socket.test.js
```

`pnpm test` still lints the whole project first, even with `--file`.

With `--file`, each file becomes its own Rollup bundle. Two consequences:
- `test/after-each.js` (the global tracker reset) is not loaded.
- Files bundled separately don't share module state.

A spec file that relies on the tracker being empty must reset it in its own `beforeEach`, as `test/core/ws-tracker.test.js` does.

## Architecture

- `src/jasmine-ws.js` — entry point. Defines `jasmine.ws()` returning `install` / `uninstall` / `withMock` / `connections`. `install` swaps `window.WebSocket` (or `MozWebSocket`) for `FakeWebSocket`; if the environment has no native WebSocket, install/uninstall are silent no-ops. Both install and uninstall reset the tracker.
- `src/core/fake-web-socket.js` — the `FakeWebSocket` class. The constructor and `close()` follow the WHATWG WebSocket spec step by step (comments are numbered after the spec steps), including the exact error messages Chrome produces. Each instance registers itself with the tracker.
- `src/core/ws-tracker.js` — module-level queue of tracked connections. It stores a `FakeWebSocketProxy` for each socket, not the socket itself. `wsTracker` is what `jasmine.ws().connections()` returns.
- `src/core/fake-web-socket-proxy.js` — the test-facing handle. It forwards the read-only WebSocket properties and adds test controls: `openHandshake()`, `closeHandshake()`, `emitMessage()`, `emitClose()`, `sentMessages()`, `getEventListeners()`. Test-only behavior belongs here, not on `FakeWebSocket`.
- `fake-open-handshake.js` / `fake-close-handshake.js` — simulate the server side of the handshakes (`respond()`, `fail()`, `respondWith()`), which drive `readyState` changes and event dispatch on the underlying socket.
- `fake-event.js`, `fake-message-event.js`, `fake-close-event.js` — minimal Event implementations dispatched by `FakeWebSocket#dispatchEvent`, which calls the `on<type>` handler first and then the registered listeners.
- `src/core/common/` — small lodash-style helpers (`find`, `filter`, `has`, `parseUrl`, …). The library has no runtime dependencies, so use or add helpers here instead of importing packages. These helpers don't always behave like their native counterparts. For example, `assign(target, ...sources)` only sets keys that are **not already present**, so the first value wins (the opposite of `Object.assign`). `respondWith()` in `fake-open-handshake.js` relies on this to let the caller's `status` override the default.

**The `factory()` pattern** (`src/core/common/factory.js`): every class is wrapped as `export const xxxFactory = factory(() => { class Xxx {…} return Xxx; })`, which builds it lazily, once. Callers get the class by calling `xxxFactory()`. Classes are not exported directly. This defers class creation (and any reference to browser globals) until it is first needed.

## Tests

- Tests in `test/` mirror `src/` (`test/core/foo.test.js` ↔ `src/core/foo.js`). By default Karma runs `test/index.js` through Rollup + Babel, so **every new test file must be imported from the matching `index.js` barrel** (`test/index.js`, `test/core/index.js`, `test/core/common/index.js`). Otherwise the full suite never runs it, even though `--file` does.
- `test/after-each.js` resets the tracker after every spec, but only in a full run (not with `--file`).
- `test/support/assume-*.js` use `skip()` (Jasmine `pending`) to skip specs when the browser lacks WebSocket/Blob/ArrayBuffer support, because CI runs on a SauceLabs browser matrix.

## Conventions

- Every source/script file starts with the MIT license header block. The Rollup build strips it and prepends `LICENSE`.
- JSDoc is required and checked by ESLint's `valid-jsdoc`: `@param` and `@return` need descriptions, and `@return {void}` is required even when nothing is returned.
- Max line length is 120.
- `README.md` is the API reference (each method is tagged `@since x.y.z`). Update it when changing the public API of `jasmine.ws()`, the proxy or the handshakes.
