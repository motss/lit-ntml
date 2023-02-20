import { bench } from 'vitest';

import { htmlSync } from '../index.js';
import { testParamsForHtmlSync } from '../tests/constants.js';

testParamsForHtmlSync
  .map(({ inputFn, message }) => ({ inputFn, message }))
  .forEach(({
    inputFn,
    message,
  }) => {
    bench(message, () => {
      try {
        inputFn(htmlSync);
      } catch {
        // no-op
      }
    });
  });
