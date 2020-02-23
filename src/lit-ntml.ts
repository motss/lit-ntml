import {
  parse,
  parseFragment,
  serialize,
} from 'nodemod/dist/lib/parse5.js';

import { parsePartial } from './parse-partial.js';

const parser = parsePartial(serialize);

export const html = async (s: TemplateStringsArray, ...e: any[]) =>
  parser(c => parse(`<!doctype html>${c}`), s, ...e);
export const htmlFragment = async (s: TemplateStringsArray, ...e: any[]) =>
  parser(parseFragment, s, ...e);

export default { html, htmlFragment };
