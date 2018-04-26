// @ts-check

/** Import other modules */
import { ntml } from '..';

/** Setting up */
const html = ntml({
  parseHtml: true,
  minify: true,
});
const tidyHtml = ntml({
  parseHtml: true,
  minify: false,
});

async function nestedRender(title) {
  return html`<div>
    ${
      title == null ? '' : `<h1>${html`${title}`}</h1>`
    }
    <p>Haha</div>
  </div>`;
}

async function main() {
  const greetings = async () => 'Hello, World!';
  const minified = await html`<div>${greetings}</div>`;
  const rendered = await tidyHtml`<div>${greetings}</div>`;
  const nestedRendered = await nestedRender('Hello, World!');

  console.log('# %s\n\n%s', minified, rendered, nestedRendered);
}

main()
  .then(r => console.log(r))
  .catch(e => console.error(e));
