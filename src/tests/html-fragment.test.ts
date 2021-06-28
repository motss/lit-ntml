import { test } from 'uvu';
import * as assert from 'uvu/assert';

import { htmlFragment as html } from '..';

const helloWorld = `<h1>Hello, World!</h1>`;
const peopleList = [
  'John Doe',
  'Michael CEO',
  'Vict Fisherman',
  'Cash Black',
];

test(`throws when error happens`, async () => {
  try {
    const errorContent = async () => { throw new Error('error'); };
    await html`${errorContent}`;
  } catch (e) {
    assert.equal(e, new Error('error'));
  }
});

test(`renders`, async () => {
  const d = await html`${helloWorld}`;

  assert.is(d, `<h1>Hello, World!</h1>`);
});

test(`renders with sync tasks`, async () => {
  const syncTask = () => helloWorld;
  const syncLiteral = 'John Doe';
  const d = await html`<section>${syncTask}<h2>${syncLiteral}</h2></section>`;

  assert.is(d, `<section><h1>Hello, World!</h1><h2>John Doe</h2></section>`);
});

test(`renders with async tasks`, async () => {
  const asyncTask = async () => helloWorld;
  const asyncLiteral = Promise.resolve('John Doe');
  const d = await html`<section>${asyncTask}<h2>${asyncLiteral}</h2></section>`;

  assert.is(d, `<section><h1>Hello, World!</h1><h2>John Doe</h2></section>`);
});

test(`renders with a mixture of sync + async tasks`, async () => {
  const asyncTask = async () => helloWorld;
  const syncLiteral = await 'John Doe';
  const d = await html`<section>${asyncTask}<h2>${syncLiteral}</h2></section>`;

  assert.is(d, `<section><h1>Hello, World!</h1><h2>John Doe</h2></section>`);
});

test(`renders a list of sync tasks`, async () => {
  const d = await html`${helloWorld}<ul>${peopleList.map(n => `<li>${n}</li>`)}</ul>`;

  assert.is(d, `<h1>Hello, World!</h1><ul><li>John Doe</li><li>Michael CEO</li><li>Vict Fisherman</li><li>Cash Black</li></ul>`);
});

test(`renders external style`, async () => {
  const asyncExternalStyleTask = async () => html/* css */`body { margin: 0; padding: 0; box-sizing: border-box; }`;
  const d = await html`<style>${asyncExternalStyleTask}</style>${helloWorld}`;

  assert.is(d, `<style>body { margin: 0; padding: 0; box-sizing: border-box; }</style><h1>Hello, World!</h1>`);
});

test.run();
