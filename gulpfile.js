var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var minifyCSS = require('gulp-minify-css');
var rename = require("gulp-rename");

var files = {
	css: {
		vendor: [
			'bower_components/bootstrap/dist/css/bootstrap.min.css',
			'bower_components/font-awesome/css/font-awesome.min.css',
			'node_modules/@appbaseio/reactivemaps/dist/css/style.min.css',
			'node_modules/codemirror/lib/codemirror.css',
			'node_modules/codemirror/addon/fold/foldgutter.css',
			'node_modules/codemirror/addon/dialog/dialog.css',
			'node_modules/toastr/build/toastr.min.css',
			'node_modules/appbase-onboarding/dist/css/vendor.min.css',
			'node_modules/appbase-onboarding/dist/css/style.min.css',
			'assets/vendor/hljs.css'
		],
		custom: ['assets/css/*.css'],
		sassFile: ['assets/styles/*.scss'],
		sassPartials: ['assets/styles/partials/**/*.scss']
	},
	js: {
		vendor: [
			'bower_components/jquery/dist/jquery.min.js',
			'bower_components/bootstrap/dist/js/bootstrap.min.js',
			'bower_components/lodash/dist/lodash.min.js',
			'bower_components/lzma/src/lzma.js',
			'bower_components/urlsafe-base64/app.js',
			'bower_components/appbase-js/browser/appbase.min.js',
			'node_modules/clipboard/dist/clipboard.min.js',
			'node_modules/toastr/build/toastr.min.js'
		],
		custom: [
		]
	}
};

gulp.task('vendorcss', function() {
	return gulp.src(files.css.vendor)
		.pipe(concat('vendor.min.css'))
		.pipe(gulp.dest('dist/css'));
});

gulp.task('customcss', ['sass'], function() {
	return gulp.src(files.css.custom)
		.pipe(minifyCSS())
		.pipe(concat('style.min.css'))
		.pipe(gulp.dest('dist/css'));
});

gulp.task('vendorjs', function() {
	return gulp.src(files.js.vendor)
		.pipe(uglify())
		.pipe(concat('vendor.min.js'))
		.pipe(gulp.dest('dist/js'));
});

gulp.task('sass', function() {
	return gulp.src(files.css.sassFile)
		.pipe(sass.sync().on('error', sass.logError))
		.pipe(gulp.dest('assets/css'));
});

gulp.task('moveCss', function() {
	return gulp.src([
			'bower_components/bootstrap/dist/css/bootstrap.min.css.map',
			'assets/vendor/fonts.css'
		])
		.pipe(gulp.dest('dist/css'));
});

gulp.task('moveFonts', function() {
	return gulp.src(['bower_components/bootstrap/dist/fonts/*', 
		'bower_components/font-awesome/fonts/*',
		'node_modules/@appbaseio/reactivemaps/dist/fonts/**/*',
		'assets/styles/fonts/**/*'
		])
		.pipe(gulp.dest('dist/fonts'));
});

// Include dependency in dist
gulp.task('move_js_depends', function() {
	return gulp.src(['bower_components/lzma/src/lzma_worker.js',
		'assets/vendor/JSONURL.js'])
		.pipe(gulp.dest('dist/vendor'));
});

gulp.task('compact', [
	'customcss', 
	'vendorcss', 
	'vendorjs', 
	'moveCss', 
	'moveFonts',
	'move_js_depends'
]);

gulp.task('watchfiles', function() {
	gulp.watch(files.css.sassFile, ['customcss']);
});

gulp.task('watchSassPartials', function() {
	gulp.watch(files.css.sassPartials, ['customcss']);
});

gulp.task('default', ['compact']);

gulp.task('watch', ['compact', 'watchfiles', 'watchSassPartials']);
