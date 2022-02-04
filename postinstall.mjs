#!/usr/bin/env zx

const {
  CI = false,
  INIT_CWD = '',
} = process.env;

if (
  CI !== 'true'
) {
  const {
    name: moduleName,
  } = JSON.parse(await readFile('./package.json', { encoding: 'utf-8' }));

  if (
    !INIT_CWD.endsWith(`node_modules/${moduleName}`) &&
    INIT_CWD.endsWith(moduleName)
  ) {
    await $`simple-git-hooks && npm dedupe`;
  }
}
