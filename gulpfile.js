var gulp = require('gulp');
var bower = require('gulp-bower');
var sass = require('gulp-sass');
var flatten = require('gulp-flatten');
var rename = require("gulp-rename");
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var csso = require('gulp-csso');

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

gulp.task('lib_js', ['bower'], function() {
	// JS
	return gulp.src(['./bower_components/*/*.min.js', './bower_components/*/dist/*.js', '!**/*-src.js'])
		.pipe(flatten())
		.pipe(gulp.dest('./lib/js/'));
});

gulp.task('lib', ['lib_css', 'lib_js']);

gulp.task('sass', ['lib'], function() {
	// main.css
	return gulp.src('./scss/*.scss')
		.pipe(sass({ includePaths: ['./lib/scss'], errLogToConsole: true }))
		.pipe(csso())
		.pipe(gulp.dest('./dist/css/'));
});

gulp.task('js', ['lib'], function() {
	return gulp.src('./lib/js/*.js')
		.pipe(concat('all.js'))
		.pipe(uglify())
		.pipe(gulp.dest('./dist/js'))
});

gulp.task('html', function() {
	return gulp.src('./html/*.html')
		.pipe(gulp.dest('./dist/html'));
});

gulp.task('build', ['sass', 'js', 'html']);
