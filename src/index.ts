// @ts-check

export declare interface Ntml {
  cacheName?: string;
  cacheExpiry?: number;
  cacheMaxSize?: number;
  minify?: boolean;
}

const lru = new Map();

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
      const rendered = strings.map((n, idx) => `${n}${d[idx] || ''}`).join('').trim();

      if (hasCacheName) {
        if (lru.size >= cacheMaxSize) lru.clear();
        lru.set(cacheName, { useUntil: +new Date() + cacheExpiry, data: rendered });
      }

      return rendered;
    } catch (e) {
      throw e;
    }
  };
}

export default ntml;
