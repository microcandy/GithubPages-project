/**
 * 
 */


var gulp = require('gulp');
var uglify = require('gulp-uglify');
var order = require("gulp-order");
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var clean = require('gulp-clean');
var minifyCss = require('gulp-minify-css');
var runSequence = require('gulp-run-sequence');
var path = require('path');
var gutil = require('gulp-util');
var gulpNgConfig = require('gulp-ng-config');

var jsFilePath = [
  'themes/future/static/js/jquery.min.js',
  'themes/future/static/js/skel.min.js',
  'themes/future/static/js/util.js',
  'themes/future/static/js/main.js',
  'themes/future/static/js/backToTop.js',
  'themes/future/static/js/hightlight.pack.js'
];

var cssFile = [
  'themes/future/static/css/google-font.css',
  'themes/future/static/css/font-awesome.min.css',
  'themes/future/static/css/monokai-sublime.css',
  'themes/future/static/css/main.css',
  'themes/future/static/css/add-on.css'
]
//
gulp.task('clean', function () {
  return gulp.src([
    'themes/future/static/js/script.bundle.js',
    'themes/future/static/css/style.bundle.css',
    ]).pipe(clean());
});

//合并Js
gulp.task('js', function () {
  return gulp.src(jsFilePath)
    .pipe(order(jsFilePath, { base: './' }))
    .pipe(uglify())
    .pipe(concat('script.bundle.js'))
    .pipe(gulp.dest('themes/future/static/js'));
});

gulp.task('css', function () {
  return gulp.src(cssFile)
    .pipe(order(cssFile, { base: './' }))
    .pipe(concat('style.bundle.css'))
    .pipe(minifyCss())
    .pipe(gulp.dest('themes/future/static/css'));
});

//
gulp.task('build', function (callback) {
  runSequence('clean', 'js', 'css', callback);
});
