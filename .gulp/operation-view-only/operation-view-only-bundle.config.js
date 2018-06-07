exports.scripts = {
	vendor: [
		'./node_modules/angular/angular.min.js',
		'./node_modules/angular-ui-bootstrap/dist/ui-bootstrap.js',
		'./node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js',
		'./node_modules/angular-spinner/dist/angular-spinner.min.js',
		'./node_modules/angular-animate/angular-animate.min.js'
	],
	base: [
		'./node_modules/angular-toastr/dist/angular-toastr.tpls.js',
		'./src/xpd-resources/ng/xpd.dialog/xpd.dialog.module.js',
		'./src/xpd-resources/ng/xpd.spinner/xpd.spinner.js',
		'./src/xpd-resources/ng/xpd.dialog/xpd.dialog.factory.js',
		'./src/xpd-resources/ng/xpd.access/accessfactory.module.js',
		'./src/xpd-resources/ng/xpd.access/accessfactory.directive.js',
		'./src/xpd-resources/ng/xpd.access/security-interceptor.factory.js',
		'./src/xpd-resources/ng/xpd.access/accessfactory.factory.js',
		"./src/xpd-resources/ng/xpd.setupapi/setupapi.module.js",
		"./src/xpd-resources/ng/xpd.setupapi/admin-user-setupapi.service.js",
		"./src/xpd-resources/ng/xpd.setupapi/setupapi.service.js",
		"./src/xpd-resources/ng/xpd.setupapi/photo-setupapi.service.js",
		"./src/xpd-resources/ng/xpd.setupapi/alarm-setupapi.service.js",
		"./src/xpd-resources/ng/xpd.setupapi/reading-setupapi.service.js",
		"./src/xpd-resources/ng/xpd.setupapi/category-setupapi.service.js",
		"./src/xpd-resources/ng/xpd.setupapi/reports-setupapi.service.js",
		"./src/xpd-resources/ng/xpd.setupapi/eventlog-setupapi.service.js",
		"./src/xpd-resources/ng/xpd.setupapi/schedule-setupapi.service.js",
		"./src/xpd-resources/ng/xpd.setupapi/failure-setupapi.service.js",
		"./src/xpd-resources/ng/xpd.setupapi/section-setupapi.service.js",
		"./src/xpd-resources/ng/xpd.setupapi/lessonlearned-setupapi.service.js",
		"./src/xpd-resources/ng/xpd.setupapi/master-user-setupapi.service.js",
		"./src/xpd-resources/ng/xpd.setupapi/operation-setupapi.service.js",
		"./src/xpd-resources/ng/xpd.setupapi/well-setupapi.service.js",
		"./src/xpd-resources/ng/xpd.setupapi/photo-setupapi.directive.js",
		'./src/xpd-resources/ng/xpd.calculation/calculation.module.js',
		'./src/xpd-resources/ng/xpd.calculation/calculation.service.js',
		'./src/xpd-resources/ng/xpd.setup-form-input/setup-form-input.module.js',
    	'./src/xpd-resources/ng/xpd.setup-form-input/setup-form-input.directive.js',
		'./src/xpd-resources/ng/xpd.contract-param/contract-param.module.js',
		'./src/xpd-resources/ng/xpd.contract-param/operation-contract-info-table.directive.js',
		'./src/xpd-resources/ng/xpd.contract-time-input/contract-time-input.directive.js',
		'./src/admin/app/components/operation-view-only/operation-view-only.module.js',
		'./src/admin/app/components/operation-view-only/operation-view-only.controller.js'
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