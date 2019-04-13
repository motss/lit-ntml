// @ts-check

import { terser } from 'rollup-plugin-terser';
import filesize from 'rollup-plugin-filesize';
import tslint from 'rollup-plugin-tslint';
import typescript from 'rollup-plugin-typescript2';

const isProd = !process.env.ROLLUP_WATCH;
const input = ['src/index.ts'];
const pluginFn = () => [
  isProd && tslint({
    throwError: true,
    configuration: `tslint${isProd ? '.prod' : ''}.json`,
  }),
  typescript({
    tsconfig: `./tsconfig.json`,
    exclude: isProd ? ['src/(demo|test)/**/*'] : [],
   }),
  isProd && terser(),
  isProd && filesize({ showBrotliSize: true }),
];

const multiBuild = [
  {
    file: 'dist/index.mjs',
    format: 'esm',
    sourcemap: true,
  },
  {
    file: 'dist/index.js',
    format: 'cjs',
    sourcemap: true,
  },
].map(n => ({ input, output: n, plugins: pluginFn() }));

export default multiBuild;
