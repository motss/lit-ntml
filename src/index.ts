// @ts-check

/** Import project dependencies */
import htmlMinifier from 'html-minifier';

export declare interface Ntml {
  cacheName?: string;
  cacheExpiry?: number;
  cacheMaxSize?: number;
  minify?: boolean;
}

/** Setting up */
const lru = new Map();
const minifyHtml = hyratedString => htmlMinifier.minify(hyratedString, {
  collapseWhitespace: true,
  removeComments: true,
});

export function ntml({
  cacheName /** @type {string} */,
  cacheExpiry /** @type {number} */ = 12 * 30 * 24 * 3600,
  cacheMaxSize /** @type {number} */ = 1000,
  minify /** @type {boolean} */ = false,
}: Ntml) {
  return async (strings: TemplateStringsArray, ...exps: (Function|Promise<string>|string)[]) => {
    try {
      const hasCacheName = typeof cacheName === 'string' && cacheName.length > 0;

      if (hasCacheName && lru.has(cacheName)) {
        const cached = lru.get(cacheName);
        if (cached.useUntil >= +new Date()) return cached.data;
        else lru.delete(cacheName);
      }

      const tasks: Promise<string>[] = exps.map(n => n instanceof Function ? n() : n);
      const d = await Promise.all(tasks);
      const preRendered = strings.map((n, idx) => `${n}${d[idx] || ''}`).join('').trim();
      const rendered = minify ? minifyHtml(preRendered) : preRendered;

      if (hasCacheName) {
        if (lru.size >= cacheMaxSize) lru.clear();
        lru.set(cacheName, { useUntil: +new Date() + cacheExpiry, data: rendered });
      }

      console.log('#', lru.entries());

      return rendered;
    } catch (e) {
      throw e;
    }
  };
}

export default ntml;
