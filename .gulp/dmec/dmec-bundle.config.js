exports.scripts = {
	vendor: [
		'./node_modules/angular/angular.min.js',
		'./node_modules/angular-ui-bootstrap/dist/ui-bootstrap.js',
		'./node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js',
		'./node_modules/socket.io-client/dist/socket.io.js',
		'./node_modules/ngstorage/ngStorage.min.js',
		'./node_modules/angular-animate/angular-animate.min.js'
	],
	base: [
		'./node_modules/angular-toastr/dist/angular-toastr.tpls.js',
		'./src/xpd-resources/ng/socket.io/socketio.module.js',
		'./src/xpd-resources/ng/socket.io/socket.factory.js',
		'./src/xpd-resources/ng/xpd.access/accessfactory.module.js',
		'./src/xpd-resources/ng/xpd.access/accessfactory.directive.js',
		'./src/xpd-resources/ng/xpd.access/security-interceptor.factory.js',
		'./src/xpd-resources/ng/xpd.access/accessfactory.factory.js',
		'./src/xpd-resources/ng/d3/d3.module.js',
		'./src/xpd-resources/ng/d3/d3.service.js',
		'./src/xpd-resources/ng/xpd.filters/xpd-filter.module.js',
		'./src/xpd-resources/ng/xpd.filters/percentage.filter.js',
		'./src/xpd-resources/ng/highcharts/highcharts.module.js',
		'./src/xpd-resources/ng/highcharts/highcharts.service.js',
		'./src/xpd-resources/ng/xpd.visualization/xpd-visualization.module.js',
		'./src/xpd-resources/ng/xpd.visualization/d3-dmec-chart-worker-service.js',
		'./src/xpd-resources/ng/xpd.visualization/d3-dmec-chart.directive.js',
		'./src/xpd-resources/ng/xpd.dialog/xpd.dialog.module.js',
		'./src/xpd-resources/ng/xpd.dialog/xpd.dialog.factory.js',
		'./src/xpd-resources/ng/xpd.communication/communication.module.js',
		'./src/xpd-resources/ng/xpd.communication/operation-communication.factory.js',
		'./src/xpd-resources/ng/xpd.communication/operation-server-data.factory.js',
		'./src/xpd-resources/ng/xpd.calculation/calculation.module.js',
		'./src/xpd-resources/ng/xpd.calculation/calculation.service.js',
		'./src/xpd-resources/ng/xpd.setupapi/setupapi.module.js',
		'./src/xpd-resources/ng/xpd.setupapi/setupapi.service.js',
		'./src/xpd-resources/ng/xpd.setupapi/reading-setupapi.service.js',
		'./src/admin/app/components/dmec-log/dmec-log.module.js',
		'./src/admin/app/components/dmec-log/change-scale.controller.js',
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