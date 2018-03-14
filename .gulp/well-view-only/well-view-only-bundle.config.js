exports.scripts = {
	vendor: [
		'./node_modules/angular/angular.min.js',
		'./node_modules/angular-ui-bootstrap/dist/ui-bootstrap.js',
		'./node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js',
		'./node_modules/angular-animate/angular-animate.min.js',
		'./node_modules/ngstorage/ngStorage.min.js'
	],
	base: [
		'./node_modules/angular-toastr/dist/angular-toastr.tpls.js',
		'./src/xpd-resources/ng/xpd.dialog/xpd.dialog.module.js',
		'./src/xpd-resources/ng/xpd.dialog/xpd.dialog.factory.js',
		'./src/xpd-resources/ng/xpd.access/accessfactory.module.js',
		'./src/xpd-resources/ng/xpd.access/accessfactory.directive.js',
		'./src/xpd-resources/ng/xpd.access/security-interceptor.factory.js',
		'./src/xpd-resources/ng/xpd.access/accessfactory.factory.js',
		'./src/xpd-resources/ng/xpd.setupapi/setupapi.module.js',
		'./src/xpd-resources/ng/xpd.setupapi/setupapi.service.js',
		'./src/xpd-resources/ng/xpd.setupapi/operation-setupapi.service.js',
		'./src/xpd-resources/ng/xpd.setupapi/well-setupapi.service.js',
		'./src/xpd-resources/ng/xpd.setupapi/schedule-setupapi.service.js',
		'./src/xpd-resources/ng/xpd.setupapi/alarm-setupapi.service.js',
		'./src/xpd-resources/ng/xpd.filters/xpd-filter.module.js',
		'./src/xpd-resources/ng/xpd.filters/percentage.filter.js',
		'./src/admin/app/components/well-view-only/well-view-only.module.js',
		'./src/admin/app/components/well-view-only/well-view-only.controller.js'
	]
};

exports.styles = {
	vendor: [
		'./node_modules/bootstrap/dist/css/bootstrap.min.css',
		'./node_modules/angular-toastr/dist/angular-toastr.css'
	],
	base: [
		'./src/xpd-resources/css/xpd.css'
	]
};