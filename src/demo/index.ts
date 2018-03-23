// @ts-check

/** Import other modules */
import ntml from '../../';

/** Setting up */
const html = ntml({
  parseHtml: true,
  minify: true,
});
const tidyHtml = ntml({
  parseHtml: true,
  minify: false,
});

(async function main() {
  try {
    const greetings = async () => 'Hello, World!';
    const minified = await html`<div>${greetings}</div>`;
    const rendered = await tidyHtml`<div>${greetings}</div>`;

    console.log('# %s\n\n%s', minified, rendered);
  } catch (e) {
    console.error('^ Error', e);
  }
})();
