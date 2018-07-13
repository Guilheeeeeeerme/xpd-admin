import XPDDialogModule from '../../../../xpd-resources/ng/xpd.dialog/xpd.dialog.module';

(function() {
	'use strict';

	angular.module('xpd.reports', [
		'ngRoute',
		XPDDialogModule.name,
		'xpd.setupapi',
		'xpd.filters',
		'xpd.timers',
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
		'ngAnimate',
	]);
})();
