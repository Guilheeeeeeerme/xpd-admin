/*
* @Author: Gezzy Ramos
* @Date:   2017-05-15 17:46:40
* @Last Modified by:   Gezzy Ramos
* @Last Modified time: 2017-10-05 14:18:42
*/
(function () {
	'use strict';

	angular.module('xpd.admin-nav-bar', [])
		.directive('xpdAdminNavBar', xpdAdminNavBar);

	xpdAdminNavBar.$inject = ['$location', 'menuConfirmationFactory', 'operationDataFactory', 'dialogFactory'];

	function xpdAdminNavBar($location, menuConfirmationFactory, operationDataFactory, dialogFactory) {
		return {
			scope: {

			},
			restrict: 'EA',
			templateUrl: '../xpd-resources/ng/xpd.admin-nav-bar/admin-nav-bar.template.html',
			link: link
		};

		function link(scope, element, attrs) {

			if (attrs.navOrigin == 'admin') {
				scope.onclickItemMenu = onclickItemMenuAdmin;
			} else {
				scope.onclickItemMenu = onclickItemMenuReport;
			}

			operationDataFactory.operationData = [];

			operationDataFactory.addEventListener('menuConfirmationFactory', 'setOnRunningOperationListener', showPlanner);
			operationDataFactory.addEventListener('menuConfirmationFactory', 'setOnOperationChangeListener', checkPlanner);

			operationDataFactory.addEventListener('menuConfirmationFactory', 'setOnNoCurrentOperationListener', hidePlanner);

			function onclickItemMenuAdmin(path) {
				var blockMenu = menuConfirmationFactory.getBlockMenu();

				if (!blockMenu) {

					redirectToPath(path);

				} else {
					var message = 'Your changes will be lost. Proceed?';

					dialogFactory.showCriticalDialog(message, function () {
						menuConfirmationFactory.setBlockMenu(false);
						redirectToPath(path);
					});
				}
			}

			function redirectToPath(path) {


				if ($location.port()) {

					if (path == 'reports.html#/') {
						window.location.href = 'https://' + $location.host() + ':' + $location.port() + '/admin/' + path;
					} else if (path == 'dmeclog.html#/') {
						window.open('https://' + $location.host() + ':' + $location.port() + '/admin/dmeclog.html#');
					} else {
						if ( !window.location.href.endsWith(path) ){
							window.open('admin.html#' + path);
						}
						// $location.url(path);
					}

				} else {

					var url = window.location.href.split('pages')[0];

					if (path == 'reports.html#/') {
						window.location.href = url + '/pages/' + path;
					} else if (path == 'dmeclog.html#/') {
						window.open(url + '/pages/' + path);
					} else {
						if ( !window.location.href.endsWith(path) ){
							window.open('admin.html#' + path);
						}
						// $location.url(path);
					}

				}
			}

			function onclickItemMenuReport(path) {

				if ($location.port()) {
					
					if (path == 'reports.html#/') {
						$location.url();
					} else if (path == 'dmeclog.html#/') {
						window.open('https://' + $location.host() + ':' + $location.port() + '/admin/dmeclog.html#');
					} else {
						window.location.href = 'https://' + $location.host() + ':' + $location.port() + '/admin/admin.html#' + path;
					}

				} else {

					var url = window.location.href.split('/pages')[0];					

					if (path == 'reports.html#/') {
						// window.location.href = url + 'pages/reports.html#/';
					} else if (path == 'dmeclog.html#/') {
						window.open(url + 'pages/dmeclog.html#');
					} else {
						window.location.href = url + 'pages/admin.html#' + path;
					}

				}
			}

			function showPlanner() {
				scope.showPlanner = true;
			}

			function checkPlanner(context) {
				if (context.currentOperation && context.currentOperation.running && context.currentOperation.type != 'time') {
					scope.showPlanner = true;
				} else {
					scope.showPlanner = false;
				}
			}

			function hidePlanner() {
				scope.showPlanner = false;
			}
		}
	}

})();