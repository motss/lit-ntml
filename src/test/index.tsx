// @ts-check

/** Import project dependencies */
import { test } from 'ava';

/** Import other module */
import ntml from '../';

function toMs(timestamp: [number, number]) {
  return (timestamp[0] * 1e3) + (timestamp[1] * 1e-6);
}

test('render simple Hello, World', async (t) => {
  try {
    const html = ntml();
    const rendered = await html`<!doctype html><div>Hello, World!</div>`;

    t.true(typeof rendered === 'string');
    t.is(
      rendered,
`<!DOCTYPE html>
<html>
  <head></head>
  <body>
    <div>Hello, World!</div>
  </body>
</html>`
    );
  } catch (e) {
    t.fail(e);
  }
});

test('render html with async + sync tasks', async (t) => {
  try {
    const html = ntml();
    const syncTaskFunc = () => '<div>Sync Task Func</div>';
    const syncTask = 'Sync Task';
    const asyncTaskFunc = async () => '<div>Async Task Func</div>';
    const asyncTask = new Promise(yay => yay('Hello, World!'));
    const rendered = await html`
    <section>${syncTaskFunc}</section>
    <section>${syncTask}</section>
    <section>${asyncTaskFunc}</section>
    <section>${asyncTask}</section>
    `;

    t.true(typeof rendered === 'string');
    t.is(
      rendered,
`<!DOCTYPE html>
<html>
  <head></head>
  <body>
    <section>
      <div>Sync Task Func</div>
    </section>
    <section>Sync Task</section>
    <section>
      <div>Async Task Func</div>
    </section>
    <section>Hello, World!</section>
  </body>
</html>`
    );
  } catch (e) {
    t.fail(e);
  }
});

test('cached rendered html with ES6 Map cache store + a unique cached name', async (t) => {
  try {
    const lru = new Map();
    const html = ntml({
      cacheStore: lru,
      cacheName: 'test',
    });
    const delay = 3e3;
    const delayTask = async () => new Promise(yay => setTimeout(() => yay('Hello, delay world!'), delay));
    const renderStarts = process.hrtime();
    const rendered = await html`<div>${delayTask}</div>`;
    const renderEnds = process.hrtime(renderStarts);
    const renderWithCacheStarts = process.hrtime();
    const renderedWithCache = await html`<div>${delayTask}</div>`;
    const renderWithCacheEnds = process.hrtime(renderWithCacheStarts);

    console.log('#', toMs(renderEnds), toMs(renderWithCacheEnds));

    t.true(typeof rendered === 'string');
    t.true(toMs(renderEnds) >= delay);
    t.is(
      rendered,
`<!DOCTYPE html>
<html>
  <head></head>
  <body>
    <div>Hello, delay world!</div>
  </body>
</html>`
    );
    t.true(toMs(renderWithCacheEnds) < 10);
    t.is(
      renderedWithCache,
`<!DOCTYPE html>
<html>
  <head></head>
  <body>
    <div>Hello, delay world!</div>
  </body>
</html>`
    );
  } catch (e) {
    t.fail(e);
  }
});

test('cached renderd html with custom TTL', async (t) => {
  try {
    const lru = new Map();
    const ttl = 10e3;
    const html = ntml({
      cacheStore: lru,
      cacheName: 'test',
      cacheExpiry: ttl,
    });
    const delay = 3e3;
    const delayTask = async () => new Promise(yay => setTimeout(() => yay('Hello, delay world!'), delay));
    const renderHtml = () => html`<div>${delayTask}</div>`;
    const renderStarts = process.hrtime();
    const rendered = await renderHtml();
    const renderEnds = process.hrtime(renderStarts);
    const renderWithCustomTTLStarts = process.hrtime();
    const renderedWithCustomTTL = await new Promise(yay =>
      setTimeout(async () =>
        yay(await renderHtml()), ttl + delay));
    const renderWithCustomTTLEnds = process.hrtime(renderWithCustomTTLStarts);

    console.log('#', toMs(renderEnds), toMs(renderWithCustomTTLEnds));

    t.true(typeof rendered === 'string');
    t.true(toMs(renderEnds) >= delay);
    t.is(
      rendered,
`<!DOCTYPE html>
<html>
  <head></head>
  <body>
    <div>Hello, delay world!</div>
  </body>
</html>`
    );
    t.true(toMs(renderWithCustomTTLEnds) >= ttl + delay);
    t.is(
      renderedWithCustomTTL,
`<!DOCTYPE html>
<html>
  <head></head>
  <body>
    <div>Hello, delay world!</div>
  </body>
</html>`
    );
  } catch (e) {
    t.fail(e);
  }
});

test('render minified html', async (t) => {
  try {
    const html = ntml({
      minify: true,
    })
    const rendered = await html`
    <div>
      <h1>Hello, World!</h1>
      <ul>
        <li>One</li>
        <li>Two</li>
        <li>Three</li>
      </ul>
    </div>
    `;

    t.true(typeof rendered === 'string');
    t.is(
      rendered,
      '<!DOCTYPE html><html><head></head><body><div><h1>Hello, World!</h1><ul><li>One</li><li>Two</li><li>Three</li></ul></div></body></html>'
    );
  } catch (e) {
    t.fail(e);
  }
});

test('render with noParse', async (t) => {
  try {
    const html = ntml({
      noParse: false,
    });

    const rendered = await html`
      <style>
        div {
          font-size: 2em;
          color: blue;
        }
      </style>
      <div>Hello, World!</div>
    `;

    t.is(
      rendered,
`<style>
  div {
    font-size: 2em;
    color: blue;
  }
</style>
<div>Hello, World!</div>`
    );
  } catch (e) {
    t.fail(e);
  }
});

test('render with noParse but minify html', async (t) => {
  try {
    const html = ntml({
      noParse: false,
      minify: true,
    });

    const rendered = await html`
      <style>
        div {
          font-size: 2em;
          color: blue;
        }
      </style>
      <div>Hello, World!</div>
    `;

    t.is(
      rendered,
      '<style>div{font-size:2em;color:#00f}</style><div>Hello, World!</div>'
    );
  } catch (e) {
    t.fail(e);
  }
});

test('render with no prettify and no minify HTML', async (t) => {
  try {
    const html = ntml({
      prettify: false,
      minify: false,
    });

    const rendered = await html`
      <style>
        div {
          font-size: 2em;
          color: blue;
        }
      </style>
      <div>Hello, World!</div>
    `;

    t.is(
      rendered,
`<!DOCTYPE html><html><head><style>
        div {
          font-size: 2em;
          color: blue;
        }
      </style>
      </head><body><div>Hello, World!</div></body></html>`,
    );
  } catch (e) {
    t.fail(e);
  }
});
