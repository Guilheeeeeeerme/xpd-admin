var concat = require('gulp-concat');
var htmlreplace = require('gulp-html-replace');
var babel = require('gulp-babel');

var path = require('path');
var XPD_HOME = path.join('/', '.xpd');

var operationViewOnlyBundle = require('./operation-view-only-bundle.config');

/**************************************************/
/**************************************************/
/**************************************************/

module.exports = function (gulp) {

	gulp.task('operation-view-only-replace-html', function () {
		return gulp.src('src/admin/operation-view-only.html')
			.pipe(htmlreplace({
				basecss: '../xpd-resources/css/base-operation-view-only.css',
				basejs: '../xpd-resources/js/base-operation-view-only.js',
				vendorcss: 'css/vendor-operation-view-only.css',
				vendorjs: 'js/vendor-operation-view-only.js',
				accessdata: XPD_HOME + '/accessdata.js'
			}))
			.pipe(gulp.dest('./dist/admin/pages/'));
	});

	gulp.task('operation-view-only-vendor-js', function () {
		return gulp.src(operationViewOnlyBundle.scripts.vendor)
			.pipe(concat('vendor-operation-view-only.js'))
			.pipe(gulp.dest('./dist/admin/pages/js/'));
	});

	gulp.task('operation-view-only-base-js', function () {
		return gulp.src(operationViewOnlyBundle.scripts.base)
			.pipe(babel({ presets: ['es2015'] }))
			.pipe(concat('base-operation-view-only.js'))
			.pipe(gulp.dest('./dist/admin/xpd-resources/js/'));
	});

	gulp.task('operation-view-only-vendor-css', function () {
		return gulp.src(operationViewOnlyBundle.styles.vendor)
			.pipe(concat('vendor-operation-view-only.css'))
			.pipe(gulp.dest('./dist/admin/pages/css/'));
	});

	gulp.task('operation-view-only-base-css', function () {
		return gulp.src(operationViewOnlyBundle.styles.base)
			.pipe(concat('base-operation-view-only.css'))
			.pipe(gulp.dest('./dist/admin/xpd-resources/css/'));
	});

	return ['operation-view-only-replace-html',
		'operation-view-only-vendor-js',
		'operation-view-only-base-js',
		'operation-view-only-vendor-css',
		'operation-view-only-base-css'];
};