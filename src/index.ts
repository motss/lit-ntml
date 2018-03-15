// @ts-check

export declare interface CacheStoreMap {
  useUntil: number;
  data: string;
}
export declare interface Ntml {
  cacheStore?: Map<string, CacheStoreMap>;
  cacheName?: string;
  cacheExpiry?: number;
  minify?: boolean;
  parseHtml?: boolean;
}

/** Import project dependencies */
import * as htmlMinifier from 'html-minifier';
import parse5 from 'parse5';
import pretty from 'pretty';

export async function parseThisHtml(
  content: string
) {
  return parse5.serialize(parse5.parse(`<!doctype html>${content}`));
}

export async function minifyHtml(
  content: string,
  minify: boolean,
  shouldParseHtml: boolean
) {
  const d = shouldParseHtml ? await parseThisHtml(content) : content;

  return typeof minify === 'boolean' && minify
    ? htmlMinifier.minify(d, {
      minifyCSS: true,
      minifyJS: true,
      collapseWhitespace: true,
      removeComments: true,
    })
    : pretty(d, { ocd: true });
}

export function ntml({
  cacheStore /** @type {Map} */,
  cacheName /** @type {string} */,
  cacheExpiry /** @type {number} */ = 12 * 30 * 24 * 3600,
  minify /** @type {boolean} */ = false,
  parseHtml /** @type {boolean} */ = true,
}: Ntml = {}) {
  return async (strings: TemplateStringsArray, ...exps: any[]): Promise<string> => {
    try {
      const hasCacheStore = !!(
        cacheStore != null
          && cacheStore.has
          && cacheStore.get
          && cacheStore.set
          && cacheStore.delete
      );
      const hasCacheName = typeof cacheName === 'string' && cacheName.length > 0;
      const shouldParseHtml = typeof parseHtml === 'boolean' && parseHtml;

      /** NOTE: XOR, both must be either false or true */
      if (hasCacheName !== hasCacheStore) {
        throw new Error(`Param opts[cacheStore] MUST be defined when opts[cacheName] is defined`);
      }

      if (hasCacheStore && hasCacheName && cacheStore.has(cacheName)) {
        const cached = cacheStore.get(cacheName);

        if (cached.useUntil >= +new Date()) {
          return cached.data;
        }

        cacheStore.delete(cacheName);
      }

      const tasks: Promise<string>[] = exps.map(async n =>
        n instanceof Function
          ? n()
          : n);
      const resolvedTasks = await Promise.all(tasks);
      const resolvedTasksLen = resolvedTasks.length;
      const preRendered = strings
        .reduce((p, n, i) => `${p}${n}${i >= resolvedTasksLen ? '' : resolvedTasks[i]}`, '')
        .trim();
      const rendered = await minifyHtml(preRendered, minify, shouldParseHtml);

      if (hasCacheStore && hasCacheName) {
        const ttl = +new Date() + cacheExpiry;

        if (Number.isNaN(+ttl)) {
          throw new TypeError('Param opts[cacheExpiry] is not a number');
        }

        cacheStore.set(cacheName, { useUntil: ttl, data: rendered });
      }

      return rendered;
    } catch (e) {
      throw e;
    }
  };
}

export default ntml;
