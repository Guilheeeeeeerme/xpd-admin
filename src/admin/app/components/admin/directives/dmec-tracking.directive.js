(function () {
	'use strict';

	angular.module('xpd.admin').directive('dmecTracking', dmecTrackingDirective);

	dmecTrackingDirective.$inject = ['readingSetupAPIService'];

	function dmecTrackingDirective(readingSetupAPIService) {
		return {
			scope: {
				connectionTimes: '=',
				tripTimes: '='
			},
			controller: 'TrackingController',
			controllerAs: 'atController',
			restrict: 'AE',
			templateUrl: 'app/components/admin/directives/dmec-tracking.template.html',
			link: link
		};

		function link(scope, element, attrs) {
			var day = (1 * 24 * 3600000);
			var reloadTimeout = null;

			scope.getAllReadingSince = getAllReadingSince;
			scope.toDate = toDate;
			scope.showDrillingMecChart = true;

			function toDate(arg) {
				return new Date(arg);
			}

			function getAllReadingSince(startTime) {

				if (reloadTimeout) {
					clearTimeout(reloadTimeout);
				}

				scope.showDrillingMecChart = true;

				reloadTimeout = setTimeout(function () {
					scope.showDrillingMecChart = false;
					setTimeout(function () {
						scope.showDrillingMecChart = true;
					}, 5000);
				}, day / 2);

				startTime = toDate(startTime);
				scope.dmecEndTime = new Date(startTime.getTime() + day / 2);

				readingSetupAPIService.getAllReadingSince(startTime.getTime(), readingsFromDatabase);
			}

			function readingsFromDatabase(readings) {
				scope.readings = readings;
			}
		}
	}
})();