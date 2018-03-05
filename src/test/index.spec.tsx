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

//   test('cached rendered html with ES6 Map cache store + a unique cached name', async () => {
//     try {
//       const lru = new Map();
//       const html = ntml({
//         cacheStore: lru,
//         cacheName: 'test',
//       });
//       const delay = 3e3;
//       const delayTask = async () =>
//         new Promise(yay => setTimeout(() => yay('Hello, delay world!'), delay));
//       const renderStarts = process.hrtime();
//       const rendered = await html`<div>${delayTask}</div>`;
//       const renderEnds = process.hrtime(renderStarts);
//       const renderWithCacheStarts = process.hrtime();
//       const renderedWithCache = await html`<div>${delayTask}</div>`;
//       const renderWithCacheEnds = process.hrtime(renderWithCacheStarts);

//       console.debug('#', toMs(renderEnds), toMs(renderWithCacheEnds));

//       expect(typeof rendered).toEqual('string');
//       expect(rendered).toEqual(
// `<!DOCTYPE html>
// <html>
//   <head></head>
//   <body>
//     <div>Hello, delay world!</div>
//   </body>
// </html>`
//       );
//       expect(toMs(renderWithCacheEnds)).toBeLessThan(10);
//       expect(renderedWithCache).toEqual(
// `<!DOCTYPE html>
// <html>
//   <head></head>
//   <body>
//     <div>Hello, delay world!</div>
//   </body>
// </html>`
//       );
//     } catch (e) {
//       throw e;
//     }
//   });

//   test('cached rendered html with custom TTL', async () => {
//     try {
//       const lru = new Map();
//       const ttl = 10e3;
//       const html = ntml({
//         cacheStore: lru,
//         cacheName: 'test',
//         cacheExpiry: ttl,
//       });
//       const delay = 3e3;
//       const delayTask = async () =>
//         new Promise(yay => setTimeout(() => yay('Hello, delay world!'), delay));
//       const renderHtml = () => html`<div>${delayTask}</div>`;
//       const renderStarts = process.hrtime();
//       const rendered = await renderHtml();
//       const renderEnds = process.hrtime(renderStarts);
//       const renderWithCustomTTLStarts = process.hrtime();
//       const renderedWithCustomTTL = await new Promise(yay =>
//         setTimeout(async () =>
//           yay(await renderHtml()), ttl + delay));
//       const renderWithCustomTTLEnds = process.hrtime(renderWithCustomTTLStarts);

//       console.debug('#', toMs(renderEnds), toMs(renderWithCustomTTLEnds));

//       expect(typeof rendered).toEqual('string');
//       expect(toMs(renderEnds)).toBeGreaterThan(delay);
//       expect(rendered).toEqual(
// `<!DOCTYPE html>
// <html>
//   <head></head>
//   <body>
//     <div>Hello, delay world!</div>
//   </body>
// </html>`
//       );
//       expect(toMs(renderWithCustomTTLEnds)).toBeGreaterThan(ttl + delay);
//       expect(renderedWithCustomTTL).toEqual(
// `<!DOCTYPE html>
// <html>
//   <head></head>
//   <body>
//     <div>Hello, delay world!</div>
//   </body>
// </html>`
//       );
//     } catch (e) {
//       throw e;
//     }
//   });

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

});
