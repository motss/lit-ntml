const gulp = require('gulp');
const builder = require('@messageflow/build').builder({
  dist: '.',
  cleanGlobs: ['./*.js', './*.d.ts', '!./gulpfile.js', '!**/json.d.ts'],
  ignores: process.env.NODE_ENV === 'production' ? ['**/demo', '**/test'] : [],
});

gulp.task('lint', builder.lint);
gulp.task('default', gulp.series(...[builder.clean, builder.lint, builder.ts]));
