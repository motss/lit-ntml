import type {
  parse,
  serialize,
} from 'parse5';

import { processLiterals } from './process-literals';

export function parseLiterals(serializeFn: typeof serialize) {
  return async (
    fn: typeof parse,
    strings: TemplateStringsArray,
    ...exps: unknown[]
  ): Promise<string> => {
    const content = await processLiterals(strings, ...exps);

    return serializeFn((fn as typeof parse)(content));
  };
}
