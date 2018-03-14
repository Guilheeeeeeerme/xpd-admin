var concat = require('gulp-concat');
var htmlreplace = require('gulp-html-replace');
var babel = require('gulp-babel');

var path = require('path');
var XPD_HOME = path.join('/', '.xpd');

var dmeclogBundle = require('./dmec-bundle.config');

/**************************************************/
/**************************************************/
/**************************************************/

module.exports = function (gulp) {

	gulp.task('dmeclog-replace-html', function () {
		return gulp.src('src/admin/dmeclog.html')
			.pipe(htmlreplace({
				basecss: '../xpd-resources/css/base-dmeclog.css',
				basejs: '../xpd-resources/js/base-dmeclog.js',
				vendorcss: 'css/vendor-dmeclog.css',
				vendorjs: 'js/vendor-dmeclog.js'
			}))
			.pipe(gulp.dest('./dist/admin/pages/'));
	});

	gulp.task('dmeclog-vendor-js', function () {
		return gulp.src(dmeclogBundle.scripts.vendor)
			.pipe(concat('vendor-dmeclog.js'))
			.pipe(gulp.dest('./dist/admin/pages/js/'));
	});

	gulp.task('dmeclog-base-js', function () {
		return gulp.src(dmeclogBundle.scripts.base)
			.pipe(babel({ presets: ['es2015'] }))
			.pipe(concat('base-dmeclog.js'))
			.pipe(gulp.dest('./dist/admin/xpd-resources/js/'));
	});

	gulp.task('dmeclog-vendor-css', function () {
		return gulp.src(dmeclogBundle.styles.vendor)
			.pipe(concat('vendor-dmeclog.css'))
			.pipe(gulp.dest('./dist/admin/pages/css/'));
	});

	gulp.task('dmeclog-base-css', function () {
		return gulp.src(dmeclogBundle.styles.base)
			.pipe(concat('base-dmeclog.css'))
			.pipe(gulp.dest('./dist/admin/xpd-resources/css/'));
	});

	return ['dmeclog-replace-html',
		'dmeclog-vendor-js',
		'dmeclog-base-js',
		'dmeclog-vendor-css',
		'dmeclog-base-css'];
};