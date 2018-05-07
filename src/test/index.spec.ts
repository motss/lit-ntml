// @ts-check

/** Import other module */
import ntml from '../';

describe('lit-ntml', () => {
  describe('rendering', () => {
    test('simple render', async () => {
      try {
        const html = ntml();
        const d = await html`<!doctype html><h1>Hello, World!</h1>`;

        expect(d).toEqual(
          `<h1>Hello, World!</h1>`
        );
      } catch (e) {
        throw e;
      }
    });

    test('render with sync tasks', async () => {
      try {
        const html = ntml();
        const syncFn = () => `<h1>Hello, World!</h1>`;
        const syncLiteral = 'John Doe';
        const d = await html`<section>${syncFn}<h2>${syncLiteral}</h2></section>`;

        expect(d).toEqual(
`<section>
  <h1>Hello, World!</h1>
  <h2>John Doe</h2>
</section>`
        );
      } catch (e) {
        throw e;
      }
    });

    test('render with async tasks', async () => {
      try {
        const html = ntml();
        const asyncFn = async () => `<h1>Hello, World!</h1>`;
        const asyncLiteral = Promise.resolve('John Doe');
        const d = await html`<section>${asyncFn}<h2>${asyncLiteral}</h2></section>`;

        expect(d).toEqual(
`<section>
  <h1>Hello, World!</h1>
  <h2>John Doe</h2>
</section>`
        );
      } catch (e) {
        throw e;
      }
    });

    test('render with mixture of sync + async tasks', async () => {
      try {
        const html = ntml();
        const asyncFn = async () => `<h1>Hello, World!</h1>`;
        const asyncLiteral = 'John Doe';
        const d = await html`<section>${asyncFn}<h2>${asyncLiteral}</h2></section>`;

        expect(d).toEqual(
`<section>
  <h1>Hello, World!</h1>
  <h2>John Doe</h2>
</section>`
        );
      } catch (e) {
        throw e;
      }
    });

  });

  describe('opts[minify]', () => {
    test('minified html', async () => {
      try {
        const html = ntml({
          minify: true,
        });
        const d = await html`<h1>Hello, World!</h1>`;

        expect(d).toEqual('<h1>Hello, World!</h1>');
      } catch (e) {
        throw e;
      }
    });

    test('unminified html', async () => {
      try {
        const html = ntml({
          minify: false,
        });
        const d = await html`<h1>Hello, World!</h1>`;

        expect(d).toEqual('<h1>Hello, World!</h1>');
      } catch (e) {
        throw e;
      }
    });

  });

  describe('opts[parse]', () => {
    test('opts[parse]=fragment', async () => {
      try {
        const html = ntml({
          options: {
            parse: 'fragment',
          },
        });
        const d = await html`<h1>Hello, World!</h1>`;

        expect(d).toEqual(
          '<h1>Hello, World!</h1>'
        );
      } catch (e) {
        throw e;
      }
    });

    test('opts[parse]=false', async () => {
      try {
        const html = ntml({
          options: {
            parse: false,
          },
        });
        const d = await html`<h1>Hello, World!</h1>`;

        expect(d).toEqual(
          '<h1>Hello, World!</h1>'
        );
      } catch (e) {
        throw e;
      }
    });

    test('opts[parse]=html', async () => {
      try {
        const html = ntml({
          options: {
            parse: 'html',
          },
        });
        const d = await html`<h1>Hello, World!</h1>`;

        expect(d).toEqual(
`<!DOCTYPE html>
<html>
  <head></head>
  <body>
    <h1>Hello, World!</h1>
  </body>
</html>`
        );
      } catch (e) {
        throw e;
      }
    });

    test('opts[parse]=true', async () => {
      try {
        const html = ntml({
          options: {
            parse: true,
          },
        });
        const d = await html`<h1>Hello, World!</h1>`;

        expect(d).toEqual(
`<!DOCTYPE html>
<html>
  <head></head>
  <body>
    <h1>Hello, World!</h1>
  </body>
</html>`
        );
      } catch (e) {
        throw e;
      }
    });

  });

  describe('error', () => {
    test('error in parsing content', async () => {
      try {
        // @ts-ignore
        const html = ntml({
          options: {
            parse: 'error',
          },
        });
        await html`<h1>Hello, World!</h1>`;
      } catch (e) {
        expect(e).toEqual(
          new Error(`Invalid parse options (error). Only allows ['html', 'fragment', true, false]`)
        );
      }
    });

  });

  describe('miscellaneous', () => {
    test('opts[options][minify]=null', async () => {
      try {
        // @ts-ignore
        const html = ntml({
          minify: true,
          options: {
            minify: null,
          },
        });
        const d = await html`<h1>Hello, World!</h1>`;

        expect(d).toEqual('<h1>Hello, World!</h1>');
      } catch (e) {
        throw e;
      }
    });

    test('custom opts[options][minify]', async () => {
      try {
        // @ts-ignore
        const html = ntml({
          minify: true,
          options: {
            minify: {
              collapseBooleanAttributes: true,
              collapseInlineTagWhitespace: true,
              collapseWhitespace: true,
              removeComments: true,
            },
          },
        });
        const d = await html`<h1>Hello, World!</h1>`;

        expect(d).toEqual('<h1>Hello, World!</h1>');
      } catch (e) {
        throw e;
      }
    });

    test('opts[options][pretty]=null', async () => {
      try {
        // @ts-ignore
        const html = ntml({
          options: {
            pretty: null,
          },
        });
        const d = await html`<h1>Hello, World!</h1>`;

        expect(d).toEqual('<h1>Hello, World!</h1>');
      } catch (e) {
        throw e;
      }
    });

    test('custom opts[options][pretty]', async () => {
      try {
        const html = ntml({
          options: {
            parse: 'html',
            pretty: {
              ocd: false,
            },
          },
        });
        const d = await html`<h1>Hello, World!</h1><h2>John Doe</h2>`;

        expect(d).toEqual(
`<!DOCTYPE html>
<html>

  <head></head>

  <body>
    <h1>Hello, World!</h1>
    <h2>John Doe</h2>
  </body>

</html>`
        );
      } catch (e) {
        throw e;
      }
    });

    test('external style', async () => {
      try {
        const parseExternalStyle = async () => ntml()`
          body {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
        `;
        const html = ntml({
          options: {
            parse: 'html',
          },
        });
        const d = await html`<style>${parseExternalStyle()}</style><h1>Hello, World!</h1>`;

        expect(d).toEqual(
`<!DOCTYPE html>
<html>
  <head>
    <style>
      body {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
    </style>
  </head>
  <body>
    <h1>Hello, World!</h1>
  </body>
</html>`
        );
      } catch (e) {
        throw e;
      }
    });

    test('PromiseList', async () => {
      try {
        const html = ntml();
        const d = await html`<h1>Hello, World!</h1><ul>${
          ['John Doe', 'Michael CEO', 'Vict Fisherman', 'Cash Black']
            .map(n => `<li>${n}</li>`)
        }</ul>`;

        expect(d).toEqual(
`<h1>Hello, World!</h1>
<ul>
  <li>John Doe</li>
  <li>Michael CEO</li>
  <li>Vict Fisherman</li>
  <li>Cash Black</li>
</ul>`
        );
      } catch (e) {
        throw e;
      }
    });

    test('collapseInlineTagWhitespace=false', async () => {
      try {
        const html = ntml();
        const d = await html`<h1>Hello, <i>World</i>!</h1>`;

        expect(d).toEqual(
`<h1>Hello,
  <i>World</i>!</h1>`
        );
      } catch (e) {
        throw e;
      }
    });

  });

});
