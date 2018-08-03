// (function() {
// 'use strict';

import BitDepthTimeTemplate from './components/bit-depth-time.template.html';
import FailuresLessonsTemplate from './components/failures-lessons.template.html';
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
				template: FailuresLessonsTemplate, // FailuresNptTemplate,
				controller: 'FailuresNptController as flController', // fnController',
			})

			.when('/lessons-learned/', {
				template: FailuresLessonsTemplate, // LessonsLearnedTemplate,
				controller: 'LessonsLearnedController as flController', // llController',
			})

			.when('/bit-depth-time/:wellId?', {
				template: BitDepthTimeTemplate,
				controller: 'BitDepthTimeController as bdtController',
			});

		// .when('/operation/:operationId', {
		// 	templateUrl: './app/components/reports/views/vre.template.html',
		// 	controller: 'VREReportController as vController'
		// })
	}
}

// })();
