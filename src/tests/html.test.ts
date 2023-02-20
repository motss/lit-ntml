import { expect, it } from 'vitest';

import { html } from '../index.js';
import { testParamsForHtml } from './constants.js';

testParamsForHtml.forEach(({
  error,
  expected,
  inputFn,
  message,
}) => {
  it(message, async () => {
    try {
      const result = await inputFn(html);

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
