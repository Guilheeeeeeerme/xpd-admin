// (function() {
// 'use strict';

// angular.module('xpd.reports').config(reportConfig);

import WellViewOnlyTemplate from './well-view-only.html';

export class WellConfig {
	public static $inject = ['$routeProvider'];

	constructor($routeProvider) {

		$routeProvider.when('/', {
			template: WellViewOnlyTemplate,
			controller: 'WellViewOnlyController as wvoController',
		});

		$routeProvider.when('/:wellId', {
			template: WellViewOnlyTemplate,
			controller: 'WellViewOnlyController as wvoController',
		});

	}

}
