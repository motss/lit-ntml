export function processLiteralsSync(
  strings: TemplateStringsArray,
  ...exps: any[]
): string {
  const done = exps.map((n) => {
    return (Array.isArray(n) ? n : [n]).map(o => 'function' === typeof(o) ? o() : o);
  });
  const doneLen = done.length;

  return strings.reduce((p, n, i) => {
    const nTask = done[i] ;
    const joined = Array.isArray(nTask) ? nTask.join('') : nTask;
    return `${p}${i >= doneLen ? n : `${n}${joined}`}`;
  }, '');
}
