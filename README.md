<div align="center" style="text-align: center;">
  <h1 style="border-bottom: none;">lit-ntml</h1>

  <p>Inspired by <a href="https://github.com/PolymerLabs/lit-html" target="_blank" rel="noopener">lit-html</a> but for Node.js.</p>
</div>

<hr />


[![Build Status][travis-badge]][travis-url]
[![Version][version-badge]][version-url]
[![Downloads][downloads-badge]][downloads-url]
[![MIT License][mit-license-badge]][mit-license-url]
[![Dependency Status][daviddm-badge]][daviddm-url]
[![NSP Status][nsp-badge]][nsp-url]
[![Greenkeeper badge][greenkeeper-badge]][greenkeeper-url]

[![Code of Conduct][coc-badge]][coc-url]


> Lightweight and modern templating for SSR in [Node.js][node-js-url], inspired by [lit-html][lit-html-url].

## Features

- [x] `await` all tasks including Promises
- [x] `cacheStore: new QuickLru()` to use a custom [ES6 Map][es6-map-url] compliant cache instance
- [x] `cacheExpiry: 10e3` to set TTL of a cached item. Defaults to 1 year of TTL.
- [x] `minify: true` to minify rendered HTML
- [x] Compatible for ES Modules (`import ntml from 'ntml'`) and CommonJS (`const { ntml } = require('ntml');`)

## Pre-requisite

- [Node.js][node-js-url] >= 8.9.0
- [NPM][npm-url] >= 5.5.1 ([NPM][npm-url] comes [Node.js][node-js-url] so there is no need to install separately.)

## How to use

### Await all tasks (Promises, Functions, strings, etc)

```ts
/** Import project dependencies */
import ntml from 'lit-ntml';

/** Setting up */
const html = ntml();
const header = text => () => new Promise(yay => setTimeout(() => yay(`<div class="header">${text}</div>`), 3e3));
const content = text => async () => `<div class="content">${text}</div>`;
const someLoremIpsum = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';

const rendered = await html`
  <html lang="en">
    <body>
      <style>
        body {
          padding: 0;
          margin: 0;
          font-size: 16px;
          font-family: 'sans-serif';
          box-sizing: border-box;
        }

        .header {
          background: #0070fb;
          color: #fff;
        }

        .content {
          background: #f5f5f5;
          color: #000;
        }
      </style>

      <main>
        <div>Hello, world! ${header('Hello, world!')} ${content('lorem ipsum')}</div>
        <div>${someLoremIpsum}</div>
      </main>
    </body>
  </html>
`;

console.log('#', rendered); /** <html lang="en>...</html> */
```

### Use custom cache store + unique cache name to cache rendered HTML

```ts
/** Import project dependencies */
import ntml from 'lit-ntml';
import QuickLru from 'quick-lru';

/** Setting up */
const cacheStore = new QuickLru({ maxSize: 1000 }); // A cache instance must be ES6 Map compliant.
// const simpleCache = new Map(); // Simple cache using ES6 Map.
const html = ntml({
  cacheStore, // cacheStore: simpleCache,
  cacheName: 'main', // Gives the rendered HTML a unique name
  cacheExpiry: 10e3, // Set TTL of the rendered HTML. Defaults to 1 year.
});

const cacheAfterRendered = await html`
  <html lang="en">
    <body>
      <style>
        body {
          padding: 0;
          margin: 0;
          font-size: 16px;
          font-family: 'sans-serif';
          box-sizing: border-box;
        }

        .header {
          background: #0070fb;
          color: #fff;
        }

        .content {
          background: #f5f5f5;
          color: #000;
        }
      </style>

      <main>
        <div>Hello, world!</div>
        <div>This content will be cached!</div>
      </main>
    </body>
  </html>
`;

console.log('#', cacheAfterRendered); /** <html lang="en">...</html> */
```

### Minify rendered HTML

```ts
/** Import project dependencies */
import ntml from 'lit-ntml';

/** Setting up */
const html = ntml({ minifyHtml: true });

const minifyAfterRendered = await html`
  <html lang="en">
    <body>
      <style>
        body {
          padding: 0;
          margin: 0;
          font-size: 16px;
          font-family: 'sans-serif';
          box-sizing: border-box;
        }

        .header {
          background: #0070fb;
          color: #fff;
        }

        .content {
          background: #f5f5f5;
          color: #000;
        }
      </style>

      <main>
        <div>Hello, world!</div>
        <div>This content will be minified!</div>
      </main>
    </body>
  </html>
`;

console.log('#', minifyAfterRendered); /** <html lang="en"><body><style>...</style><main>...</main></body></html> */
```

## Non-TypeScript users

For non-TypeScript users, here's the snippet:

```js
const { ntml } = require('ntml');

(async () => {
  const html = ntml();

  const rendered = await html`<div>haha</div>`;

  console.log('#', rendered);
  /**
   * <div>haha</div>
   */
})();
```

## License

[MIT License][mit-license-url] © Rong Sen Ng

[mit-license-url]: https://motss.mit-license.org
[node-js-url]: https://nodejs.org
[lit-html-url]: https://github.com/PolymerLabs/lit-html
[npm-url]: https://www.npmjs.com
[es6-map-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map

[travis-badge]: https://img.shields.io/travis/rust-lang/rust.svg?style=flat-square
[version-badge]: https://img.shields.io/npm/v/lit-ntml.svg?style=flat-square
[downloads-badge]: https://img.shields.io/npm/dm/lit-ntml.svg?style=flat-square
[mit-license-badge]: https://img.shields.io/github/license/mashape/apistatus.svg?style=flat-square
[nsp-badge]: https://nodesecurity.io/orgs/motss/projects/92a9a3b3-c0c8-4172-917d-f1c7e0d5ef9f/badge
[daviddm-badge]: https://img.shields.io/david/expressjs/express.svg?style=flat-square
[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[greenkeeper-badge]: https://badges.greenkeeper.io/motss/lit-ntml.svg

[travis-url]: https://travis-ci.org/motss/lit-ntml
[version-url]: https://www.npmjs.com/package/lit-ntml
[downloads-url]: http://www.npmtrends.com/lit-ntml
[mit-license-url]: https://github.com/motss/lit-ntml/blob/master/LICENSE
[daviddm-url]: https://david-dm.org/motss/lit-ntml
[nsp-url]: https://nodesecurity.io/orgs/motss/projects/02c9094c-5d6f-4be4-b22b-8bced7a4997c
[coc-url]: https://github.com/motss/lit-ntml/blob/master/CODE_OF_CONDUCT.md
[greenkeeper-url]: https://greenkeeper.io/
