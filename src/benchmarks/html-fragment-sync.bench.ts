import { bench } from 'vitest';

import { htmlFragmentSync } from '../index.js';
import { testParamsForHtmlFragmentSync } from '../tests/constants.js';

testParamsForHtmlFragmentSync
  .map(({ inputFn, message }) => ({ inputFn, message }))
  .forEach(({
    inputFn,
    message,
  }) => {
    bench(message, () => {
      try {
        inputFn(htmlFragmentSync);
      } catch {
        // no-op
      }
    });
  });
