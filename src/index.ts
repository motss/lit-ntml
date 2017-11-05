// @ts-check

export declare interface Ntml {
  cacheName?: string;
}

const lru = new Map();

export function ntml({
  cacheName /** @type {string} */,
}: Ntml) {
  return async (strings: TemplateStringsArray, ...exps: (Function|Promise<string>|string)[]) => {
    try {
      const hasCacheName = typeof cacheName === 'string' && cacheName.length > 0;

      if (hasCacheName && lru.get(cacheName)) {
        return lru.get(cacheName);
      }

      const tasks: Promise<string>[] = exps.map(n => n instanceof Function ? n() : n);
      const d = await Promise.all(tasks);
      const rendered = strings.map((n, idx) => `${n}${d[idx] || ''}`).join('').trim();

      if (hasCacheName) {
        lru.set(cacheName, rendered);
      }

      console.log('#', rendered);

      return rendered;
    } catch (e) {
      throw e;
    }
  };
}

export default ntml;
