var gulp = require('gulp');

var adminTasks = require('./.gulp/admin/admin.js')(gulp);
var drillerTasks = require('./.gulp/driller/driller.js')(gulp);
var dmecTasks = require('./.gulp/dmec/dmec.js')(gulp);
var reportsTasks = require('./.gulp/reports/reports.js')(gulp);
var operationViewOnlyTasks = require('./.gulp/operation-view-only/operation-view-only.js')(gulp);
var wellViewOnlyTasks = require('./.gulp/well-view-only/well-view-only.js')(gulp);

/**************************************************/
/**************************************************/
/**************************************************/

gulp.task('copy-driller-electron', function () {
	return gulp.src([
		'./src/driller/main.js',
		'./src/driller/package.json'])
		.pipe(gulp.dest('./dist/driller/'));
});

gulp.task('copy-admin-electron', function () {
	return gulp.src([
		'./src/admin/main.js',
		'./src/admin/package.json'])
		.pipe(gulp.dest('./dist/admin/'));
});

gulp.task('copy-driller-keys-electron', function () {
	return gulp.src([
		'./keys/XPD-Client*'])
		.pipe(gulp.dest('./dist/driller/keys/'));
});

gulp.task('copy-admin-keys-electron', function () {
	return gulp.src([
		'./keys/XPD-Client*'])
		.pipe(gulp.dest('./dist/admin/keys/'));
});

/**************************************************/
/**************************************************/
/**************************************************/

var steps = [];

while(adminTasks && adminTasks.length > 0){
	steps.push(adminTasks.shift());
}

while(drillerTasks && drillerTasks.length > 0){
	steps.push(drillerTasks.shift());
}

while(dmecTasks && dmecTasks.length > 0){
	steps.push(dmecTasks.shift());
}

while(reportsTasks && reportsTasks.length > 0){
	steps.push(reportsTasks.shift());
}

while(wellViewOnlyTasks && wellViewOnlyTasks.length > 0){
	steps.push(wellViewOnlyTasks.shift());
}

while(operationViewOnlyTasks && operationViewOnlyTasks.length > 0){
	steps.push(operationViewOnlyTasks.shift());
}

steps.push('copy-driller-electron');
steps.push('copy-admin-electron');
steps.push('copy-driller-keys-electron');
steps.push('copy-admin-keys-electron');

gulp.task('default', steps);