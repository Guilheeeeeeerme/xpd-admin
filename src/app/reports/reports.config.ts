// (function() {
// 'use strict';

// angular.module('xpd.reports').config(reportConfig);

import BitDepthTimeTemplate from './app/components/reports/views/bit-depth-time.template.html';
import FailuresNptTemplate from './app/components/reports/views/failures-npt.template.html';
import HistogramReportTemplate from './app/components/reports/views/histogram-report.template.html';
import LessonsLearnedTemplate from './app/components/reports/views/lessons-learned.template.html';
import ReportNeedleTemplate from './app/components/reports/views/needle-report.template.html';
import VreScoreReportTemplate from './app/components/reports/views/vre-score.template.html';
import VreReportTemplate from './app/components/reports/views/vre.template.html';

export class ReportConfig {
	public static $inject = ['$routeProvider'];

	constructor($routeProvider) {

		$routeProvider
			.when('/', {
				template: VreReportTemplate,
				controller: 'VreReportController as vController',
			})

			.when('/vre/', {
				template: VreReportTemplate,
				controller: 'VreReportController as vController',
			})

			.when('/vre-score/', {
				template: VreScoreReportTemplate,
				controller: 'VreScoreController as vsController',
			})

			.when('/histogram/', {
				template: HistogramReportTemplate,
				controller: 'HistogramReportController as hrController',
			})

			.when('/needle-report/', {
				template: ReportNeedleTemplate,
				controller: 'ReportNeedleController as rnController',
			})

			.when('/failures-npt/', {
				template: FailuresNptTemplate,
				controller: 'FailuresNptController as fnController',
			})

			.when('/lessons-learned/', {
				template: LessonsLearnedTemplate,
				controller: 'LessonsLearnedController as llController',
			})

			.when('/bit-depth-time/:wellId?', {
				template: BitDepthTimeTemplate,
				controller: 'BitDepthTimeController as bdtController',
			});

		// .when('/operation/:operationId', {
		// 	templateUrl: './app/components/reports/views/vre.template.html',
		// 	controller: 'VreReportController as vController'
		// })

		// .when('/operation/:operationId/connections', {
		// 	templateUrl: './app/components/reports/views/slips-to-slips.template.html',
		// 	controller: 'SlipsToSlipsController as stsController'
		// })

		// .when('/operation/:operationId/trips', {
		// 	templateUrl: './app/components/reports/views/slips-to-slips.template.html',
		// 	controller: 'SlipsToSlipsController as stsController'
		// })

		// .when('/operation/:operationId/time-vs-depth', {
		// 	templateUrl: './app/components/reports/views/depth.template.html',
		// 	controller: 'DepthController as dController'
		// })

		// .when('/time-vs-depth', {
		// 	templateUrl: './app/components/reports/views/depth.template.html',
		// 	controller: 'DepthController as dController'
		// });
	}
}

// })();
