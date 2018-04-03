var concat = require('gulp-concat');
var htmlreplace = require('gulp-html-replace');
var babel = require('gulp-babel');

var path = require('path');
var XPD_HOME = path.join('/', '.xpd');

var adminBundle = require('./admin-bundle.config');

/**************************************************/
/**************************************************/
/**************************************************/

module.exports = function (gulp) {

	gulp.task('copy-admin-assets', function () {
		return gulp.src([
			'./src/assets/**/*'
		])
			.pipe(gulp.dest('./dist/admin/assets'));
	});

	gulp.task('copy-admin-pages', function () {
		return gulp.src([
			'./src/admin/**/*',
			'!./src/admin/**/*.js',
			'!./src/admin/*.html'
		])
			.pipe(gulp.dest('./dist/admin/pages'));
	});

	gulp.task('copy-admin', function () {
		return gulp.src([
			'./src/**/*',
			'!./src/index.html',
			'!./src/**/*.js',
			'!./src/driller',
			'!./src/driller/**/*',
			'!./src/admin',
			'!./src/admin/**/*',
			// '!./src/bower_components',
			// '!./src/bower_components/**/*',
			'!./src/admin/admin.html'
		])
			.pipe(gulp.dest('./dist/admin/'));
	});


	gulp.task('admin-replace-html', function () {
		return gulp.src('src/admin/admin.html')
			.pipe(htmlreplace({
				basecss: '../xpd-resources/css/base.css',
				basejs: '../xpd-resources/js/base.js',
				vendorcss: 'css/vendor.css',
				vendorjs: 'js/vendor.js'
			}))
			.pipe(gulp.dest('./dist/admin/pages/'));
	});

	gulp.task('admin-vendor-js', function () {
		return gulp.src(adminBundle.scripts.vendor)
			.pipe(concat('vendor.js'))
			.pipe(gulp.dest('./dist/admin/pages/js/'));
	});

	gulp.task('admin-vendor-fonts', function () {
		return gulp.src([
			'./node_modules/bootstrap/fonts/**/*',
			'./node_modules/font-awesome/fonts/*'
		])
		.pipe(gulp.dest('./dist/admin/pages/fonts/'));
	});

	gulp.task('admin-base-js', function () {
		return gulp.src(adminBundle.scripts.base)
			.pipe(babel({ presets: ['es2015'] }))
			.pipe(concat('base.js'))
			.pipe(gulp.dest('./dist/admin/xpd-resources/js/'));
	});

	gulp.task('admin-vendor-css', function () {
		return gulp.src(adminBundle.styles.vendor)
			.pipe(concat('vendor.css'))
			.pipe(gulp.dest('./dist/admin/pages/css/'));
	});

	gulp.task('admin-base-css', function () {
		return gulp.src(adminBundle.styles.base)
			.pipe(concat('base.css'))
			.pipe(gulp.dest('./dist/admin/xpd-resources/css/'));
	});

	gulp.task('angular-tree-view-css', function () {
		return gulp.src('./src/xpd-resources/ng/angular.treeview/img/*')
			.pipe(gulp.dest('./dist/admin/xpd-resources/img'));
	});


	return ['copy-admin-assets',
		'copy-admin-pages',
		'copy-admin',
		'admin-replace-html',
		'admin-vendor-js',
		'admin-vendor-fonts',
		'admin-base-js',
		'admin-vendor-css',
		'admin-base-css',
		'angular-tree-view-css'
	];

};