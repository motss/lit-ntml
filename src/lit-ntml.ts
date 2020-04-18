import {
  parse,
  parseFragment,
  serialize,
  // @ts-ignore
} from 'https://cdn.jsdelivr.net/npm/nodemod@latest/dist/lib/parse5.min.js';
import { parseLiteralsSync } from './parse-literals-sync.js';
import { parseLiterals } from './parse-literals.js';

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

const parser = parseLiterals(serialize);
const parserSync = parseLiteralsSync(serialize);

export const html = async (s: TemplateStringsArray, ...e: any[]) =>
  parser(c => parse(`<!doctype html>${c}`), s, ...e);
export const htmlFragment = async (s: TemplateStringsArray, ...e: any[]) =>
  parser(parseFragment, s, ...e);

export const htmlSync = (s: TemplateStringsArray, ...e: any[]) =>
  parserSync(c => parse(`<!doctype html>${c}`), s, ...e);
export const htmlFragmentSync = (s: TemplateStringsArray, ...e: any[]) =>
  parserSync(parseFragment, s, ...e);

export default {
  html,
  htmlFragment,
  htmlFragmentSync,
  htmlSync,
};
