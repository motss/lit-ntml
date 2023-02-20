import { expect, it } from 'vitest';

import { htmlFragment } from '../index.js';
import { testParamsForHtmlFragment } from './constants.js';

testParamsForHtmlFragment.forEach(({
  error,
  expected,
  inputFn,
  message,
}) => {
  it(message, async () => {
    try {
      const result = await inputFn(htmlFragment);

      if (error) {
        expect.fail('it should throw an error');
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
