import { parse, parseFragment, serialize } from 'parse5';

// export const DEFAULT_MINIFY_OPTIONS: htmlMinifier.Options = {
//   collapseBooleanAttributes: true,
//   collapseWhitespace: true,
//   minifyCSS: true,
//   minifyJS: true,
//   processConditionalComments: true,
//   quoteCharacter: '"',
//   removeComments: true,
//   removeOptionalTags: true,
//   removeRedundantAttributes: true,
//   removeScriptTypeAttributes: true,
//   removeStyleLinkTypeAttributes: true,
//   sortAttributes: true,
//   sortClassName: true,
//   trimCustomFragments: true,
// };

async function processLiterals(strings: TemplateStringsArray, ...exps: any[]): Promise<string> {
  const listTask = exps.map(async (n) => {
    const tasks = (Array.isArray(n) ? n : [n])
      .map(async o => 'function' === typeof(o) ? o() : o);

    return Promise.all(tasks);
  });
  const done = await Promise.all(listTask);
  const doneLen = done.length;

  return strings.reduce((p, n, i) => {
    const nTask = done[i] ;
    const joined = Array.isArray(nTask) ? nTask.join('') : nTask;
    return `${p}${i >= doneLen ? n : `${n}${joined}`}`;
  }, '');
}

async function parsePartial(
  fn: typeof parse | typeof parseFragment,
  strings: TemplateStringsArray,
  ...exps: any[]
) {
  try {
    const content = await processLiterals(strings, ...exps);
    return serialize(fn(content));
  } catch (e) {
    throw e;
  }
}

export const html = async (s: TemplateStringsArray, ...e: any[]) =>
  parsePartial(c => parse(`<!doctype html>${c}`), s, ...e);
export const htmlFragment = async (s: TemplateStringsArray, ...e: any[]) =>
  parsePartial(parseFragment, s, ...e);

export default { html, htmlFragment };
