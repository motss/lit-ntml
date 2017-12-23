// @ts-check

/** Import project dependencies */
import * as express from 'express';
import * as parse5 from 'parse5';
import * as QuickLru from 'quick-lru';
import ntml from '../';

/** Setting up */
const PORT = 4343;
const app = express();
const lru = new QuickLru({ maxSize: 1000 });
const html = ntml({
  cacheStore: lru,
  cacheName: 'main',
});

app.get('/', async (_, res) => {
  try {
    // const waitUntil = (after) => () => new Promise(yay => setTimeout(() => yay('haha'), after));
    const header = text => () =>
      new Promise(yay => setTimeout(() => yay(`<div class="header">${text}</div>`), 3e3));
    const content = text => async () => `<div class="content">${text}</div>`;
    const moreContent = await ntml({
      cacheStore: lru,
      cacheName: 'more',
      minify: true,
    })`
      <div>More content!</div>
      <ul>
        <li>Test list content</li>
        <li>Test list content</li>
        <li>Test list content</li>
        <li>Test list content</li>
        <li>Test list content</li>
        <li>Test list content</li>
        <li>Test list content</li>
        <li>Test list content</li>
      </ul>
    `;
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
            <div>${moreContent}</div>
            <div>${someLoremIpsum}</div>

            <ul>${
              [1,2,3,4].map(n => `<li>${n}</li>`).join('')
            }</ul>

            <div>${await Promise.resolve(1)}</div>
            <div>${1}</div>
            <div>${await someLoremIpsum}</div>
            <div>${
              [...Array(10)].map((n, idx) => idx)
            }</div>
          </main>
        </body>
      </html>
    `;

    console.log('#', rendered);

    return res.send(rendered || {
      data: { message: 'haha' },
    });
  } catch (e) {
    console.error('Failure -', e);
  }
});
app.get('/short', async (_, res, next) => {
  try {
    const listMe = await html`
      <ul>${[1,2,3].map(n => `<li>${n}</li>`).join('')}</ul>
    `;
    const rendered = await html`
      <!doctype html>
      <style>
        body {
          font-size: 3em;
          color: blue;
        }
      </style>

      <div>Hello, world!</div>
      ${listMe}
    `;
    const d = parse5.serialize(parse5.parse(rendered));

    return res.send(d);
  } catch (e) {
    return next(e);
  }
});

app.listen(PORT, () => console.log(`Demo Express running at port ${PORT}...`));
