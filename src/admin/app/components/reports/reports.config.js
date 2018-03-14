(function () {
	'use strict';

	angular.module('xpd.reports')
		.config(reportConfig);

	reportConfig.$inject = ['$routeProvider'];

	function reportConfig($routeProvider) {

		$routeProvider
			.when('/', {
				templateUrl: './app/components/reports/views/vre.template.html',
				controller: 'VreReportController as vController'
			})

			.when('/vre/', {
				templateUrl: './app/components/reports/views/vre.template.html',
				controller: 'VreReportController as vController'
			})

			.when('/vre-score/', {
				templateUrl: './app/components/reports/views/vre-score.template.html',
				controller: 'VreScoreController as vsController'
			})

			.when('/histogram/', {
				templateUrl: './app/components/reports/views/histogram-report.template.html',
				controller: 'HistogramReportController as hrController'
			})

			.when('/needle-report/', {
				templateUrl: './app/components/reports/views/needle-report.template.html',
				controller: 'ReportNeedleController as rnController'
			})


			.when('/failures-npt/', {
				templateUrl: './app/components/reports/views/failures-npt.template.html',
				controller: 'FailuresNptController as fnController'
			})
			.when('/lessons-learned/', {
				templateUrl: './app/components/reports/views/lessons-learned.template.html',
				controller: 'LessonsLearnedController as llController'
			})
			.when('/bit-depth-time/:wellId?', {
				templateUrl: './app/components/reports/views/bit-depth-time.template.html',
				controller: 'BitDepthTimeController as bdtController'
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
})();
