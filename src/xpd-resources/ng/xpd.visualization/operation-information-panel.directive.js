(function () {
	'use strict';

	angular.module('xpd.visualization')
		.directive('operationInformationPanel', operationInformationPanel);

	operationInformationPanel.$inject = [];

	function operationInformationPanel() {
		return {
			restrict: 'EA',
			templateUrl: '../xpd-resources/ng/xpd.visualization/operation-information-panel.template.html',
			scope: {
				onInit: '=',
				onClickCollapse: '=',
				collapse: '=',
				numberJoints: '=',
				jointNumber: '=',
				operation: '=',
				state: '=',
				reading: '=',
				accScore: '=',
				stateDuration: '=',
				targetParamExpectedEndTime: '=',
				targetExpectedDuration: '=',
				optimumExpectedDuration: '=',
				standardExpectedDuration: '=',
				poorExpectedDuration: '=',
				afterPoorExpectedDuration: '=',
				stateProgressPercentage: '=',
				well: '=',
			},
			link: link
		};

		function link(scope) {

			scope.getStatePercentageDuration = getStatePercentageDuration;
			scope.getColorPerformance = getColorPerformance;

			function getStatePercentageDuration() {
				if (scope.afterPoorExpectedDuration) {
					var percentage = calcPercentage(scope.stateDuration, scope.afterPoorExpectedDuration);
					return (percentage > 100) ? 100 : percentage;
				}
			}

			function calcPercentage(partTime, totalTime) {
				return (partTime * 100) / totalTime;
			}

			function getColorPerformance() {

				var duration = scope.stateDuration;

				if (duration < scope.optimumExpectedDuration) {
					return '';
				} else if (duration <= scope.standardExpectedDuration) {
					return 'progress-bar-success';
				} else if (duration <= scope.poorExpectedDuration) {
					return 'progress-bar-warning';
				} else {
					return 'progress-bar-danger';
				}
			}
		}
	}
})();