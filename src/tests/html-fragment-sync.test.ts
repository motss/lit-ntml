import { expect, it } from 'vitest';

import { htmlFragmentSync as html } from '..';

const helloWorld = `<h1>Hello, World!</h1>`;
const peopleList = [
  'John Doe',
  'Michael CEO',
  'Vict Fisherman',
  'Cash Black',
];

it(`throws when error happens`, () => {
  try {
    html`${() => { throw new Error('error'); }}`;
  } catch (e) {
    expect(e).toEqual(new Error('error'));
  }
});

it(`renders`, () => {
  const d = html`${helloWorld}`;

  expect(d).toBe(`<h1>Hello, World!</h1>`);
});

it(`renders with sync tasks`, () => {
  const syncTask = () => helloWorld;
  const syncLiteral = 'John Doe';
  const d = html`<section>${syncTask}<h2>${syncLiteral}</h2></section>`;

  expect(d).toBe(`<section><h1>Hello, World!</h1><h2>John Doe</h2></section>`);
});

it(`renders with async tasks`, () => {
  const asyncTask = async () => helloWorld;
  const asyncLiteral = Promise.resolve('John Doe');
  const d = html`<section>${asyncTask}<h2>${asyncLiteral}</h2></section>`;

  expect(d).toBe(`<section>[object Promise]<h2>[object Promise]</h2></section>`);
});

it(`renders with a mixture of sync + async tasks`, () => {
  const asyncTask = () => helloWorld;
  const syncLiteral = Promise.resolve('John Doe');
  const d = html`<section>${asyncTask}<h2>${syncLiteral}</h2></section>`;

  expect(d).toBe(`<section><h1>Hello, World!</h1><h2>[object Promise]</h2></section>`);
});

it(`renders a list of sync tasks`, () => {
  const d = html`${helloWorld}<ul>${peopleList.map(n => `<li>${n}</li>`)}</ul>`;

  expect(d).toBe(`<h1>Hello, World!</h1><ul><li>John Doe</li><li>Michael CEO</li><li>Vict Fisherman</li><li>Cash Black</li></ul>`);
});

it(`renders external style`, () => {
  const asyncExternalStyleTask = () => html`body { margin: 0; padding: 0; box-sizing: border-box; }`;
  const d = html`<style>${asyncExternalStyleTask}</style>${helloWorld}`;

  expect(d).toBe(`<style>body { margin: 0; padding: 0; box-sizing: border-box; }</style><h1>Hello, World!</h1>`);
});
