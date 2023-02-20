import { expect, it } from 'vitest';

import { htmlSync } from '..';
import { testParamsForHtmlSync } from './constants.js';

testParamsForHtmlSync.forEach(({
  error,
  expected,
  inputFn,
  message,
}) => {
  it(message, () => {
    try {
      const result = inputFn(htmlSync);

      if (error) {
        expect.fail('it should throw an error');
      } else {
        expect(result).toBe(expected);
      }
    } catch (e) {
      if (error) {
        expect(e).toEqual(error);
      } else if (e && error == null) {
        console.error(e, { cause: message });
        expect.fail('it should not throw any error');
      }
    }
  });
});
