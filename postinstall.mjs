#!/usr/bin/env zx

const {
  CI = 'false',
  INIT_CWD = '',
} = process.env;

console.debug({
  CI,
  INIT_CWD,
});

if (CI !== 'true') {
  const {
    name: moduleName,
  } = JSON.parse(await fs.readFile('./package.json', { encoding: 'utf-8' }));

  if (
    !INIT_CWD.endsWith(`node_modules/${moduleName}`) &&
    INIT_CWD.endsWith(moduleName)
  ) {
    await $`simple-git-hooks`;
    await $`npm dedupe`;
  }
}
