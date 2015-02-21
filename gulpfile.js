'use strict';

var gulp = require('gulp');
var bower = require('gulp-bower');
var sass = require('gulp-sass');
var flatten = require('gulp-flatten');
var rename = require("gulp-rename");
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var csso = require('gulp-csso');
var rev = require('gulp-rev');
var globhtml = require('gulp-glob-html');
var clean = require('gulp-clean');
var runSequence = require('run-sequence');
var preprocess = require('gulp-preprocess');

gulp.task('bower', function() {
	return bower()
});

gulp.task('lib_css', ['bower'], function() {
	// CSS -> SCSS
	return gulp.src('./bower_components/*/dist/*.css')
		.pipe(flatten())
		.pipe(rename(function (path) {
			path.basename = '_' + path.basename;
			path.extname = path.extname.replace('css', 'scss');
		}))
		.pipe(gulp.dest('./lib/scss/'));
});

gulp.task('lib', ['lib_css']);

gulp.task('sass', ['lib'], function() {
	// main.css
	return gulp.src('./scss/*.scss')
		.pipe(sass({ includePaths: ['./lib/scss'], errLogToConsole: true }))
		.pipe(csso())
		.pipe(rev())
		.pipe(gulp.dest('./dist/css/'));
});

gulp.task('js', ['lib'], function() {
	return gulp.src('./js/*.js')
		.pipe(preprocess())
		.pipe(uglify())
		.pipe(rev())
		.pipe(gulp.dest('./dist/js'))
});

gulp.task('images', ['bower'], function() {
	return gulp.src('./bower_components/**/images/*')
		.pipe(flatten())
		.pipe(gulp.dest('./dist/images/'));
});

gulp.task('icons', ['bower'], function() {
	return gulp.src('./bower_components/**/icons/*')
		.pipe(flatten())
		.pipe(gulp.dest('./dist/icons/'));
});

gulp.task('html', ['sass', 'js', 'images', 'icons'], function() {
	return gulp.src('./html/*.html')
		.pipe(globhtml({ basePath: "../dist/" }))
		.pipe(gulp.dest('./dist/'));
});

gulp.task('clean_dist', function () {
	return gulp.src('./dist', {read: false})
		.pipe(clean());
});

gulp.task('clean_lib', function () {
	return gulp.src('./lib', {read: false})
		.pipe(clean());
});

gulp.task('clean', ['clean_lib', 'clean_dist']);

gulp.task('build', function(callback) {
	runSequence('clean','html', callback);
});
