// @ts-check

/** Import project dependencies */
import htmlMinifier from 'html-minifier';

export declare interface cacheStorMap {
  useUntil: number;
  data: string;
}
export declare interface Ntml {
  cacheStore?: Map<string, cacheStorMap>;
  cacheName?: string;
  cacheExpiry?: number;
  minify?: boolean;
}

/** Setting up */
const minifyHtml = hyratedString => htmlMinifier.minify(hyratedString, {
  collapseWhitespace: true,
  removeComments: true,
});

export function ntml({
  cacheStore /** @type {Object} */,
  cacheName /** @type {string} */,
  cacheExpiry /** @type {number} */ = 12 * 30 * 24 * 3600,
  minify /** @type {boolean} */ = false,
}: Ntml = {}) {
  return async (strings: TemplateStringsArray, ...exps: (Function|Promise<any>|string)[]) => {
    try {
      const hasCacheStore = !!(typeof cacheStore !== 'undefined'
        && cacheStore.has
        && cacheStore.set
        && cacheStore.delete);
      const hasCacheName = typeof cacheName === 'string' && cacheName.length > 0;

      if (<any>hasCacheName ^ <any>hasCacheStore) {
        throw new Error(`cacheStore MUST be defined when cacheName is defined, and vice versa`);
      }

      if (hasCacheStore && hasCacheName && cacheStore.has(cacheName)) {
        const cached = cacheStore.get(cacheName);
        if (cached.useUntil >= +new Date()) return cached.data;
        else cacheStore.delete(cacheName);
      }

      const tasks: Promise<string>[] = exps.map(async n => n instanceof Function ? n() : n);
      const d = await Promise.all(tasks);
      const preRendered = strings.map((n, idx) => `${n}${d[idx] || ''}`).join('').trim();
      const rendered = minify ? minifyHtml(preRendered) : preRendered;

      if (hasCacheStore && hasCacheName) {
        const ttl = +new Date() + cacheExpiry;

        if (Number.isNaN(ttl)) {
          throw new Error(`Invalid TTL value (${cacheExpiry})! Must be a number`);
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
