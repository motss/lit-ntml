// @ts-check

/** Import project dependencies */
import * as gulp from 'gulp';
import * as ts from 'gulp-typescript';
import * as babel from 'gulp-babel';
import * as sq from 'gulp-sequence';
import * as del from 'del';

const isProd = process.env.NODE_ENV === 'production';
const SRC = 'src';
const TMP = '.tmp';
const DIST = 'dist';
const BABELRC = {
  presets: [
    [
      'env',
      {
        targets: {
          node: 'current',
          // node: '6.9',
        },
        spec: true,
        modules: false,
        useBuiltIns: true,
      },
    ],
    ...(isProd ? [
      [
        'minify',
        {
          replace: false,
          removeConsole: false,
          removeDebugger: true,
        },
      ],
    ] : []),
  ],
  plugins: [
    'transform-function-bind',
    ['transform-object-rest-spread', { useBuiltIns: true }],
  ],
  ignore: isProd
    ? [
      '**/__mocks*__/*.js',
      '**/__tests*__/*.dist.spec.js',
      '**/__tests*__/*.spec.js',
    ]
    : [],
};

gulp.task('ts', () =>
  gulp.src([
    `${SRC}/**/*.ts`,
    `${SRC}/**/*.tsx`,
  ])
    .pipe(ts.createProject('./tsconfig.json')())
    .pipe(gulp.dest(TMP)));

gulp.task('babel', () =>
  gulp.src([
    `${TMP}/**/*.js`,
  ])
    .pipe(babel(BABELRC))
    .pipe(gulp.dest(DIST)));

gulp.task('clean', () => del([
  TMP,
  DIST,
]));

gulp.task('clear', () => del([
  TMP,
  './gulpfile.js',
]));

gulp.task('copy', () => gulp.src([
  `${TMP}/**/*`,
  `!${TMP}/**/*.js`,
])
  .pipe(gulp.dest(DIST)));

gulp.task('watch', () => {
  gulp.watch([
    `${SRC}/**/*.ts`,
    `${SRC}/**/*.tsx`,
  ], ['build']);
});

gulp.task('build', ['clean'], cb => sq(...[
  'ts',
  ['babel', 'copy'],
  'clear',
])(cb));

gulp.task('default', ['watch'], sq('build'));
