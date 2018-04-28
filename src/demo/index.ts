// @ts-check

/** Import other modules */
import ntml from '..';

/** Setting up */
const html = ntml({
  minify: false,
});

async function nestedRender(title) {
  return html`<div>
    ${
      title == null ? '' : html`<h1>${html`${title}`}</h1>`
    }
    <p>Haha</div>
  </div>`;
}

async function main() {
  const greetings = async () => 'Hello, World!';
  const nestedRendered = await nestedRender(greetings);

  console.log('#', nestedRendered);
}

main()
  .then(r => console.log(r))
  .catch(e => console.error(e));
