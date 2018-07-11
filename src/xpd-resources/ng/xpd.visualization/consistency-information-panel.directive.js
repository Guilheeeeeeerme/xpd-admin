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
				onInit: '=',
				onClickCollapse: '=',
				collapse: '=',
				state: '=',
				event: '=',
				isTripin: '=',
				score: '=',
				currentEventDuration: '=',
				jointDuration: '=',
				lastEventType: '=',
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

			scope.getLastJointDuration = getLastJointDuration;

			scope.$watch('lastTripDuration', function (duration) {
				scope.duration['TRIP'] = duration;
			});

			scope.$watch('lastConnDuration', function (duration) {
				scope.duration['CONN'] = duration;
			});

			function getLastJointDuration() {
				var tripDuration = (scope.lastTripDuration) ? scope.lastTripDuration : 0;
				var connDuration = (scope.lastConnDuration) ? scope.lastConnDuration : 0;
				return tripDuration + connDuration;
			}
		}
	}
})();