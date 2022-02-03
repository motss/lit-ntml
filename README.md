<div align="center" style="text-align: center;">
  <h1 style="border-bottom: none;">lit-ntml</h1>

  <p>Inspired by <a href="https://github.com/PolymerLabs/lit-html" target="_blank" rel="noopener">lit-html</a> but for Node.js.</p>
</div>

<hr />

<a href="https://www.buymeacoffee.com/RLmMhgXFb" target="_blank" rel="noopener noreferrer"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: 20px !important;width: auto !important;" ></a>
[![tippin.me][tippin-me-badge]][tippin-me-url]
[![Follow me][follow-me-badge]][follow-me-url]

[![Version][version-badge]][version-url]
[![Node version][node-version-badge]][node-version-url]
[![MIT License][mit-license-badge]][mit-license-url]

[![Downloads][downloads-badge]][downloads-url]
[![Total downloads][total-downloads-badge]][downloads-url]
[![Packagephobia][packagephobia-badge]][packagephobia-url]
[![Bundlephobia][bundlephobia-badge]][bundlephobia-url]

[![ci][ga-badge]][ga-url]
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

- [x] `await` all tasks including Functions, Promises, and whatnot.
- [x] Compatible for ES Modules (`import { html } from 'lit-ntml'`) and CommonJS (`const { html } = require('lit-ntml');`).
- [x] Parses `PromiseList` or `List` by default, without explicit joining.
- [x] Support HTML syntax highlighting + autocompletion with [vscode-lit-html][vscode-lit-html-url] in JavaScript's template string.
- [x] Support native ES Module via `.mjs`.

## Pre-requisite

- [Node.js][nodejs-url] >= 14.17.3
- [NPM][npm-url] >= 6.14.13 ([NPM][npm-url] comes with [Node.js][nodejs-url] so there is no need to install separately.)
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
      import { html } from 'https://cdn.skypack.dev/lit-ntml@latest';

      // --snip
    </script>
  </head>
</html>
```

## API Reference

### html()

- returns: <[Promise][promise-mdn-url]&lt;[string][string-mdn-url]&gt;> Promise which resolves with rendered HTML document string.

### htmlSync()

This method works the same as `html()` except that this is the synchronous version.

### htmlFragment()

- returns: <[Promise][promise-mdn-url]&lt;[string][string-mdn-url]&gt;> Promise which resolves with rendered HTML document fragment string.

### htmlFragmentSync()

This method works the same as `htmlFragment()` except that this is the synchronous version.

## deno

👉 Check out the [deno] module at [deno_mod/lit_ntml].

## License

[MIT License](https://motss.mit-license.org) © Rong Sen Ng

<!-- References -->
[nodejs-url]: https://nodejs.org
[lit-html-url]: https://github.com/PolymerLabs/lit-html
[npm-url]: https://www.npmjs.com
[parse5-url]: https://www.npmjs.com/package/parse5
[pretty-url]: https://www.npmjs.com/package/pretty
[vscode-lit-html-url]: https://github.com/mjbvz/vscode-lit-html
[typescript-url]: https://github.com/Microsoft/TypeScript
[htmlminifier-url]: https://github.com/kangax/html-minifier
[htmlminifier-flags-url]: https://github.com/kangax/html-minifier#options-quick-reference
[pretty-flag-url]: https://github.com/jonschlinkert/pretty#ocd
[web-padawan-awesome-lit-html-url]:
 https://github.com/web-padawan/awesome-lit-html
[deno]: https://github.com/denoland/deno
[deno_mod/lit_ntml]: https://github.com/motss/deno_mod/tree/master/lit_ntml\
[ES Modules]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules

[parse-promiselist-or-list-url]: #parse-promiselist-or-list
[ntmlopts-url]: #ntmlopts
[default-minify-options-url]: #default_minify_options

<!-- MDN -->
[map-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
[string-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String
[object-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object
[number-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number
[boolean-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean
[html-style-element-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/API/HTMLStyleElement
[promise-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise

<!-- Badges -->
[tippin-me-badge]: https://badgen.net/badge/%E2%9A%A1%EF%B8%8Ftippin.me/@igarshmyb/F0918E
[follow-me-badge]: https://flat.badgen.net/twitter/follow/igarshmyb?icon=twitter

[version-badge]: https://flat.badgen.net/npm/v/lit-ntml?icon=npm
[node-version-badge]: https://flat.badgen.net/npm/node/lit-ntml
[mit-license-badge]: https://flat.badgen.net/npm/license/lit-ntml

[downloads-badge]: https://flat.badgen.net/npm/dm/lit-ntml
[total-downloads-badge]: https://flat.badgen.net/npm/dt/lit-ntml?label=total%20downloads
[packagephobia-badge]: https://flat.badgen.net/packagephobia/install/lit-ntml
[bundlephobia-badge]: https://flat.badgen.net/bundlephobia/minzip/lit-ntml

[ga-badge]: https://github.com/motss/lit-ntml/actions/workflows/ci.yml/badge.svg?branch=main
[codecov-badge]: https://flat.badgen.net/codecov/c/github/motss/lit-ntml?label=codecov&icon=codecov

[coc-badge]: https://flat.badgen.net/badge/code%20of/conduct/pink

<!-- Links -->
[tippin-me-url]: https://tippin.me/@igarshmyb
[follow-me-url]: https://twitter.com/igarshmyb?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=motss/lit-ntml

[version-url]: https://www.npmjs.com/package/lit-ntml
[node-version-url]: https://nodejs.org/en/download
[mit-license-url]: https://github.com/motss/lit-ntml/blob/master/LICENSE

[downloads-url]: http://www.npmtrends.com/lit-ntml
[packagephobia-url]: https://packagephobia.now.sh/result?p=lit-ntml
[bundlephobia-url]: https://bundlephobia.com/result?p=lit-ntml

[ga-url]: https://github.com/motss/lit-ntml/actions/workflows/ci.yml
[codecov-url]: https://codecov.io/gh/motss/lit-ntml

[coc-url]: https://github.com/motss/lit-ntml/blob/master/code-of-conduct.md
