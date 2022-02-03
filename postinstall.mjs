#!/usr/bin/env zx

const {
  CI,
  INIT_CWD,
} = process.env;

const {
  name: moduleName,
} = JSON.parse(await fs.readFile('./package.json', { encoding: 'utf-8' }));

if (
  CI != 'true' &&
  !INIT_CWD.endsWith(`node_modules/${moduleName}`) &&
  INIT_CWD.endsWith(moduleName)
) {
  await $`simple-git-hooks && npm dedupe`;
}
