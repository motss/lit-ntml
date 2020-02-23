import type {
  parse,
  parseFragment,
  serialize,
} from 'parse5';

export function parsePartial(serializeFn: typeof serialize) {
  return async (
    fn: typeof parse | typeof parseFragment,
    strings: TemplateStringsArray,
    ...exps: any[]
  ) => {
    const content = await processLiterals(strings, ...exps);
    return serializeFn(fn(content));
  };
}
