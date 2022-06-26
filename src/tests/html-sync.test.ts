import { expect, it } from 'vitest';

import { htmlSync as html } from '..';

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

  expect(d).toBe(`<!DOCTYPE html><html><head></head><body><h1>Hello, World!</h1></body></html>`);
});

it(`renders with sync tasks`, () => {
  const syncTask = () => helloWorld;
  const syncLiteral = 'John Doe';
  const d = html`<section>${syncTask}<h2>${syncLiteral}</h2></section>`;

  expect(d).toBe(`<!DOCTYPE html><html><head></head><body><section><h1>Hello, World!</h1><h2>John Doe</h2></section></body></html>`);
});

it(`renders with async tasks`, () => {
  const asyncTask = async () => helloWorld;
  const asyncLiteral = Promise.resolve('John Doe');
  const d = html`<section>${asyncTask}<h2>${asyncLiteral}</h2></section>`;

  expect(d).toBe(`<!DOCTYPE html><html><head></head><body><section>[object Promise]<h2>[object Promise]</h2></section></body></html>`);
});

it(`renders with a mixture of sync + async tasks`, async () => {
  const asyncTask = async () => helloWorld;
  const syncLiteral = await 'John Doe';
  const d = html`<section>${asyncTask}<h2>${syncLiteral}</h2></section>`;

  expect(d).toBe(`<!DOCTYPE html><html><head></head><body><section>[object Promise]<h2>John Doe</h2></section></body></html>`);
});

it(`renders a list of sync tasks`, () => {
  const d = html`${helloWorld}<ul>${peopleList.map(n => `<li>${n}</li>`)}</ul>`;

  expect(d).toBe(`<!DOCTYPE html><html><head></head><body><h1>Hello, World!</h1><ul><li>John Doe</li><li>Michael CEO</li><li>Vict Fisherman</li><li>Cash Black</li></ul></body></html>`);
});
