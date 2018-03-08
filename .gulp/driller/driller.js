var concat = require('gulp-concat');
var htmlreplace = require('gulp-html-replace');
var babel = require('gulp-babel');

var path = require('path');
var XPD_HOME = path.join('/', '.xpd');

var drillerBundle = require('./driller-bundle.config');

/**************************************************/
/**************************************************/
/**************************************************/

module.exports = function (gulp) {

	gulp.task('copy-driller-assets', function () {
		return gulp.src([
			'./src/assets/**/*'
		])
			.pipe(gulp.dest('./dist/driller/assets'));
	});

	gulp.task('copy-driller-pages', function () {
		return gulp.src([
			'./src/driller/**/*',
			'!./src/driller/**/*.js',
			'!./src/driller/*.html'
		])
			.pipe(gulp.dest('./dist/driller/pages'));
	});


	gulp.task('copy-driller', function () {
		return gulp.src([
			'./src/**/*',
			'!./src/index.html',
			'!./src/**/*.js',
			'!./src/admin',
			'!./src/admin/**/*',
			// '!./src/bower_components',
			// '!./src/bower_components/**/*',
			'!./src/driller/driller.html'
		])
			.pipe(gulp.dest('./dist/driller/'));
	});


	gulp.task('driller-replace-html', function () {
		return gulp.src('src/driller/driller.html')
			.pipe(htmlreplace({
				basecss: '../xpd-resources/css/base.css',
				basejs: '../xpd-resources/js/base.js',
				vendorcss: 'css/vendor.css',
				vendorjs: 'js/vendor.js',
				accessdata: XPD_HOME + '/accessdata.js'
			}))
			.pipe(gulp.dest('./dist/driller/pages/'));
	});

	gulp.task('driller-vendor-js', function () {
		return gulp.src(drillerBundle.scripts.vendor)
			.pipe(concat('vendor.js'))
			.pipe(gulp.dest('./dist/driller/pages/js/'));
	});

	gulp.task('driller-vendor-fonts', function () {
		return gulp.src('./node_modules/bootstrap/fonts/**/*')
			.pipe(gulp.dest('./dist/driller/pages/fonts/'));
	});

	gulp.task('driller-base-js', function () {
		return gulp.src(drillerBundle.scripts.base)
			.pipe(babel({
				presets: ['es2015']
			}))
			.pipe(concat('base.js'))
			.pipe(gulp.dest('./dist/driller/xpd-resources/js/'));
	});

	gulp.task('driller-vendor-css', function () {
		return gulp.src(drillerBundle.styles.vendor)
			.pipe(concat('vendor.css'))
			.pipe(gulp.dest('./dist/driller/pages/css/'));
	});

	gulp.task('driller-base-css', function () {
		return gulp.src(drillerBundle.styles.base)
			.pipe(concat('base.css'))
			.pipe(gulp.dest('./dist/driller/xpd-resources/css/'));
	});

	return [
		'copy-driller-assets',
		'copy-driller-pages',
		'copy-driller',
		'driller-replace-html',
		'driller-vendor-js',
		'driller-vendor-fonts',
		'driller-base-js',
		'driller-vendor-css',
		'driller-base-css'];

};