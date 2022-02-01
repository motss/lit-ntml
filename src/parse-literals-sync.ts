import type {
  parse,
  serialize,
} from 'parse5';

import { processLiteralsSync } from './process-literals-sync';

export function parseLiteralsSync(serializeFn: typeof serialize) {
  return (
    fn: typeof parse,
    strings: TemplateStringsArray,
    ...exps: unknown[]
  ): string => {
    const content = processLiteralsSync(strings, ...exps);
    return serializeFn((fn as typeof parse)(content));
  };
}
