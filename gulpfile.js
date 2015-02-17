var gulp = require('gulp');
var bower = require('gulp-bower');
var sass = require('gulp-sass');
var flatten = require('gulp-flatten');
var rename = require("gulp-rename");

gulp.task('bower', function() {
	return bower()
});

gulp.task('lib', ['bower'], function() {
	// CSS -> SCSS
	gulp.src('./bower_components/*/dist/*.css')
		.pipe(flatten())
		.pipe(rename(function (path) {
			path.basename = '_' + path.basename;
			path.extname = path.extname.replace('css', 'scss');
		}))
		.pipe(gulp.dest('./lib/scss/'));

	// JS
	gulp.src(['./bower_components/*/dist/*.js', '!**/*-src.js'])
		.pipe(flatten())
		.pipe(gulp.dest('./lib/js/'));
});

gulp.task('sass', function () {
	// main.css
	gulp.src('./scss/*.scss')
		.pipe(sass({ includePaths: ['./lib/scss'], errLogToConsole: true }))
		.pipe(gulp.dest('./css/'));
});
