// @ts-check

import { terser } from 'rollup-plugin-terser';
import filesize from 'rollup-plugin-filesize';
import typescript from 'rollup-plugin-typescript2';
import { rollupImportMapPlugin } from 'rollup-plugin-import-map';

const isProd = !process.env.ROLLUP_WATCH;

const pluginFn = (format, minify, deno) => {
  return [
    deno && rollupImportMapPlugin([
      {
        imports: {
          parse5: 'https://cdn.jsdelivr.net/npm/nodemod@2.8.4/dist/lib/parse5.min.js',
        }
      }
    ]),
    typescript({
      tsconfig: './tsconfig.json',
      tsconfigOverride: {
        include: ['src/*'],
        exclude: ['src/demo/**/*', 'src/test*/**/*']
      },
      ...('umd' === format ? { tsconfigOverride: { compilerOptions: { target: 'es5' } } } : {}),
    }),
    isProd && minify && terser({
      compress: true,
      mangle: {
        module: 'esm' === format,
        properties: { regex: /^_/ },
        reserved: [],
        safari10: true,
        toplevel: true,
      },
      output: { safari10: true },
      safari10: true,
      toplevel: true,
    }),
    isProd && filesize({ showBrotliSize: true }),
  ];
};

const multiBuild = [
  {
    input: ['src/lit-ntml.ts'],
    file: 'dist/index.mjs',
    format: 'esm',
    exports: 'named',
  },
  {
    input: ['src/index.ts'],
    file: 'dist/index.js',
    format: 'cjs',
    exports: 'named',
  },
  {
    input: ['src/lit-ntml.ts'],
    file: 'dist/lit-ntml.js',
    format: 'esm',
    browser: true,
  },
  {
    input: ['src/index.ts'],
    file: 'dist/mod.js',
    format: 'esm',
    deno: true,
  },
].reduce((p, n) => {
  const { browser, deno, input, ...rest } = n;

  const opts = [true, false].map(o => ({
    input,
    output: {
      ...rest,
      file: o ? n.file.replace(/(.+)(\.m?js)$/, '$1.min$2') : n.file,
      sourcemap: true,
      sourcemapExcludeSources: true,
    },
    plugins: pluginFn(n.format, o, deno),
    treeshake: { moduleSideEffects: false },
    ...(browser && {
      external: [
        '@reallyland/esm/dist/parse5',
      ],
    }),
    ...('umd' === n.format && { content: 'window '}),
  }));

  return (p.push(...opts), p);
}, []);

export default multiBuild;
