import { bench } from 'vitest';

import { htmlFragment } from '../index.js';
import { testParamsForHtmlFragment } from '../tests/constants.js';

testParamsForHtmlFragment
  .map(({ inputFn, message }) => ({ inputFn, message }))
  .forEach(({
    inputFn,
    message,
  }) => {
    bench(message, async () => {
      try {
        await inputFn(htmlFragment);
      } catch {
        // no-op
      }
    });
  });
