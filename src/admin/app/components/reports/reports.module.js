(function () {
	'use strict';

	angular.module('xpd.reports', [
		'ngRoute',
		'xpd.dialog',
		'xpd.setupapi',
		'xpd.filters',
		'd3',
		'highcharts',
		'xpd.communication',
		'xpd.modal.laydown-confirmation',
		'xpd.menu-confirmation',
		'xpd.admin-nav-bar',
		'angularTreeview',
		'xpd.modal-failure',
		'xpd.modal-lessonlearned',
		'xpd.failure-controller',
		'toastr', 
		'ngAnimate'
	]);
})();
