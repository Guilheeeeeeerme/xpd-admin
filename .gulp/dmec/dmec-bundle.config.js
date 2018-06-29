exports.scripts = {
	vendor: [
		'./node_modules/angular/angular.min.js',
		'./node_modules/angular-ui-bootstrap/dist/ui-bootstrap.js',
		'./node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js',
		'./node_modules/socket.io-client/dist/socket.io.js',
		'./node_modules/angular-spinner/dist/angular-spinner.min.js',
		'./node_modules/angular-animate/angular-animate.min.js'
	],
	base: [
		'./node_modules/angular-toastr/dist/angular-toastr.tpls.js',
		'./src/xpd-resources/ng/socket.io/socketio.module.js',
		'./src/xpd-resources/ng/xpd.spinner/xpd.spinner.js',
		'./src/xpd-resources/ng/xpd.timers/xpd.timers.js',
		'./src/xpd-resources/ng/socket.io/socket.factory.js',
		'./src/xpd-resources/ng/xpd.access/accessfactory.module.js',
		'./src/xpd-resources/ng/xpd.access/accessfactory.directive.js',
		'./src/xpd-resources/ng/xpd.access/security-interceptor.factory.js',
		'./src/xpd-resources/ng/xpd.access/accessfactory.factory.js',
		'./src/xpd-resources/ng/d3/d3.module.js',
		'./src/xpd-resources/ng/d3/d3.service.js',
		'./src/xpd-resources/ng/xpd.filters/xpd-filter.module.js',
		'./src/xpd-resources/ng/highcharts/highcharts.module.js',
		'./src/xpd-resources/ng/highcharts/highcharts.service.js',
		'./src/xpd-resources/ng/xpd.visualization/xpd-visualization.module.js',
		"./src/xpd-resources/ng/xpd.visualization/d3-dmec-chart.directive.js",
		"./src/xpd-resources/ng/xpd.visualization/time-zoom-tool.directive.js",
		"./src/xpd-resources/ng/xpd.visualization/xpd-view-box.directive.js",
		'./src/xpd-resources/ng/xpd.dialog/xpd.dialog.module.js',
		'./src/xpd-resources/ng/xpd.dialog/xpd.dialog.factory.js',
		'./src/xpd-resources/ng/xpd.communication/communication.module.js',
		'./src/xpd-resources/ng/xpd.communication/operation-server-data.factory.js',
		'./src/xpd-resources/ng/xpd.calculation/calculation.module.js',
		'./src/xpd-resources/ng/xpd.calculation/calculation.service.js',
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
		"./src/xpd-resources/ng/xpd.dmec/dmec.service.js",
		'./src/admin/app/components/dmec-log/dmec-log.module.js',
		'./src/admin/app/components/dmec-log/dmec-log.controller.js',
	]
};

exports.styles = {
	vendor: [
		'./node_modules/bootstrap/dist/css/bootstrap.min.css',
		'./node_modules/bootstrap/dist/css/bootstrap-theme.min.css',
		'./node_modules/angular-toastr/dist/angular-toastr.css'
	],
	base: [
		'./src/xpd-resources/css/dmec-log.css'
	]
};