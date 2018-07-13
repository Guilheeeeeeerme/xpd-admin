// (function() {
// 'use strict';

// angular.module('xpd.reports').config(reportConfig);

import OperationViewOnlyTemplate from './operation-view-only.html';

export class OperationConfig {
	public static $inject = ['$routeProvider'];

	constructor($routeProvider) {

		$routeProvider.when('/operation-view-only', {
			template: OperationViewOnlyTemplate,
			controller: 'OperationViewOnlyController as ovoController',
		});

	}

}
