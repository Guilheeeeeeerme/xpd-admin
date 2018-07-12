// (function() {
// 	'use strict';

// 	angular.module('xpd.failure-controller', [
// 		'xpd.communication',
// 		'xpd.setupapi',
// 		'xpd.dialog',
// 	]);

// })();

import * as angular from 'angular';
import { FailureNavBarDirective } from './failure-nav-bar.directive';

const XPDFailureNavBarController: angular.IModule  = angular.module('xpd.failure-controller', [
	'xpd.communication',
	'xpd.setupapi',
	'xpd.dialog',
]);
export default XPDFailureNavBarController;

XPDFailureNavBarController.directive('failureNavBar', FailureNavBarDirective.Factory());
