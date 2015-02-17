var gulp = require('gulp');
var bower = require('gulp-bower');
var sass = require('gulp-sass');

gulp.task('bower', function() {
	return bower()
		.pipe(gulp.dest('lib/'))
});

gulp.task('sass', function () {
	// main.css
	gulp.src('./scss/*.scss')
		.pipe(sass())
		.pipe(gulp.dest('./css/'));
});
