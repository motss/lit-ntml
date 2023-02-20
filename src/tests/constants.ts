import type {
  html as baseHtml,
  htmlFragment as baseHtmlFragment,
  htmlFragmentSync as baseHtmlFragmentSync,
  htmlSync as baseHtmlSync,
} from '../index.js';

interface TestParamsForHtml {
  error?: Error;
  expected: string;
  inputFn(htmlFn: typeof baseHtml): Promise<string>;
  message: string;
}

interface TestParamsForHtmlFragment extends Omit<TestParamsForHtml, 'inputFn'> {
  inputFn(htmlFragmentFn: typeof baseHtmlFragment): Promise<string>;
}

interface TestParamsForHtmlFragmentSync extends Omit<TestParamsForHtmlSync, 'inputFn'> {
  inputFn(htmlFragmentFn: typeof baseHtmlFragmentSync): string;
}

interface TestParamsForHtmlSync extends Omit<TestParamsForHtml, 'inputFn'> {
  inputFn(htmlFn: typeof baseHtmlSync): string;
}

export const helloWorld = `<h1>Hello, World!</h1>` as const;
export const peopleList = [
  'John Doe',
  'Michael CEO',
  'Vict Fisherman',
  'Cash Black',
] as const;
export const removeFullHtmlTags = (input: string): string => {
  return input
    .replaceAll('<!DOCTYPE html><html><head>', '')
    .replaceAll('</head><body>', '')
    .replaceAll('</body></html>', '');
};

export const defaultTestParamsForHtml: TestParamsForHtml[] = [
  {
    expected: `<!DOCTYPE html><html><head></head><body><h1>Hello, World!</h1></body></html>`,
    inputFn(html) {
      return html`${helloWorld}`;
    },
    message: 'renders',
  },
  {
    expected: `<!DOCTYPE html><html><head></head><body><section><h1>Hello, World!</h1><h2>John Doe</h2></section></body></html>`,
    inputFn(html) {
      const syncTask = () => helloWorld;
      const syncLiteral = 'John Doe';

      return html`<section>${syncTask}<h2>${syncLiteral}</h2></section>`;
    },
    message: 'renders with sync tasks',
  },
  {
    expected: `<!DOCTYPE html><html><head></head><body><h1>Hello, World!</h1><ul><li>John Doe</li><li>Michael CEO</li><li>Vict Fisherman</li><li>Cash Black</li></ul></body></html>`,
    inputFn(html) {
      return html`${helloWorld}<ul>${peopleList.map(n => `<li>${n}</li>`)}</ul>`;
    },
    message: 'renders a list of sync tasks',
  },
  {
    expected: `<!DOCTYPE html><html><head><style><!DOCTYPE html><html><head></head><body>body { margin: 0; padding: 0; box-sizing: border-box; }</body></html></style></head><body><h1>Hello, World!</h1></body></html>`,
    inputFn(html) {
      const asyncExternalStyleTask = () => html`body { margin: 0; padding: 0; box-sizing: border-box; }`;

      return html`<style>${asyncExternalStyleTask}</style>${helloWorld}`;
    },
    message: 'renders external style',
  },
];
const testParamForError: TestParamsForHtml = {
  expected: '',
  error: new Error('error'),
  inputFn(html) {
    const errorContent = async () => {
      throw new Error('error');
    };

    return html`${errorContent}`;
  },
  message: 'throws when error happens',
};
const testParamForRenderWithAMixtureOfSyncPlusSyncTasks: TestParamsForHtml = {
  expected: `<!DOCTYPE html><html><head></head><body><section><h1>Hello, World!</h1><h2>John Doe</h2></section></body></html>`,
  async inputFn(html) {
    const asyncTask = async () => helloWorld;
    const syncLiteral = await 'John Doe';
    return html`<section>${asyncTask}<h2>${syncLiteral}</h2></section>`;
  },
  message: 'renders with a mixture of sync + async tasks',
};
const testParamForRenderWithAsyncTasks: TestParamsForHtml = {
  expected: `<!DOCTYPE html><html><head></head><body><section><h1>Hello, World!</h1><h2>John Doe</h2></section></body></html>`,
  inputFn(html) {
    const asyncTask = async () => helloWorld;
    const asyncLiteral = Promise.resolve('John Doe');

    return html`<section>${asyncTask}<h2>${asyncLiteral}</h2></section>`;
  },
  message: 'renders with async tasks',
};

export const testParamsForHtml: TestParamsForHtml[] = [
  ...defaultTestParamsForHtml,
  testParamForError,
  testParamForRenderWithAMixtureOfSyncPlusSyncTasks,
  testParamForRenderWithAsyncTasks,
];

export const testParamsForHtmlFragment: TestParamsForHtmlFragment[] = testParamsForHtml.map(({
  expected,
  ...rest
}) => {
  return {
    ...rest,
    expected: removeFullHtmlTags(expected),
  };
});

export const testParamsForHtmlSync: TestParamsForHtmlSync[] = [
  ...defaultTestParamsForHtml as unknown as TestParamsForHtmlSync[],
  {
    ...testParamForError,
    inputFn(html) {
      return html`${() => { throw new Error('error'); }}`;
    },
  },
  {
    ...testParamForRenderWithAMixtureOfSyncPlusSyncTasks,
    expected: `<!DOCTYPE html><html><head></head><body><section>[object Promise]<h2>[object Promise]</h2></section></body></html>`,
    inputFn(html) {
      const asyncTask = async () => helloWorld;
      const syncLiteral = Promise.resolve('John Doe');
      return html`<section>${asyncTask}<h2>${syncLiteral}</h2></section>`;
    },
  },
  {
    ...testParamForRenderWithAsyncTasks as unknown as TestParamsForHtmlSync,
    expected: `<!DOCTYPE html><html><head></head><body><section>[object Promise]<h2>[object Promise]</h2></section></body></html>`,
  },
];

export const testParamsForHtmlFragmentSync: TestParamsForHtmlFragmentSync[] = testParamsForHtmlSync.map(({
  expected,
  ...rest
}) => {
  return {
    ...rest,
    expected: removeFullHtmlTags(expected),
  };
});
