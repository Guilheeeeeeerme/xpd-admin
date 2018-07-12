/*
* @Author: Gezzy Ramos
* @Date:   2017-05-15 17:46:40
* @Last Modified by:   Gezzy Ramos
* @Last Modified time: 2017-10-05 14:18:42
*/

// (function() {
// 	'use strict',

// 	angular.module('xpd.communication', ['socketIO', 'xpd.accessfactory']);

// })();

import * as angular from 'angular';
import { XPDAdminNavBarDirective } from './admin-nav-bar.directive';

const XPDAdminNavBarModule: angular.IModule  = angular.module('xpd.admin-nav-bar', []);
export default XPDAdminNavBarModule;

XPDAdminNavBarModule.directive('xpdAdminNavBar', XPDAdminNavBarDirective.Factory());


// (function() {
// 	'use strict';

// 	angular.module('xpd.admin-nav-bar', [])
// 		.directive('xpdAdminNavBar', xpdAdminNavBar);

// 	xpdAdminNavBar.$inject = ['$location', 'menuConfirmationFactory', 'operationDataFactory', 'dialogFactory'];

// 	function xpdAdminNavBar($location, menuConfirmationFactory, operationDataFactory, dialogFactory) {
// 		return {
// 			scope: {

// 			},
// 			restrict: 'E',
// 			templateUrl: '../xpd-resources/ng/xpd.admin-nav-bar/admin-nav-bar.template.html',
// 			link,
// 		};

// 		function link(scope, element, attrs) {

// 			if (attrs.navOrigin == 'report') {
// 				scope.onclickItemMenu = onclickItemMenuReport;
// 			} else {
// 				scope.onclickItemMenu = onclickItemMenuAdmin;
// 			}

// 			operationDataFactory.openConnection([]).then(function(response) {
// 				operationDataFactory = response;
// 				checkIfHasRunningOperation();
// 			});

// 			operationDataFactory.addEventListener('menuConfirmationFactory', 'setOnRunningOperationListener', checkIfHasRunningOperation);
// 			operationDataFactory.addEventListener('menuConfirmationFactory', 'setOnOperationChangeListener', checkIfHasRunningOperation);
// 			operationDataFactory.addEventListener('menuConfirmationFactory', 'setOnNoCurrentOperationListener', checkIfHasRunningOperation);

// 			function onclickItemMenuAdmin(path, newTab) {
// 				const blockMenu = menuConfirmationFactory.getBlockMenu();

// 				if (!blockMenu) {

// 					redirectToPath(path, !!newTab);

// 				} else {
// 					const message = 'Your changes will be lost. Proceed?';

// 					dialogFactory.showCriticalDialog(message, function() {
// 						menuConfirmationFactory.setBlockMenu(false);
// 						redirectToPath(path, !!newTab);
// 					});
// 				}
// 			}

// 			function onclickItemMenuReport(path, newTab) {

// 				if ($location.port()) {

// 					if (path == 'dmeclog.html#/') {
// 						window.open('https://' + $location.host() + ':' + $location.port() + '/admin/dmeclog.html#');
// 					} else {
// 						if (newTab) {
// 							window.open('https://' + $location.host() + ':' + $location.port() + '/admin/admin.html#' + path);
// 						} else {
// 							window.location.href = 'https://' + $location.host() + ':' + $location.port() + '/admin/admin.html#' + path;
// 						}
// 					}

// 				} else {

// 					const url = window.location.href.split('/pages')[0];

// 					if (path == 'dmeclog.html#/') {
// 						window.open(url + 'pages/dmeclog.html#');
// 					} else {
// 						if (newTab) {
// 							window.open('https://' + url + 'pages/admin.html#' + path);
// 						} else {
// 							window.location.href = url + 'pages/admin.html#' + path;
// 						}
// 					}

// 				}
// 			}

// 			function redirectToPath(path, newTab) {

// 				if ($location.port()) {

// 					if (path == 'dmeclog.html#/') {
// 						window.open('https://' + $location.host() + ':' + $location.port() + '/admin/dmeclog.html#');
// 					} else if (path == 'reports.html#/') {
// 						window.location.href = 'https://' + $location.host() + ':' + $location.port() + '/admin/' + path;
// 					} else {
// 						if ( !window.location.href.endsWith(path) ) {
// 							if (newTab) {
// 								window.open('admin.html#' + path);
// 							} else {
// 								$location.url(path);
// 							}
// 						}
// 					}

// 				} else {

// 					const url = window.location.href.split('pages')[0];

// 					if (path == 'dmeclog.html#/') {
// 						window.open(url + '/pages/' + path);
// 					} else if (path == 'reports.html#/') {
// 						window.location.href = url + '/pages/' + path;
// 					} else {
// 						if ( !window.location.href.endsWith(path) ) {
// 							if (newTab) {
// 								window.open('admin.html#' + path);
// 							} else {
// 								$location.url(path);
// 							}
// 						}
// 					}

// 				}
// 			}

// 			function checkIfHasRunningOperation() {
// 				const context = operationDataFactory.operationData.operationContext;
// 				if (context && context.currentOperation && context.currentOperation.running && context.currentOperation.type != 'time') {
// 					scope.hasRunningOperation = true;
// 				} else {
// 					scope.hasRunningOperation = false;
// 				}
// 			}
// 		}
// 	}

// })();
