import { htmlFragment } from '..';

const helloWorld = `<h1>Hello, World!</h1>`;
const peopleList = [
  'John Doe',
  'Michael CEO',
  'Vict Fisherman',
  'Cash Black',
];

describe('htmlFragment', () => {
  const html = htmlFragment;

  it(`throws when error happens`, async () => {
    try {
      const errorContent = async () => { throw new Error('error'); };
      await html`${errorContent}`;
    } catch (e) {
      expect(e).toStrictEqual(new Error('error'));
    }
  });

  it(`renders`, async () => {
    const d = await html`${helloWorld}`;

    expect(d).toStrictEqual(
      `<h1>Hello, World!</h1>`
    );
  });

  it(`renders with sync tasks`, async () => {
    const syncTask = () => helloWorld;
    const syncLiteral = 'John Doe';
    const d = await html`<section>${syncTask}<h2>${syncLiteral}</h2></section>`;

    expect(d).toStrictEqual(
      // tslint:disable-next-line: max-line-length
      `<section><h1>Hello, World!</h1><h2>John Doe</h2></section>`
    );
  });

  it(`renders with async tasks`, async () => {
    const asyncTask = async () => helloWorld;
    const asyncLiteral = Promise.resolve('John Doe');
    const d = await html`<section>${asyncTask}<h2>${asyncLiteral}</h2></section>`;

    expect(d).toStrictEqual(
      // tslint:disable-next-line: max-line-length
      `<section><h1>Hello, World!</h1><h2>John Doe</h2></section>`
    );
  });

  it(`renders with a mixture of sync + async tasks`, async () => {
    const asyncTask = async () => helloWorld;
    const syncLiteral = await 'John Doe';
    const d = await html`<section>${asyncTask}<h2>${syncLiteral}</h2></section>`;

    expect(d).toStrictEqual(
      // tslint:disable-next-line: max-line-length
      `<section><h1>Hello, World!</h1><h2>John Doe</h2></section>`
    );
  });

  it(`renders a list of sync tasks`, async () => {
    const d = await html`${helloWorld}<ul>${peopleList.map(n => `<li>${n}</li>`)}</ul>`;

    expect(d).toStrictEqual(
      // tslint:disable-next-line: max-line-length
      `<h1>Hello, World!</h1><ul><li>John Doe</li><li>Michael CEO</li><li>Vict Fisherman</li><li>Cash Black</li></ul>`
    );
  });

  it(`renders external style`, async () => {
    // tslint:disable-next-line: max-line-length
    const asyncExternalStyleTask = async () => html/* css */`body { margin: 0; padding: 0; box-sizing: border-box; }`;
    const d = await html`<style>${asyncExternalStyleTask}</style>${helloWorld}`;

    expect(d).toStrictEqual(
      // tslint:disable-next-line: max-line-length
      `<style>body { margin: 0; padding: 0; box-sizing: border-box; }</style><h1>Hello, World!</h1>`
    );
  });

});
