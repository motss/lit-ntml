# lit-ntml

[![Greenkeeper badge](https://badges.greenkeeper.io/motss/lit-ntml.svg)](https://greenkeeper.io/)

> Inspired by [lit-html][lit-html-url] but for Node.js.

Lightweight and modern templating for SSR in Node.js, inspired by [lit-html][lit-html-url].

## Features

- [x] `await` all Promise-based tasks
- [ ] `cache: true` to cache rendered content

## How to use

The following is a simple code snippet:

```ts
/* Import the package */
import html from 'lit-ntml';

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

[MIT License](https://motss.mit-license.org) © Rong Sen Ng
