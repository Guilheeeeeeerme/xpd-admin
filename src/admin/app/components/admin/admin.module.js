(function () {
	'use strict';

	angular.module('xpd.admin', [
		'ngRoute',
		'xpd.setupapi',
		'xpd.tracking',
		'ngIntersection',
		'xpd.zerotimezone',
		'xpd.form.validation',
		'gantt',
		'xpd.calculation',
		'xpd.contract-param',
		'xpd.filters',
		'xpd.contractTimeInput',
		'angularTreeview',
		'xpd.modal-failure',
		'xpd.modal-lessonlearned',
		'highcharts',
		'xpd.modal.laydown-confirmation',
		'xpd.menu-confirmation',
		'xpd.admin-nav-bar',
		'xpd.failure-controller',
		'xpd.planner',
		'xpd.switch',
		'xpd.setup-form-input',
		'xpd.register-alarm-modal',
		'xpd.time-slices-table'
	]);

})();
