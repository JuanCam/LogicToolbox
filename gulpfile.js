var gulp = require('gulp');
var connect = require('gulp-connect');
var jasmine = require('gulp-jasmine-node');

var templates = ['app/index.html', 'app/templates/*.html'];
var styles = ['app/css/*.css'];
var scripts = [
    'app/js/*.js', 
    'app/js/controllers/*.js',
    'app/js/directives/*.js', 
    'app/js/services/*.js',
    'app/js/services/fitch/*.js',
    'app/js/services/fitch/rules/*.js',
    'app/js/services/tables/*.js'
];
var allFiles = templates.concat(styles).concat(scripts);

gulp.task('serve', function () {
  connect.server({
    livereload: true,
    middleware: function (connect) {
      return [
        connect.static('.tmp'),
        connect().use(
          '/bower_components',
          connect.static('./bower_components')
        ),
        connect().use(
          '/app/styles',
          connect.static('./app/styles')
        ),
        connect.static('app')
      ]
    },
    root: 'app'
  })
});

gulp.task('livereload', function () {
  gulp.src(allFiles)
      .pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch(allFiles, ['livereload']);
});

gulp.task('test', function() {
  return gulp.src('app/test/spec/**/*.spec.js').pipe(jasmine({
      color: false,
      includeStackTrace: false,
      timeout: 1000

  }))
});

gulp.task('default', ['serve', 'livereload', 'watch']);
