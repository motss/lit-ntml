<div align="center" style="text-align: center;">
  <h1 style="border-bottom: none;">lit-ntml</h1>

  <p>Inspired by <a href="https://github.com/PolymerLabs/lit-html" target="_blank" rel="noopener">lit-html</a> but for Node.js.</p>
</div>

<hr />

[![Buy me a coffee][buy-me-a-coffee-badge]][buy-me-a-coffee-url]
[![Follow me][follow-me-badge]][follow-me-url]

[![npm-latest][npm-latest-badge]][npm-latest-url]
[![MIT License][mit-license-badge]][mit-license-url]

[![Downloads][downloads-badge]][downloads-url]
[![Total downloads][total-downloads-badge]][downloads-url]

[![Dependencies][dependencies-badge]][dependencies-url]
[![ci][ga-ci-badge]][ga-ci-url]
[![publish][ga-publish-badge]][ga-publish-url]
[![codecov][codecov-badge]][codecov-url]

[![Code of Conduct][coc-badge]][coc-url]

> Lightweight and modern templating for SSR in [Node.js][nodejs-url], inspired by [lit-html][lit-html-url].

This module also gets featured in [web-padawan/awesome-lit-html][web-padawan-awesome-lit-html-url]. Make sure to check the repo out for awesome things inspired by [lit-html][lit-html-url]. 👍💯

## Table of contents <!-- omit in toc -->

- [Features](#features)
- [Pre-requisite](#pre-requisite)
- [Enable syntax highlighting when writing HTML with template literal](#enable-syntax-highlighting-when-writing-html-with-template-literal)
  - [Visual Studio Code](#visual-studio-code)
- [Install](#install)
- [Usage](#usage)
  - [html()](#html)
  - [htmlSync()](#htmlsync)
  - [htmlFragment()](#htmlfragment)
  - [htmlFragmentSync()](#htmlfragmentsync)
  - [SSR with Express (Node.js)](#ssr-with-express-nodejs)
  - [Browser support](#browser-support)
- [API Reference](#api-reference)
  - [html()](#html-1)
  - [htmlSync()](#htmlsync-1)
  - [htmlFragment()](#htmlfragment-1)
  - [htmlFragmentSync()](#htmlfragmentsync-1)
- [deno](#deno)
- [License](#license)

## Features

| Support | Feature |
| --- | --- |
| ✅ | `await` all tasks including Functions, Promises, and whatnot. |
| ✅ | Parse `PromiseList` or `List` by default, without explicit joining. |
| ✅ | Support HTML syntax highlighting + autocompletion with [vscode-lit-html][vscode-lit-html-url] in JavaScript's template string. |

## Pre-requisite

- [Node.js][nodejs-url] >= 16.x
- [ES Modules]

## Enable syntax highlighting when writing HTML with template literal

### Visual Studio Code

1. Install [vscode-lit-html][vscode-lit-html-url] extension.
2. If the extension does not provide that syntax highlighting and autocompletion, try writing your templates in `.jsx` file (or `.tsx` file if you're [TypeScript][typescript-url] user) . That should work.

## Install

```sh
# Install via NPM
$ npm install lit-ntml
```

## Usage

### html()

```ts
import { html } from 'lit-ntml';

const peopleList = ['Cash Black', 'Vict Fisherman'];
const syncTask = () => `<h1>Hello, World!</h1>`;
const asyncLiteral = Promise.resolve('<h2>John Doe</h2>');
const asyncListTask = async () => `<ul>${peopleList.map(n => `<li>${n}</li>`)}</ul>`;

/** Assuming top-level await is enabled... */
await html`${syncTask}${asyncLiteral}${asyncListTask}`; /** <!DOCTYPE html><html><head></head><body><h1>Hello, World!</h1><h2>John Doe</h2><ul><li>Cash Black</li><li>Vict Fisherman</li></ul></body></html> */
```

### htmlSync()

```ts
import { htmlSync as html } from 'lit-ntml';

const peopleList = ['Cash Black', 'Vict Fisherman'];
const syncTask = () => `<h1>Hello, World!</h1>`;

html`${syncTask}${peopleList}`;
/** <!DOCTYPE html><html><head></head><body><h1>Hello, World!</h1>Cash BlackVictFisherman[object Promise]</body></html> */
```

### htmlFragment()

```ts
import { htmlFragment as html } from 'lit-ntml';

const syncTask = () => `<h1>Hello, World!</h1>`;
const externalStyleLiteral = `<style>body { margin: 0; padding: 0; box-sizing: border-box; }</style>`;

/** Assuming top-level await is enabled... */
await html`${externalStyleLiteral}${syncTask}`; /** <style>body { margin: 0; padding: 0; box-sizing: border-box; }</style><h1>Hello, World!</h1> */
```

### htmlFragmentSync()

```ts
import { htmlFragmentSync as html } from 'lit-ntml';

const peopleList = ['Cash Black', 'Vict Fisherman'];
const syncTask = () => `<h1>Hello, World!</h1>`;
const asyncTask = Promise.resolve(1);

html`${syncTask}${peopleList}${asyncTask}`;
/** <h1>Hello, World!</h1>Cash BlackVictFisherman[object Promise] */
```

### SSR with Express (Node.js)

[![Edit SSR with Express and LitNtml](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/ssr-with-express-and-litntml-4tbv9?fontsize=14)

### Browser support

Only modern browsers with native [ES Modules] support requires no polyfills and transpilation needed.

```html
<!doctype html>
<html>
  <head>
    <script type="module">
      import { html } from 'https://esm.sh/lit-ntml@latest';

      // --snip
    </script>
  </head>
</html>
```

## API Reference

### html()

- returns: <[Promise][promise-mdn-url]<[string][string-mdn-url]>> Promise which resolves with rendered HTML document string.

### htmlSync()

This method works the same as [html()] except that this is the synchronous version.

### htmlFragment()

- returns: <[Promise][promise-mdn-url]<[string][string-mdn-url]>> Promise which resolves with rendered HTML document fragment string.

### htmlFragmentSync()

This method works the same as [htmlFragment()] except that this is the synchronous version.

## deno

👉 Check out the [deno] module at [deno_mod/lit_ntml].

## License

[MIT License](https://motss.mit-license.org) © Rong Sen Ng



<!-- References -->
[deno_mod/lit_ntml]: https://github.com/motss/deno_mod/tree/master/lit_ntml
[deno]: https://github.com/denoland/deno
[ES Modules]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
[html()]: #html-1
[htmlFragment()]: #htmlfragment-1
[lit-html-url]: https://github.com/PolymerLabs/lit-html
[nodejs-url]: https://nodejs.org
[typescript-url]: https://github.com/Microsoft/TypeScript
[vscode-lit-html-url]: https://github.com/mjbvz/vscode-lit-html
[web-padawan-awesome-lit-html-url]: https://github.com/web-padawan/awesome-lit-html

<!-- MDN -->
[boolean-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean
[html-style-element-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/API/HTMLStyleElement
[map-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
[number-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number
[object-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object
[promise-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
[string-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String

<!-- Badges -->
[buy-me-a-coffee-badge]: https://img.shields.io/badge/buy%20me%20a-coffee-ff813f?logo=buymeacoffee&style=flat-square
[follow-me-badge]: https://img.shields.io/badge/follow-@igarshmyb-1d9bf0?logo=twitter&style=flat-square

[npm-latest-badge]: https://img.shields.io/npm/v/lit-ntml?color=blue&logo=npm&style=flat-square
[mit-license-badge]: https://img.shields.io/npm/l/lit-ntml?color=blue&style=flat-square

[downloads-badge]: https://img.shields.io/npm/dm/lit-ntml?style=flat-square
[total-downloads-badge]: https://img.shields.io/npm/dt/lit-ntml?label=total%20downloads&style=flat-square

[dependencies-badge]: https://img.shields.io/librariesio/release/npm/lit-ntml/latest?style=flat-square
[ga-ci-badge]: https://img.shields.io/github/actions/workflow/status/motss/lit-ntml/ci.yml?branch=main&label=ci&logo=githubactions&logoColor=white&style=flat-square
[ga-publish-badge]: https://img.shields.io/github/actions/workflow/status/motss/lit-ntml/publish.yml?branch=main&label=publish&logo=githubactions&logoColor=white&style=flat-square
[codecov-badge]: https://img.shields.io/codecov/c/github/motss/lit-ntml/main?label=codecov&logo=codecov&style=flat-square

[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ed55bb?style=flat-square

<!-- Links -->
[buy-me-a-coffee-url]: https://www.buymeacoffee.com/RLmMhgXFb
[follow-me-url]: https://twitter.com/igarshmyb?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=motss/lit-ntml

[npm-latest-url]: https://www.npmjs.com/package/lit-ntml/v/latest
[mit-license-url]: https://github.com/motss/lit-ntml/blob/main/LICENSE

[downloads-url]: http://www.npmtrends.com/lit-ntml

[dependencies-url]: https://libraries.io/npm/lit-ntml
[ga-ci-url]: https://github.com/motss/lit-ntml/actions/workflows/ci.yml?query=branch%3Amain
[ga-publish-url]: https://github.com/motss/lit-ntml/actions/workflows/publish.yml?query=branch%3Amain
[codecov-url]: https://app.codecov.io/gh/motss/lit-ntml/tree/main

[coc-url]: https://github.com/motss/lit-ntml/blob/main/code-of-conduct.md
