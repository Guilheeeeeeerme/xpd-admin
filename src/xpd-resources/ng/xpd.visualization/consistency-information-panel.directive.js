(function () {
	'use strict';

	angular.module('xpd.visualization')
		.directive('consistencyInformationPanel', consistencyInformationPanel);

	consistencyInformationPanel.$inject = [];

	function consistencyInformationPanel() {
		return {
			restrict: 'EA',
			templateUrl: '../xpd-resources/ng/xpd.visualization/consistency-information-panel.template.html',
			scope: {
				collapse: '=',
				state: '=',
				event: '=',
				isTripin: '=',
				score: '=',
				jointInfo: '=',
				lastTripDuration: '=',
				lastConnDuration: '=',
				eventProperty: '=',
			},
			link: link
		};

		function link(scope) {

			scope.duration = [];
			scope.percentageDuration = [];
			scope.colorPerformance = [];

			scope.getJointDuration = getJointDuration;
			scope.getJointPerformanceColor = getJointPerformanceColor;
			scope.getJointPercentageDuration = getJointPercentageDuration;

			scope.$watch('lastTripDuration', function (duration) {
				scope.duration['TRIP'] = duration;
				scope.percentageDuration['TRIP'] = calcPercentage(duration, scope.eventProperty['TRIP'].afterVpoorTime);
				scope.colorPerformance['TRIP'] = getColorPerformance(duration, scope.eventProperty['TRIP'].voptimumTime, scope.eventProperty['TRIP'].vstandardTime, scope.eventProperty['TRIP'].vpoorTime);
			});

			scope.$watch('lastConnDuration', function (duration) {
				scope.duration['CONN'] = duration;
				scope.percentageDuration['CONN'] = calcPercentage(duration, scope.eventProperty['CONN'].afterVpoorTime);
				scope.colorPerformance['CONN'] = getColorPerformance(duration, scope.eventProperty['CONN'].voptimumTime, scope.eventProperty['CONN'].vstandardTime, scope.eventProperty['CONN'].vpoorTime);
			});

			function getJointDuration() {
				var tripDuration = (scope.lastTripDuration) ? scope.lastTripDuration : 0;
				var connDuration = (scope.lastConnDuration) ? scope.lastConnDuration : 0;
				return tripDuration + connDuration;
			}

			function getJointPerformanceColor() {
				if (scope.eventProperty['BOTH'])
					return getColorPerformance(getJointDuration(), scope.eventProperty['BOTH'].voptimumTime, scope.eventProperty['BOTH'].vstandardTime, scope.eventProperty['BOTH'].vpoorTime);
			}

			function getJointPercentageDuration() {
				if (scope.eventProperty['BOTH'])
					return calcPercentage(getJointDuration(), scope.eventProperty['BOTH'].afterVpoorTime);
			}

			function calcPercentage(partTime, totalTime) {
				return (partTime * 100) / totalTime;
			}

			function getColorPerformance(duration, voptimumTime, vstandardTime, vpoorTime) {

				if (duration < voptimumTime) {
					return '';
				} else if (duration <= vstandardTime) {
					return 'progress-bar-success';
				} else if (duration <= vpoorTime) {
					return 'progress-bar-warning';
				} else {
					return 'progress-bar-danger';
				}
			}
		}
	}
})();