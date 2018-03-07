// @ts-check

/** Import other module */
import ntml from '../';

function toMs(timestamp: [number, number]) {
  return (timestamp[0] * 1e3) + (timestamp[1] * 1e-6);
}

jest.useFakeTimers();

describe('lit-ntml', () => {
  test('render simple Hello, World', async () => {
    try {
      const html = ntml();
      const rendered = await html`<!doctype html><div>Hello, World!</div>`;

      expect(typeof rendered).toEqual('string');
      expect(rendered).toEqual(
`<!DOCTYPE html>
<html>
  <head></head>
  <body>
    <div>Hello, World!</div>
  </body>
</html>`
      );
    } catch (e) {
      throw e;
    }
  });

  test('render html with async + sync tasks', async () => {
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

      expect(typeof rendered).toEqual('string');
      expect(rendered).toEqual(
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
      throw e;
    }
  });

  test('cached rendered html with ES6 Map cache store + a unique cached name', async () => {
    try {
      const lru = new Map();
      const html = ntml({
        cacheStore: lru,
        cacheName: 'test',
      });
      const mockFn = jest.fn((input = '') => `Hello, ${input == null ? '' : `${input} `}World!`);
      const delayTask = async () => new Promise(yay => setTimeout(() => yay(mockFn('delay')), 999e3));
      const expectedRendered =
`<!DOCTYPE html>
<html>
  <head></head>
  <body>
    <div>Hello, delay World!</div>
  </body>
</html>`;
      const rendered = html`<div>${delayTask}</div>`;
      const renderedWithCache = html`<div>${delayTask}</div>`;
      
      expect(mockFn).not.toHaveBeenCalledWith('delay');

      jest.advanceTimersByTime(999e3);

      expect(mockFn).toHaveBeenCalledWith('delay');
      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(await rendered).toEqual(expectedRendered);
      expect(await renderedWithCache).toEqual(expectedRendered);
      expect(lru.has('test')).toBe(true);
      expect(lru.get('test')).toEqual({
        data: expectedRendered,
        useUntil: expect.any(Number),
      });
    } catch (e) {
      throw e;
    }
  });

  test('cached rendered html with custom TTL', async () => {
    try {
      const lru = new Map();
      const ttl = 10e3;
      const html = ntml({
        cacheStore: lru,
        cacheName: 'test',
        cacheExpiry: ttl,
      });
      const mockFn = jest.fn((input = '') => `Hello, ${input == null ? '' : `${input} `}World!`);
      const expectedRendered =
`<!DOCTYPE html>
<html>
  <head></head>
  <body>
    <div>Hello, delay World!</div>
  </body>
</html>`;
      const delayTask = async () => new Promise(yay => setTimeout(() => yay(mockFn('delay')), 999e3));
      const renderedWithCustomTTL = html`<div>${delayTask}</div>`;
      
      
      expect(mockFn).not.toHaveBeenCalledWith('delay');
      
      jest.advanceTimersByTime(999e3);
      
      expect(mockFn).toHaveBeenCalledWith('delay');

      const beforeRenderTimestamp = +new Date();

      expect(await renderedWithCustomTTL).toEqual(expectedRendered);
      expect(lru.has('test')).toBe(true);
      expect(lru.get('test')).toEqual({
        data: expectedRendered,
        useUntil: expect.any(Number),
      });
      expect((beforeRenderTimestamp + ttl) - lru.get('test').useUntil).toBeLessThanOrEqual(0);
    } catch (e) {
      throw e;
    }
  });

  test('render minified html', async () => {
    try {
      const html = ntml({
        minify: true,
      });
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

      expect(typeof rendered).toEqual('string');
      expect(rendered).toEqual(
        // tslint:disable-next-line:max-line-length
        '<!DOCTYPE html><html><head></head><body><div><h1>Hello, World!</h1><ul><li>One</li><li>Two</li><li>Three</li></ul></div></body></html>'
      );
    } catch (e) {
      throw e;
    }
  });

  test('render with noParse', async () => {
    try {
      const html = ntml({
        parseHtml: false,
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

      expect(rendered).toEqual(
`<style>
  div {
    font-size: 2em;
    color: blue;
  }
</style>
<div>Hello, World!</div>`
      );
    } catch (e) {
      throw e;
    }
  });

  test('render with noParse but minify html', async () => {
    try {
      const html = ntml({
        parseHtml: false,
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

      expect(rendered).toEqual(
        '<style>div{font-size:2em;color:#00f}</style><div>Hello, World!</div>'
      );
    } catch (e) {
      throw e;
    }
  });

  test('render without HTML minification', async () => {
    try {
      const html = ntml({
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

      expect(rendered).toEqual(
`<!DOCTYPE html>
<html>
  <head>
    <style>
      div {
        font-size: 2em;
        color: blue;
      }
    </style>
  </head>
  <body>
    <div>Hello, World!</div>
  </body>
</html>`
      );
    } catch (e) {
      throw e;
    }
  });

  test('Param opts[cacheExpiry] is not a number', async () => {
    try {
      const errorMap = new Map();
      const html = ntml({
        cacheStore: errorMap,
        cacheExpiry: NaN,
        cacheName: 'test',
      });

      await html`<div>cacheExpiry is not a number</div>`;
    } catch (e) {
      expect(e instanceof TypeError).toBe(true);
      expect(e.message).toEqual('Param opts[cacheExpiry] is not a number');
    }
  });

  test('Param opts[cacheStore] MUST be defined when opts[cacheName] is defined', async () => {
    try {
      const html = ntml({
        cacheName: 'test',
      });

      await html`<div>Invalid cacheStore</div>`;
    } catch (e) {
      expect(e instanceof Error).toBe(true);
      expect(e.message).toEqual('Param opts[cacheStore] MUST be defined when opts[cacheName] is defined');
    }
  });

  test('opts[cacheExpiry] timed out', async () => {
    try {
      jest.useRealTimers();

      const timedOutMap = new Map();
      const mockFn = jest.fn(() => 'delete');
      timedOutMap.delete = mockFn;
      
      const html = ntml({
        cacheExpiry: 2e3,
        cacheName: 'test',
        cacheStore: timedOutMap,
      });

      expect(mockFn).not.toHaveBeenCalled();

      await html`<div></div>`;
      await new Promise(yay => setTimeout(() => yay(), 3e3));
      await html`<div></div>`;

      expect(mockFn).toHaveBeenCalledTimes(1);
    } catch (e) {
      throw e;
    }
  });

  test('serving cached rendered content', async () => {
    try {
      const cacheMap = new Map();
      const html = ntml({
        cacheStore: cacheMap,
        cacheName: 'test',
      });

      await html`<div></div>`;
      const cachedRendered = await html`<div></div>`;

      expect(cachedRendered)
        .toEqual(
`<!DOCTYPE html>
<html>
  <head></head>
  <body>
    <div></div>
  </body>
</html>`
        );
    } catch (e) {
      throw e;
    }
  });

});
