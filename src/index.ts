import {
  parse,
  parseFragment,
  serialize,
} from 'parse5';

import { parsePartial } from './parse-partial.js';

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

const parser = parsePartial(serialize);

export const html = async (s: TemplateStringsArray, ...e: any[]) =>
  parser(c => parse(`<!doctype html>${c}`), s, ...e);
export const htmlFragment = async (s: TemplateStringsArray, ...e: any[]) =>
  parser(parseFragment, s, ...e);

export default { html, htmlFragment };
