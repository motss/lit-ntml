#!/usr/bin/env node

import { spawn } from 'node:child_process'
import { readFile } from 'node:fs/promises';

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
    const cmd = 'simple-git-hooks && npm dedupe';

    process.stdout.write(cmd);
    process.stdout.write('\n\n');

    const postinstall = spawn(
      cmd,
      [],
      {
        shell: true,
        windowsHide: true,
      }
    );

    postinstall.stdout.on('data', (data) => {
      process.stdout.write(data);
    });

    postinstall.stderr.on('data', (data) => {
      process.stderr.write(data);
    });
  }
}
