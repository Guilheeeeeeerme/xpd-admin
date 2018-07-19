// (function() {
// 'use strict';

import BitDepthTimeTemplate from './components/bit-depth-time.template.html';
import FailuresNptTemplate from './components/failures-npt.template.html';
import HistogramReportTemplate from './components/histogram-report.template.html';
import LessonsLearnedTemplate from './components/lessons-learned.template.html';
import ReportNeedleTemplate from './components/needle-report.template.html';
import VreReportTemplate from './components/vre-report.template.html';
import VreScoreReportTemplate from './components/vre-score.template.html';

export class ReportConfig {
	public static $inject = ['$routeProvider'];

	constructor($routeProvider) {

		$routeProvider
			.when('/', {
				template: VreReportTemplate,
				controller: 'VREReportController as vController',
			})

			.when('/vre/', {
				template: VreReportTemplate,
				controller: 'VREReportController as vController',
			})

			.when('/vre-score/', {
				template: VreScoreReportTemplate,
				controller: 'VREScoreController as vsController',
			})

			.when('/histogram/', {
				template: HistogramReportTemplate,
				controller: 'HistogramReportController as hrController',
			})

			.when('/needle-report/', {
				template: ReportNeedleTemplate,
				controller: 'NeedleReportController as rnController',
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
		// 	controller: 'VREReportController as vController'
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
