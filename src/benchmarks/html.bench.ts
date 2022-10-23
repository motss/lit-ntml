import { bench, describe } from 'vitest';

import { html } from '..';

const helloWorld = `<h1>Hello, World!</h1>`;
const peopleList = [
  'John Doe',
  'Michael CEO',
  'Vict Fisherman',
  'Cash Black',
];

describe(html.name, () => {
  bench('renders', async () => {
    await html`<h1>Hello, World!</h1>`;
  });

  bench('renders with sync tasks', async () => {
    const syncTask = () => helloWorld;
    const syncLiteral = 'John Doe';

    await html`<section>${syncTask}<h2>${syncLiteral}</h2></section>`;
  });

  bench('renders with async tasks', async () => {
    const syncTask = async () => helloWorld;
    const syncLiteral = Promise.resolve('John Doe');

    await html`<section>${syncTask}<h2>${syncLiteral}</h2></section>`;
  });

  bench('renders with sync + async tasks', async () => {
    const syncTask = async () => helloWorld;
    const syncLiteral = Promise.resolve('John Doe');

    await html`<section>${syncTask}<h2>${syncLiteral}</h2></section>`;
  });

  bench('renders with a list of sync tasks', async () => {
    await html`${helloWorld}<ul>${peopleList.map(n => `<li>${n}</li>`)}</ul>`;
  });

  bench('renders external style', async () => {
    const asyncExternalStyleTask = () => html`body { margin: 0; padding: 0; box-sizing: border-box; }`;

    await html`<style>${asyncExternalStyleTask}</style>${helloWorld}`;
  });
});
