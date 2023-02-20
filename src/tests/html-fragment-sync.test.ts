import { expect, it } from 'vitest';

import { htmlFragmentSync } from '../index.js';
import { testParamsForHtmlFragmentSync } from './constants.js';

testParamsForHtmlFragmentSync.forEach(({
  error,
  expected,
  inputFn,
  message,
}) => {
  it(message, () => {
    try {
      const result = inputFn(htmlFragmentSync);

      if (error) {
        expect.fail('it should not throw an error');
      } else {
        expect(result).toBe(expected);
      }
    } catch (e) {
      if (error) {
        expect(e).toEqual(error);
      } else if (e && error == null) {
        console.error(e);
        expect.fail('it should not throw any error');
      }
    }
  });
});
