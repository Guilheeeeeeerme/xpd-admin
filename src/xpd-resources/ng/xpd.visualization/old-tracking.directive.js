(function () {
	'use strict';

	angular.module('xpd.visualization').directive('oldTracking', oldTracking);

	function oldTracking() {
		return {
			scope: {
				actionEventModalButtonClose: '=',
				actionEventModalButtonSave: '=',
				actionOpenDropdownMenu: '=',
				actionClickEventDetailsButton: '=',
				actionClickFailuresButton: '=',
				actionClickLessonsLearnedButton: '=',
				taskExpectedDuration: '=',
				currentTick: '=',
				currentOperation: '=',
				currentEvent: '=',
				currentReading: '=',
				currentCalculated: '=',
				safetySpeedLimit: '=',
				currentTimeCalculated: '=',
				blockSpeedContext: '=',
				changingStatesList: '=',
				changingAlarmsList: '=',
				unreachable: '=',
				currentState: '=',
				connectionTimes: '=',
				tripTimes: '=',
				timeBlocks: '=',
				flags: '='
			},
			restrict: 'AE',
			templateUrl: '../xpd-resources/ng/xpd.visualization/old-tracking.template.html',
			link: link
		};

		function link(scope, element, attrs) {

		}
	}
})();