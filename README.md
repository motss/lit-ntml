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

[![Code of Conduct][coc-badge]][coc-url]


> Lightweight and modern templating for SSR in [Node.js][node-js-url], inspired by [lit-html][lit-html-url].

## Features

- [x] `await` all Promise-based tasks
- [x] `cacheName: 'main'` to cache rendered content with the name `main`
- [x] `cacheExpiry: 10e3` to set cache expiry time
- [x] `cacheMaxSize: 1000` to set cache max size
- [x] `minify: true` to minify rendered HTML
- [ ] `cacheStore` to cache rendered content somewhere else instead of in-memory caching

## Pre-requisite

- [Node.js][node-js-url] >= 8.9.0
- [NPM][npm-url] >= 5.5.1 ([NPM][npm-url] comes [Node.js][node-js-url] so there is no need to install separately.)

## How to use

The following is a simple code snippet:

```ts
/* Import the package */
import ntml from 'lit-ntml';

/** Setting up */
const html = ntml(); // Set ntml({ cacheName: 'main' }) to cache the rendered content.
const header = text => () => new Promise(yay => setTimeout(() => yay(`<div class="header">${text}</div>`), 3e3));
const content = text => async () => `<div class="content">${text}</div>`;

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
      </main>
    </body>
  </html>
`;

console.log('#', rendered); /** <html lang="en>...</html> */
```

## License

[MIT License][mit-license-url] © Rong Sen Ng

[mit-license-url]: https://motss.mit-license.org
[node-js-url]: https://nodejs.org
[lit-html-url]: https://github.com/PolymerLabs/lit-html
[npm-url]: https://www.npmjs.com

[travis-badge]: https://img.shields.io/travis/rust-lang/rust.svg?style=flat-square
[version-badge]: https://img.shields.io/npm/v/lit-ntml.svg?style=flat-square
[downloads-badge]: https://img.shields.io/npm/dm/lit-ntml.svg?style=flat-square
[mit-license-badge]: https://img.shields.io/github/license/mashape/apistatus.svg?style=flat-square
[nsp-badge]: https://nodesecurity.io/orgs/motss/projects/92a9a3b3-c0c8-4172-917d-f1c7e0d5ef9f/badge
[daviddm-badge]: https://img.shields.io/david/expressjs/express.svg?style=flat-square
[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square

[travis-url]: https://travis-ci.org/motss/lit-ntml
[version-url]: https://www.npmjs.com/package/lit-ntml
[downloads-url]: http://www.npmtrends.com/lit-ntml
[mit-license-url]: https://github.com/motss/lit-ntml/blob/master/LICENSE
[daviddm-url]: https://david-dm.org/motss/lit-ntml
[nsp-url]: https://nodesecurity.io/orgs/motss/projects/02c9094c-5d6f-4be4-b22b-8bced7a4997c
[coc-url]: https://github.com/motss/lit-ntml/blob/master/CODE_OF_CONDUCT.md
