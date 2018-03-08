var concat = require('gulp-concat');
var htmlreplace = require('gulp-html-replace');
var babel = require('gulp-babel');

var path = require('path');
var XPD_HOME = path.join('/', '.xpd');

var wellViewOnlyBundle = require('./well-view-only-bundle.config');

/**************************************************/
/**************************************************/
/**************************************************/

module.exports = function (gulp) {

	gulp.task('well-view-only-replace-html', function () {
		return gulp.src('src/admin/well-view-only.html')
			.pipe(
            	htmlreplace({
					basecss: '../xpd-resources/css/base-well-view-only.css',
					basejs: '../xpd-resources/js/base-well-view-only.js',
					vendorcss: 'css/vendor-well-view-only.css',
					vendorjs: 'js/vendor-well-view-only.js',
					accessdata: XPD_HOME + '/accessdata.js'
				}
				))
			.pipe(gulp.dest('./dist/admin/pages/'));
	});

	gulp.task('well-view-only-vendor-js', function () {
		return gulp.src(wellViewOnlyBundle.scripts.vendor)
			.pipe(concat('vendor-well-view-only.js'))
			.pipe(gulp.dest('./dist/admin/pages/js/'));
	});

	gulp.task('well-view-only-base-js', function () {
		return gulp.src(wellViewOnlyBundle.scripts.base)
			.pipe(babel({ presets: ['es2015'] }))
			.pipe(concat('base-well-view-only.js'))
			.pipe(gulp.dest('./dist/admin/xpd-resources/js/'));
	});

	gulp.task('well-view-only-vendor-css', function () {
		return gulp.src(wellViewOnlyBundle.styles.vendor)
			.pipe(concat('vendor-well-view-only.css'))
			.pipe(gulp.dest('./dist/admin/pages/css/'));
	});

	gulp.task('well-view-only-base-css', function () {
		return gulp.src(wellViewOnlyBundle.styles.base)
			.pipe(concat('base-well-view-only.css'))
			.pipe(gulp.dest('./dist/admin/xpd-resources/css/'));
	});

	return ['well-view-only-replace-html',
		'well-view-only-vendor-js',
		'well-view-only-base-js',
		'well-view-only-vendor-css',
		'well-view-only-base-css'];
};