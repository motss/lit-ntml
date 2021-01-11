import type {
  parse,
  parseFragment,
  serialize,
} from 'parse5';
import { processLiterals } from './process-literals.js';

export function parseLiterals(serializeFn: typeof serialize) {
  return async (
    fn: typeof parse | typeof parseFragment,
    strings: TemplateStringsArray,
    ...exps: any[]
  ) => {
    const content = await processLiterals(strings, ...exps);

    return serializeFn((fn as typeof parse)(content));
  };
}
