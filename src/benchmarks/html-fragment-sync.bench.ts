import { bench, describe } from 'vitest';

import { htmlFragmentSync as html } from '..';

const helloWorld = `<h1>Hello, World!</h1>`;
const peopleList = [
  'John Doe',
  'Michael CEO',
  'Vict Fisherman',
  'Cash Black',
];

describe(html.name, () => {
  bench('renders', () => {
    html`<h1>Hello, World!</h1>`;
  });

  bench('renders with sync tasks', () => {
    const syncTask = () => helloWorld;
    const syncLiteral = 'John Doe';

    html`<section>${syncTask}<h2>${syncLiteral}</h2></section>`;
  });

  bench('renders with async tasks', () => {
    const syncTask = async () => helloWorld;
    const syncLiteral = Promise.resolve('John Doe');

    html`<section>${syncTask}<h2>${syncLiteral}</h2></section>`;
  });

  bench('renders with sync + async tasks', () => {
    const syncTask = async () => helloWorld;
    const syncLiteral = Promise.resolve('John Doe');

    html`<section>${syncTask}<h2>${syncLiteral}</h2></section>`;
  });

  bench('renders with a list of sync tasks', () => {
    html`${helloWorld}<ul>${peopleList.map(n => `<li>${n}</li>`)}</ul>`;
  });

  bench('renders external style', () => {
    const asyncExternalStyleTask = () => html`body { margin: 0; padding: 0; box-sizing: border-box; }`;

    html`<style>${asyncExternalStyleTask}</style>${helloWorld}`;
  });
});
