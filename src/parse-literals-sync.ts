import type {
  parse,
  parseFragment,
  serialize,
} from 'parse5';
import { processLiteralsSync } from './process-literals-sync.js';

export function parseLiteralsSync(serializeFn: typeof serialize) {
  return (
    fn: typeof parse | typeof parseFragment,
    strings: TemplateStringsArray,
    ...exps: any[]
  ) => {
    const content = processLiteralsSync(strings, ...exps);
    return serializeFn(fn(content));
  };
}
