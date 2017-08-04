var gulp = require('gulp');
var connect = require('gulp-connect');
var jasmine = require('gulp-jasmine-node');
var bundle = require('gulp-bundle-assets');
var rimraf = require('gulp-rimraf');

var templates = ['app/index.html', 'app/templates/*.html'];
var styles = ['app/css/*.css'];
var scripts = [
    'app/js/*.js', 
    'app/js/controllers/*.js',
    'app/js/directives/*.js', 
    'app/js/services/*.js',
    'app/js/services/fitch/*.js',
    'app/js/services/fitch/rules/*.js',
    'app/js/services/premise/*.js',
    'app/js/services/tables/*.js'
];
var allFiles = templates.concat(styles).concat(scripts);

gulp.task('serve', function () {
  connect.server({
    port: 8001,
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

gulp.task('bundle', ['clean', 'copy-fonts', 'copy-templates'], function() {
  return gulp.src('./bundle.config.js')
    .pipe(bundle())
    .pipe(bundle.results('./'))
    .pipe(gulp.dest('./public/dist'));
});


gulp.task('clean', function () {
  return gulp.src(['./public/dist', './public/fonts', './public/templates'], { read: false })
    .pipe(rimraf());
});

gulp.task('copy-fonts', function() {
  return gulp.src([
    './bower_components/bootstrap/fonts/*'
  ])
  .pipe(gulp.dest('./public/fonts'))
});

gulp.task('copy-templates', function() {
  return gulp.src([
    './app/templates/*.html'
  ])
  .pipe(gulp.dest('./public/templates'))
});

gulp.task('default', ['serve', 'livereload', 'watch']);
