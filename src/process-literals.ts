async function processLiterals(strings: TemplateStringsArray, ...exps: any[]): Promise<string> {
  const listTask = exps.map(async (n) => {
    const tasks = (Array.isArray(n) ? n : [n])
      .map(async o => 'function' === typeof(o) ? o() : o);

    return Promise.all(tasks);
  });
  const done = await Promise.all(listTask);
  const doneLen = done.length;

  return strings.reduce((p, n, i) => {
    const nTask = done[i] ;
    const joined = Array.isArray(nTask) ? nTask.join('') : nTask;
    return `${p}${i >= doneLen ? n : `${n}${joined}`}`;
  }, '');
}
