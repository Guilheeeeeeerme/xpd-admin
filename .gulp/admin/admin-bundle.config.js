exports.scripts = {
	vendor: [
		'./node_modules/xlsx/dist/xlsx.full.min.js',
		'./node_modules/file-saverjs/FileSaver.min.js',
		'./node_modules/tableexport/dist/js/tableexport.min.js',
		'./node_modules/socket.io-client/dist/socket.io.js',
		'./node_modules/angular/angular.min.js',
		'./node_modules/angular-animate/angular-animate.min.js',
		'./node_modules/angular-route/angular-route.min.js',
		'./node_modules/angular-spinner/dist/angular-spinner.min.js',
		'./node_modules/angular-ui-bootstrap/dist/ui-bootstrap.js',
		'./node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js',
	],
	base: [
		'./node_modules/angular-toastr/dist/angular-toastr.tpls.js',
		'./src/xpd-resources/ng/xpd.intersection/xpd-intersection.js',
		'./src/xpd-resources/ng/socket.io/socketio.module.js',
		'./src/xpd-resources/ng/xpd.spinner/xpd.spinner.js',
		'./src/xpd-resources/ng/xpd.timers/xpd.timers.js',
		'./src/xpd-resources/ng/socket.io/socket.factory.js',
		'./src/xpd-resources/ng/xpd.dialog/xpd.dialog.module.js',
		'./src/xpd-resources/ng/xpd.dialog/xpd.dialog.factory.js',
		'./src/xpd-resources/ng/xpd.planner/planner.module.js',
		'./src/xpd-resources/ng/xpd.planner/trip-planner.directive.js',
		'./src/xpd-resources/ng/xpd.planner/connection-planner.directive.js',
		'./src/xpd-resources/ng/xpd.access/accessfactory.module.js',
		'./src/xpd-resources/ng/xpd.access/accessfactory.directive.js',
		'./src/xpd-resources/ng/xpd.access/security-interceptor.factory.js',
		'./src/xpd-resources/ng/xpd.access/accessfactory.factory.js',
		'./src/xpd-resources/ng/xpd.menu-confirmation/menu-confirmation.module.js',
		'./src/xpd-resources/ng/xpd.menu-confirmation/menu-confirmation.factory.js',
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
		'./src/xpd-resources/ng/xpd.operationmanager/operationmanager.directive.js',
		'./src/xpd-resources/ng/xpd.scoredevent/scoredevent.directive.js',
		'./src/xpd-resources/ng/xpd.setup-form-input/setup-form-input.module.js',
		'./src/xpd-resources/ng/xpd.setup-form-input/setup-form-input.directive.js',
		'./src/xpd-resources/ng/xpd.communication/communication.module.js',
		'./src/xpd-resources/ng/xpd.communication/operation-server-data.factory.js',
		'./src/xpd-resources/ng/xpd.calculation/calculation.module.js',
		'./src/xpd-resources/ng/xpd.calculation/calculation.service.js',
		'./src/xpd-resources/ng/xpd.contract-param/contract-param.module.js',
		'./src/xpd-resources/ng/xpd.contract-param/operation-contract-info-table.directive.js',
		'./src/xpd-resources/ng/gantt/gantt.module.js',
		'./src/xpd-resources/ng/gantt/gantt.service.js',
		'./src/xpd-resources/ng/d3/d3.module.js',
		'./src/xpd-resources/ng/d3/d3.service.js',
		'./src/xpd-resources/ng/highcharts/highcharts.module.js',
		'./src/xpd-resources/ng/highcharts/highcharts.service.js',
		'./src/xpd-resources/ng/xpd.visualization/xpd-visualization.module.js',
		'./src/xpd-resources/ng/xpd.visualization/d3-dmec-chart.directive.js',
		'./src/xpd-resources/ng/xpd.visualization/time-zoom-tool.directive.js',
		'./src/xpd-resources/ng/xpd.visualization/xpd-view-box.directive.js',
		'./src/xpd-resources/ng/xpd.visualization/score-gauge.directive.js',
		'./src/xpd-resources/ng/xpd.visualization/conn-ruler.directive.js',
		'./src/xpd-resources/ng/xpd.visualization/trip-ruler.directive.js',
		'./src/xpd-resources/ng/xpd.visualization/speed-gauge.directive.js',
		'./src/xpd-resources/ng/xpd.visualization/in-slips.directive.js',
		'./src/xpd-resources/ng/xpd.visualization/times.directive.js',
		'./src/xpd-resources/ng/xpd.visualization/dmec-tracking-events.directive.js',
		'./src/xpd-resources/ng/xpd.visualization/dmec-tracking.directive.js',
		'./src/xpd-resources/ng/xpd.visualization/old-tracking.directive.js',
		'./src/xpd-resources/ng/xpd.visualization/block-speed.directive.js',
		'./src/xpd-resources/ng/xpd.visualization/performance-parameter-bar.directive.js',
		'./src/xpd-resources/ng/xpd.visualization/member-performance.directive.js',
		'./src/xpd-resources/ng/xpd.visualization/operation-progress-chart.directive.js',
		'./src/xpd-resources/ng/xpd.visualization/displacement-area.directive.js',
		'./src/xpd-resources/ng/xpd.visualization/forecast-line.directive.js',
		'./src/xpd-resources/ng/xpd.visualization/consistency-information-panel.directive.js',
		'./src/xpd-resources/ng/xpd.visualization/upcoming-alarms-panel.directive.js',
		'./src/xpd-resources/ng/xpd.filters/xpd-filter.module.js',
		'./src/xpd-resources/ng/xpd.form.validation/xpd.form.validation.directive.js',
		'./src/xpd-resources/ng/xpd.zerotimezone/xpd.zerotimezone.directive.js',
		'./src/xpd-resources/ng/xpd.contract-time-input/contract-time-input.directive.js',
		'./src/xpd-resources/ng/xpd.register-alarm-modal/register-alarm-modal.directive.js',
		'./src/xpd-resources/ng/xpd.time-slices-table/time-slices-table.directive.js',
		'./src/xpd-resources/ng/xpd.failure-controller/failure-controller.module.js',
		'./src/xpd-resources/ng/xpd.failure-controller/failure-nav-bar.directive.js',
		'./src/xpd-resources/ng/xpd.admin-nav-bar/admin-nav-bar.directive.js',
		'./src/xpd-resources/ng/angular.treeview/angular.treeview.js',
		'./src/xpd-resources/ng/xpd.tracking/tracking.module.js',
		'./src/xpd-resources/ng/xpd.tracking/tracking.controller.js',
		'./src/xpd-resources/ng/xpd.switch/xpd.switch.directive.js',
		'./src/xpd-resources/ng/xpd.modal.laydown-confirmation/xpd.modal.laydown-confirmation.directive.js',
		'./src/xpd-resources/ng/xpd.dmec/dmec.service.js',
		'./src/admin/app/components/admin/admin.module.js',
		'./src/xpd-resources/ng/xpd.section-list/section-list.directive.js',
		'./src/admin/app/components/admin/directives/vre-list-table.directive.js',
		'./src/admin/app/components/admin/directives/saved-alarms-list.directive.js',
		'./src/xpd-resources/ng/xpd.forecast-waterfall/forecast-waterfall.module.js',
		'./src/xpd-resources/ng/xpd.forecast-waterfall/forecast-waterfall.directive.js',
		'./src/admin/app/components/admin/admin.config.js',
		'./src/xpd-resources/ng/xpd.rpd/rpd.directive.js',
		'./src/xpd-resources/ng/xpd.modal.event-details/xpd-modal-event-details.module.js',
		'./src/xpd-resources/ng/xpd.modal.event-details/xpd-modal-event-details.factory.js',
		'./src/xpd-resources/ng/xpd.modal.event-details/xpd-modal-event-details.controller.js',
		'./src/xpd-resources/ng/xpd.modal.failure/xpd-modal-failure.module.js',
		'./src/xpd-resources/ng/xpd.modal.failure/xpd-modal-failure.factory.js',
		'./src/xpd-resources/ng/xpd.modal.failure/xpd-modal-failure.controller.js',
		'./src/xpd-resources/ng/xpd.modal.lessonlearned/xpd-modal-lessonlearned.module.js',
		'./src/xpd-resources/ng/xpd.modal.lessonlearned/xpd-modal-lessonlearned.factory.js',
		'./src/xpd-resources/ng/xpd.modal.lessonlearned/xpd-modal-lessonlearned.controller.js',
		'./src/admin/app/components/admin/controllers/menu.controller.js',
		'./src/admin/app/components/admin/controllers/data-acquisition.controller.js',
		'./src/admin/app/components/admin/controllers/planner.controller.js',
		'./src/admin/app/components/admin/controllers/alarm/alarm.service.js',
		'./src/admin/app/components/admin/controllers/alarm/alarm-modal-upsert.controller.js',
		'./src/admin/app/components/admin/controllers/alarm/alarm.controller.js',
		'./src/admin/app/components/admin/controllers/reports.controller.js',
		'./src/admin/app/components/admin/controllers/well/well.controller.js',
		'./src/admin/app/components/admin/controllers/well/well-upsert.controller.js',
		'./src/admin/app/components/admin/controllers/section/section.controller.js',
		'./src/admin/app/components/admin/controllers/section/section-upsert.controller.js',
		'./src/admin/app/components/admin/controllers/operation/operation-configuration.service.js',
		'./src/admin/app/components/admin/controllers/operation/operation.controller.js',
		'./src/admin/app/components/admin/controllers/operation/alarm-info.controller.js',
		'./src/admin/app/components/admin/controllers/operation/operation-copy-options-modal.controller.js',
		'./src/admin/app/components/admin/controllers/member-scheduler/member-scheduler.controller.js',
		'./src/admin/app/components/admin/controllers/member-scheduler/member-scheduler.directive.js',
		'./src/admin/app/components/admin/controllers/member-scheduler/scheduler-actions.service.js',
		'./src/admin/app/components/admin/controllers/member-scheduler/upsert-member.controller.js',
		'./src/admin/app/components/admin/controllers/member-scheduler/upsert-function.controller.js',
		'./src/admin/app/components/admin/controllers/member-scheduler/upsert-schedule.controller.js',
		'./src/admin/app/components/admin/controllers/shift-report.controller.js',
		'./src/admin/app/components/admin/controllers/team.controller.js',
		'./src/admin/app/components/admin/controllers/operation-dashboard/operation-dashboard.module.js',
		'./src/admin/app/components/admin/controllers/operation-dashboard/operation-dashboard.config.js',
		'./src/admin/app/components/admin/controllers/operation-dashboard/operation-dashboard.controller.js',
		'./src/admin/app/components/admin/controllers/admin-tracking.controller.js',
		'./src/admin/app/components/admin/controllers/tracking-update-times-modal.controller.js',
		'./src/admin/app/components/admin/controllers/failure-delay-category.controller.js',
		'./src/admin/app/components/admin/controllers/lesson-learned-category.controller.js',
		'./src/admin/app/components/admin/controllers/failures.controller.js',
		'./src/admin/app/components/admin/controllers/lesson-learned.controller.js',
		'./src/admin/app/components/admin/controllers/tabs-failure-lesson.controller.js'
	]
};

exports.styles = {
	vendor: [
		'./node_modules/bootstrap/dist/css/bootstrap.min.css',
		'./node_modules/angular-toastr/dist/angular-toastr.css',
		'./node_modules/font-awesome/css/font-awesome.min.css'
	],
	base: [
		'./src/admin/assets/css/dhtmlxgantt.css',
		'./src/admin/assets/css/dhtmlxgantt_broadway.css',
		'./src/xpd-resources/css/xpd.css',
		'./src/xpd-resources/ng/xpd.visualization/xpd-visualization.css',
		'./src/xpd-resources/css/admin.css',
		'./src/xpd-resources/css/pallete.css',
		'./src/xpd-resources/ng/angular.treeview/css/angular.treeview.css'
	]
};