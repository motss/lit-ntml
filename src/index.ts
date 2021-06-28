import {
  parse,
  parseFragment,
  serialize,
} from 'parse5';
import { parseLiteralsSync } from './parse-literals-sync';
import { parseLiterals } from './parse-literals';

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

export const html = async (s: TemplateStringsArray, ...e: unknown[]): Promise<string> =>
  parser((c: string) => parse(`<!doctype html>${c}`), s, ...e);
export const htmlFragment = async (s: TemplateStringsArray, ...e: unknown[]): Promise<string> =>
  parser(parseFragment, s, ...e);

export const htmlSync = (s: TemplateStringsArray, ...e: unknown[]): string =>
  parserSync((c: string) => parse(`<!doctype html>${c}`), s, ...e);
export const htmlFragmentSync = (s: TemplateStringsArray, ...e: unknown[]): string =>
  parserSync(parseFragment, s, ...e);

export default {
  html,
  htmlFragment,
  htmlFragmentSync,
  htmlSync,
};
