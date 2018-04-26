<div align="center" style="text-align: center;">
  <h1 style="border-bottom: none;">lit-ntml</h1>

  <p>Inspired by <a href="https://github.com/PolymerLabs/lit-html" target="_blank" rel="noopener">lit-html</a> but for Node.js.</p>
</div>

<hr />

[![Version][version-badge]][version-url]
[![Downloads][downloads-badge]][downloads-url]
[![MIT License][mit-license-badge]][mit-license-url]
[![Code of Conduct][coc-badge]][coc-url]

[![Build Status][travis-badge]][travis-url]
[![CircleCI][circleci-badge]][circleci-url]
[![Dependency Status][daviddm-badge]][daviddm-url]
[![NSP Status][nsp-badge]][nsp-url]
[![codecov][codecov-badge]][codecov-url]
[![Coverage Status][coveralls-badge]][coveralls-url]

> Lightweight and modern templating for SSR in [Node.js][nodejs-url], inspired by [lit-html][lit-html-url].

## Table of contents

- [Features](#features)
- [Pre-requisite](#pre-requisite)
- [How to use](#how-to-use)
  - [Install](#install)
  - [Enable syntax highlighting when writing HTML with template literal](#enable-syntax-highlighting-when-writing-html-with-template-literal)
    - [Visual Studio Code](#visual-studio-code)
  - [Code examples](#code-examples)
    - [Await all tasks (Promises, Functions, strings, etc)](#await-all-tasks-promises-functions-strings-etc)
    - [Use custom cache store + unique cache name to cache rendered HTML string](#use-custom-cache-store-unique-cache-name-to-cache-rendered-html-string)
    - [Minify rendered HTML string](#minify-rendered-html-string)
    - [Non-TypeScript users](#non-typescript-users)
- [API Reference](#api-reference)
  - [ntml([options])](#ntmloptions)
- [Caveat](#caveat)
  - [CSS styles outside of &lt;style&gt;](#css-styles-outside-of-ltstylegt)
- [License](#license)

## Features

- [x] `await` all tasks including Promises.
- [x] `cacheStore: new QuickLru()` to use a custom [ES6 Map][map-mdn-url] compliant cache instance.
- [x] `cacheExpiry: 10e3` to set TTL of a cached item. Defaults to 1 year of TTL.
- [x] `minify: true` to minify rendered HTML string.
- [x] `parseHtml: true` to parse content as HTML5 string. If false, content will be parsed as HTML fragment string.
- [x] Compatible for ES Modules (`import ntml from 'ntml'`) and CommonJS (`const { ntml } = require('ntml');`).
- [x] Uses [parse5][parse5-url] to parse HTML string by default.
- [x] Uses [pretty][pretty-url] to prettify HTML string by default.
- [x] Support HTML syntax highlighting + autocompletion with [vscode-lit-html][vscode-lit-html-url] in JavaScript's template string.

## Pre-requisite

- [Node.js][nodejs-url] >= 8.9.0
- [NPM][npm-url] >= 5.5.1 ([NPM][npm-url] comes with [Node.js][nodejs-url] so there is no need to install separately.)

## How to use

### Install

```sh
# Install via NPM
$ npm install lit-ntml
```

### Enable syntax highlighting when writing HTML with template literal

#### Visual Studio Code

1. Install [vscode-lit-html][vscode-lit-html-url] extension.
1. If the extension does not provide that syntax highlighting and autocompletion, try writing your templates in `.jsx` file (or `.tsx` file if you're [TypeScript][typescript-url] user) . That should work.

### Code examples

#### Await all tasks (Promises, Functions, strings, etc)

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

#### Use custom cache store + unique cache name to cache rendered HTML string

```ts
/** Import project dependencies */
import ntml from 'lit-ntml';
import QuickLru from 'quick-lru';

/** Setting up */
const cacheStore = new QuickLru({ maxSize: 1000 }); // A cache instance must be ES6 Map compliant.
// const simpleCache = new Map(); // Simple cache using ES6 Map.
const html = ntml({
  cacheStore, // cacheStore: simpleCache,
  cacheName: 'main', // Gives the rendered HTML string a unique name
  cacheExpiry: 10e3, // Set TTL of the rendered HTML string. Defaults to 1 year.
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

#### Minify rendered HTML string

```ts
/** Import project dependencies */
import ntml from 'lit-ntml';

/** Setting up */
const html = ntml({
  minify: true,
});

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

#### Non-TypeScript users

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

## API Reference

### ntml([options])

- `options` <[?Object][object-mdn-url]> Optional configuration for the templating.
  - `cacheStore` <[Map][map-mdn-url]> Optional custom ES6 Map compliant cache instance to cache rendered HTML string.
  - `cacheName` <[string][string-mdn-url]> Optional name of the rendered HTML string that needs to be cached. **_Use a unique name for each rendered HTML string to avoid cache conflict._**
  - `cacheExpiry` <[number][number-mdn-url]> Optional cache expiry date of rendered HTML string. Defaults to **1 year** (`12 * 30 * 24 * 3600`).
  - `minify` <[boolean][boolean-mdn-url]> Optional minification flag. If true, minify rendered HTML string. Defaults to `false`.
  - `parseHtml` <[boolean][boolean-mdn-url]> Optional flag to parse content as HTML string or HTML fragment string with [parse5][parse5-url], a HTML compliant parser for Node.js. Defaults to `true`.
- returns: <[Promise][promise-mdn-url]&lt;[string][string-mdn-url]&gt;> Promise which resolves with rendered HTML string.

## Caveat

Writing CSS styles outside of [HTMLStyleElement][html-style-element-mdn-url] can lead to unexpected parsing behavior, such as:

### CSS styles outside of &lt;style&gt;

```js
import ntml from 'lit-ntml';

const html = ntml();
const style = () => html`
  body {}

  div {}
`;

const main = () => html`
  <style>${style()}</style>
`;

/**
 * <!DOCTYPE>
 * <html> 
 *   <head>
 *     <style>
 *       <!DOCTYPE html>
 *       <html>
 *         <head>
 *           <style>
 *             body {}
 *
 *             div {}
 *           </style>
 *         </head>
 *       </html>
 *     </style>
 *   </head>
 * </html>
 * 
 */

```

It's clearly that the `style` tag element has been wrapped inside another `html` tag element. This is an unexpected behavior. However, it kind of makes sense as from the above scenario each of the new content is rendered separately with `lit-ntml` and the `lit-ntml` has no knowledge about what will be rendered next and before. To avoid such behavior, do one of the following:

1. Wrap with any valid HTML element tag

    ```js
    const style = () => html`
    <style>
      body {}

      main {}
    </style>`;
    ```

1. Simply set `parseHtml` flag to `false`

    ```js
    const { ntml } = require('lit-ntml');
    const html = ntml({
      parseHtml: false,
    });
    const style = () => html`
    body {}
    main {}
    `;
    const main = () => html`<style>${style}</style>`;
    ```

## License

[MIT License](https://motss.mit-license.org) © Rong Sen Ng

[nodejs-url]: https://nodejs.org
[lit-html-url]: https://github.com/PolymerLabs/lit-html
[npm-url]: https://www.npmjs.com
[parse5-url]: https://www.npmjs.com/package/parse5
[pretty-url]: https://www.npmjs.com/package/pretty
[vscode-lit-html-url]: https://github.com/mjbvz/vscode-lit-html
[typescript-url]: https://github.com/Microsoft/TypeScript
[map-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
[string-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String
[object-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object
[number-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number
[boolean-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean
[html-style-element-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/API/HTMLStyleElement
[promise-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise

[version-badge]: https://img.shields.io/npm/v/lit-ntml.svg?style=flat-square
[downloads-badge]: https://img.shields.io/npm/dm/lit-ntml.svg?style=flat-square
[mit-license-badge]: https://img.shields.io/github/license/mashape/apistatus.svg?style=flat-square
[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square

[travis-badge]: https://img.shields.io/travis/motss/lit-ntml.svg?style=flat-square
[circleci-badge]: https://circleci.com/gh/motss/lit-ntml/tree/master.svg?style=svg
[daviddm-badge]: https://img.shields.io/david/motss/lit-ntml.svg?style=flat-square
[nsp-badge]: https://nodesecurity.io/orgs/motss/projects/02c9094c-5d6f-4be4-b22b-8bced7a4997c/badge
[codecov-badge]: https://codecov.io/gh/motss/lit-ntml/branch/master/graph/badge.svg
[coveralls-badge]: https://coveralls.io/repos/github/motss/lit-ntml/badge.svg?branch=master

[version-url]: https://www.npmjs.com/package/lit-ntml
[downloads-url]: http://www.npmtrends.com/lit-ntml
[mit-license-url]: https://github.com/motss/lit-ntml/blob/master/LICENSE
[coc-url]: https://github.com/motss/lit-ntml/blob/master/CODE_OF_CONDUCT.md

[travis-url]: https://travis-ci.org/motss/lit-ntml
[circleci-url]: https://circleci.com/gh/motss/lit-ntml/tree/master
[daviddm-url]: https://david-dm.org/motss/lit-ntml
[nsp-url]: https://nodesecurity.io/orgs/motss/projects/02c9094c-5d6f-4be4-b22b-8bced7a4997c
[codecov-url]: https://codecov.io/gh/motss/lit-ntml
[coveralls-url]: https://coveralls.io/github/motss/lit-ntml?branch=master
