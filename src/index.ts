// @ts-check

export async function ntml(strings: TemplateStringsArray, ...exps: (Function|Promise<string>|string)[]) {
  try {
    // console.log(strings, exps);

    const tasks: Promise<string>[] = exps.map(n => n instanceof Function ? n() : n);
    const d = await Promise.all(tasks);

    // console.log('#', exps, d);

    return strings.map((n, idx) => `${n}${d[idx] || ''}`).join('').trim();
  } catch (e) {
    throw e;
  }
}

export default ntml;
