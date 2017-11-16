// @ts-check

/** Import project dependencies */
import test from 'ava';

/** Import other module */
import ntml from '../';
import { setTimeout } from 'timers';

function toMs(timestamp: [number, number]) {
  return (timestamp[0] * 1e3) + (timestamp[1] * 1e-6);
}

test('render simple Hello, World', async (t) => {
  try {
    const html = ntml();
    const rendered = await html`<div>Hello, World!</div>`;

    t.true(typeof rendered === 'string');
    t.is(rendered, '<div>Hello, World!</div>');
  } catch (e) {
    t.fail();
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
    t.is(rendered, `
    <section><div>Sync Task Func</div></section>
    <section>Sync Task</section>
    <section><div>Async Task Func</div></section>
    <section>Hello, World!</section>
    `.trim());
  } catch (e) {
    t.fail();
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
    t.is(rendered, '<div>Hello, delay world!</div>');
    t.true(toMs(renderWithCacheEnds) < 10);
    t.is(renderedWithCache, '<div>Hello, delay world!</div>');
  } catch (e) {
    t.fail();
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
    t.is(rendered, '<div>Hello, delay world!</div>');
    t.true(toMs(renderWithCustomTTLEnds) >= ttl + delay);
    t.is(renderedWithCustomTTL, '<div>Hello, delay world!</div>');
  } catch (e) {
    t.fail();
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
    t.is(rendered, '<div><h1>Hello, World!</h1><ul><li>One</li><li>Two</li><li>Three</li></ul></div>');
  } catch (e) {
    t.fail();
  }
});
