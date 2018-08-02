
import * as angular from 'angular';
import { XPDSwitchDirective } from './xpd.switch.directive';

const XPDSwitchModule: angular.IModule = angular.module('xpd.switch', []);
export  { XPDSwitchModule };

XPDSwitchModule.directive('xpdSwitch', XPDSwitchDirective.Factory());

// (function() {
// 	'use strict';

// 	function xpdSwitch() {

// 		return {
// 			restrict: 'E',
// 			scope: {
// 				shape: '@',
// 				resolve: '&',
// 				reject: '&',
// 				ngModel: '=',
// 			},
// 			templateUrl: '../xpd-resources/ng/xpd.switch/xpd.switch.template.html',
// 			link,
// 		};

// 		function link(scope, elem, attrs) {

// 			scope.onSwitchChange = onSwitchChange;

// 			function onSwitchChange() {
// 				try {

// 					if (scope.ngModel == true) {
// 						scope.resolve();
// 					} else {
// 						scope.reject();
// 					}

// 				} catch (e) {

// 				}
// 			}
// 		}

// 	}

// })();
