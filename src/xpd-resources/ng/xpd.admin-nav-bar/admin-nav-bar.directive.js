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
			restrict: 'E',
			templateUrl: '../xpd-resources/ng/xpd.admin-nav-bar/admin-nav-bar.template.html',
			link: link
		};

		function link(scope, element, attrs) {

			if (attrs.navOrigin == 'report') {
				scope.onclickItemMenu = onclickItemMenuReport;
			} else {
				scope.onclickItemMenu = onclickItemMenuAdmin;
			}

			operationDataFactory.openConnection([]).then(function (response) {
				operationDataFactory = response;
			});

			operationDataFactory.addEventListener('menuConfirmationFactory', 'setOnRunningOperationListener', showPlanner);
			operationDataFactory.addEventListener('menuConfirmationFactory', 'setOnOperationChangeListener', checkPlanner);

			operationDataFactory.addEventListener('menuConfirmationFactory', 'setOnNoCurrentOperationListener', hidePlanner);

			function onclickItemMenuAdmin(path, newTab) {
				var blockMenu = menuConfirmationFactory.getBlockMenu();

				if (!blockMenu) {

					redirectToPath(path, !!newTab);

				} else {
					var message = 'Your changes will be lost. Proceed?';

					dialogFactory.showCriticalDialog(message, function () {
						menuConfirmationFactory.setBlockMenu(false);
						redirectToPath(path, !!newTab);
					});
				}
			}

			function onclickItemMenuReport(path, newTab) {

				if ($location.port()) {
					
					if (path == 'dmeclog.html#/') {
						window.open('https://' + $location.host() + ':' + $location.port() + '/admin/dmeclog.html#');
					} else {
						if(newTab){
							window.open('https://' + $location.host() + ':' + $location.port() + '/admin/admin.html#' + path);
						}else{
							window.location.href = 'https://' + $location.host() + ':' + $location.port() + '/admin/admin.html#' + path;
						}
					}

				} else {

					var url = window.location.href.split('/pages')[0];					

					if (path == 'dmeclog.html#/') {
						window.open(url + 'pages/dmeclog.html#');
					} else {
						if(newTab){
							window.open('https://' + url + 'pages/admin.html#' + path);
						}else{
							window.location.href = url + 'pages/admin.html#' + path;
						}
					}

				}
			}

			function redirectToPath(path, newTab) {

				if ($location.port()) {

					if (path == 'dmeclog.html#/') {
						window.open('https://' + $location.host() + ':' + $location.port() + '/admin/dmeclog.html#');
					} else if (path == 'reports.html#/') {
						window.location.href = 'https://' + $location.host() + ':' + $location.port() + '/admin/' + path;
					} else {
						if ( !window.location.href.endsWith(path) ){
							if(newTab){
								window.open('admin.html#' + path);
							}else{
								$location.url(path);
							}
						}
					}

				} else {

					var url = window.location.href.split('pages')[0];

					if (path == 'dmeclog.html#/') {
						window.open(url + '/pages/' + path);
					} else if (path == 'reports.html#/') {
						window.location.href = url + '/pages/' + path;
					} else {
						if ( !window.location.href.endsWith(path) ){
							if(newTab){
								window.open('admin.html#' + path);
							}else{
								$location.url(path);
							}
						}
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