import { bench } from 'vitest';

import { html } from '../index.js';
import { testParamsForHtml } from '../tests/constants.js';

testParamsForHtml
  .map(({ inputFn, message }) => ({ inputFn, message }))
  .forEach(({
    inputFn,
    message,
  }) => {
    bench(message, async () => {
      try {
        await inputFn(html);
      } catch {
        // no-op
      }
    });
  });
