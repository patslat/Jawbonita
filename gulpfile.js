var gulp = require('gulp')
  , concat = require('gulp-concat')
;

gulp.task('sleep-summary-js', function() {
  gulp.src([
    './public/bower_components/d3/d3.js',
    './public/bower_components/jquery/dist/jquery.js',
    './public/bower_components/underscore/underscore.js',
    './public/sleeps/js/*'
  ]).pipe(
    concat('index.js')
  ).pipe(
    gulp.dest('./src/sleeps/js')
  )
});

gulp.task('sleep-summary-css', function() {
  gulp.src([
    './public/sleeps/css/*'
  ]).pipe(
    concat('index.css')
  ).pipe(
    gulp.dest('./src/sleeps/css')
  )
});

gulp.task('watch', function() {
  var watchFiles = [
    './public/bower_components/d3/d3.js',
    './public/bower_components/jquery/dist/jquery.js',
    './public/sleeps/js/*',
    './public/sleeps/css/*'
  ]

  gulp.watch(watchFiles, ['sleep-summary-js', 'sleep-summary-css']);
});
