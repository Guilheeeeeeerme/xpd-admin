var concat = require('gulp-concat');
var htmlreplace = require('gulp-html-replace');
var babel = require('gulp-babel');

var path = require('path');
var XPD_HOME = path.join('/', '.xpd');

var reportsBundle = require('./reports-bundle.config');

/**************************************************/
/**************************************************/
/**************************************************/

module.exports = function (gulp) {

	gulp.task('reports-replace-html', function () {
		return gulp.src('src/admin/reports.html')
			.pipe(htmlreplace({
				basecss: '../xpd-resources/css/base-reports.css',
				basejs: '../xpd-resources/js/base-reports.js',
				vendorcss: 'css/vendor-reports.css',
				vendorjs: 'js/vendor-reports.js',
				accessdata: XPD_HOME + '/accessdata.js'
			}))
			.pipe(gulp.dest('./dist/admin/pages/'));
	});

	gulp.task('reports-vendor-js', function () {
		return gulp.src(reportsBundle.scripts.vendor)
			.pipe(concat('vendor-reports.js'))
			.pipe(gulp.dest('./dist/admin/pages/js/'));
	});

	gulp.task('reports-base-js', function () {
		return gulp.src(reportsBundle.scripts.base)
			.pipe(babel({
				presets: ['es2015']
			}))
			.pipe(concat('base-reports.js'))
			.pipe(gulp.dest('./dist/admin/xpd-resources/js/'));
	});

	gulp.task('reports-vendor-css', function () {
		return gulp.src(reportsBundle.styles.vendor)
			.pipe(concat('vendor-reports.css'))
			.pipe(gulp.dest('./dist/admin/pages/css/'));
	});

	gulp.task('reports-base-css', function () {
		return gulp.src(reportsBundle.styles.base)
			.pipe(concat('base-reports.css'))
			.pipe(gulp.dest('./dist/admin/xpd-resources/css/'));
	});

	return ['reports-replace-html',
		'reports-vendor-js',
		'reports-base-js',
		'reports-vendor-css',
		'reports-base-css'];

};