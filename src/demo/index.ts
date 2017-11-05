// @ts-check

/** Import project dependencies */
import express from 'express';
import html from '../';

/** Setting up */
const PORT = 4343;
const app = express();

app.get('/', async (_, res) => {
  // const waitUntil = (after) => () => new Promise(yay => setTimeout(() => yay('haha'), after));
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

  return res.send(rendered || { data: { message: 'haha' }});
});

app.listen(PORT, () => console.log(`Demo Express running at port ${PORT}...`));
