exports.scripts = {
	vendor: [
		'./node_modules/socket.io-client/dist/socket.io.js',
		'./node_modules/angular/angular.min.js',
		'./node_modules/angular-animate/angular-animate.min.js',
		'./node_modules/angular-ui-bootstrap/dist/ui-bootstrap.js',
		'./node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js',
		'./node_modules/angular-aside/dist/js/angular-aside.min.js',
		'./node_modules/angular-toastr/dist/angular-toastr.tpls.js',
		'./node_modules/angular-spinner/dist/angular-spinner.min.js',
		'./node_modules/ngstorage/ngStorage.min.js'
	],
	base: ['./src/xpd-resources/ng/socket.io/socketio.module.js',
		'./src/xpd-resources/ng/socket.io/socket.factory.js',
		'./src/xpd-resources/ng/xpd.access/accessfactory.module.js',
		'./src/xpd-resources/ng/xpd.access/accessfactory.directive.js',
		'./src/xpd-resources/ng/xpd.access/security-interceptor.factory.js',
		'./src/xpd-resources/ng/xpd.access/accessfactory.factory.js',
		'./src/xpd-resources/ng/xpd.setupapi/setupapi.module.js',
		'./src/xpd-resources/ng/xpd.setupapi/setupapi.service.js',
		'./src/xpd-resources/ng/xpd.setupapi/eventlog-setupapi.service.js',
		'./src/xpd-resources/ng/xpd.setupapi/photo-setupapi.service.js',
		'./src/xpd-resources/ng/xpd.setupapi/photo-setupapi.directive.js',
		'./src/xpd-resources/ng/xpd.dialog/xpd.dialog.module.js',
		'./src/xpd-resources/ng/xpd.dialog/xpd.dialog.factory.js',
		'./src/xpd-resources/ng/xpd.spinner/xpd.spinner.js',
		'./src/xpd-resources/ng/xpd.operationmanager/operationmanager.directive.js',
		'./src/xpd-resources/ng/xpd.time-operation-manager/time-operation-manager.directive.js',
		'./src/xpd-resources/ng/xpd.scoredevent/scoredevent.directive.js',
		'./src/xpd-resources/ng/xpd.communication/communication.module.js',
		'./src/xpd-resources/ng/xpd.communication/operation-communication.factory.js',
		'./src/xpd-resources/ng/xpd.communication/operation-server-data.factory.js',
		'./src/xpd-resources/ng/xpd.calculation/calculation.module.js',
		'./src/xpd-resources/ng/xpd.calculation/calculation.service.js',
		'./src/xpd-resources/ng/d3/d3.module.js',
		'./src/xpd-resources/ng/d3/d3.service.js',
		'./src/xpd-resources/ng/xpd.visualization/xpd-visualization.module.js',
		'./src/xpd-resources/ng/xpd.visualization/xpd-view-box.directive.js',
		'./src/xpd-resources/ng/xpd.visualization/score-gauge.directive.js',
		'./src/xpd-resources/ng/xpd.visualization/conn-ruler.directive.js',
		'./src/xpd-resources/ng/xpd.visualization/trip-ruler.directive.js',
		'./src/xpd-resources/ng/xpd.visualization/speed-gauge.directive.js',
		'./src/xpd-resources/ng/xpd.visualization/in-slips.directive.js',
		'./src/xpd-resources/ng/xpd.visualization/times.directive.js',
		'./src/xpd-resources/ng/xpd.visualization/member-performance.directive.js',
		'./src/xpd-resources/ng/xpd.upcoming-alarms/upcoming-alarms.directive.js',
		'./src/xpd-resources/ng/xpd.filters/xpd-filter.module.js',
		'./src/xpd-resources/ng/xpd.filters/percentage.filter.js',
		'./src/xpd-resources/ng/xpd.tracking/tracking.module.js',
		'./src/xpd-resources/ng/xpd.tracking/tracking.controller.js',
		'./src/xpd-resources/ng/xpd.modal.laydown-confirmation/xpd.modal.laydown-confirmation.directive.js',
		'./src/driller/app/components/driller/driller-tracking.module.js',
		'./src/driller/app/components/driller/driller-tracking.controller.js'
	]
};

exports.styles = {
	vendor: [
		'./node_modules/bootstrap/dist/css/bootstrap.min.css',
		'./node_modules/angular-aside/dist/css/angular-aside.min.css',
		'./node_modules/angular-toastr/dist/angular-toastr.css'],
	base: [
		'./src/xpd-resources/css/xpd.css',
		'./src/xpd-resources/ng/xpd.visualization/xpd-visualization.css',
		'./src/xpd-resources/css/driller.css',
		'./src/xpd-resources/css/pallete.css'
	]
};