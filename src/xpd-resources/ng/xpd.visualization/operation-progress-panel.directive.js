(function () {
	'use strict';

	angular.module('xpd.visualization')
		.directive('operationProgressPanel', operationProgressPanel);

	operationProgressPanel.$inject = [];

	function operationProgressPanel() {
		return {
			restrict: 'EA',
			templateUrl: '../xpd-resources/ng/xpd.visualization/operation-progress-panel.template.html',
			scope: {
				currentScore: '=',
				progressData: '=',
			},
			link: link
		};

		function link(scope) {

			scope.getProgressPercentage = getProgressPercentage;

			scope.$watch('progressData', getDirectiveData);
		
			function getDirectiveData(progressData) {
				var directiveData = [{
					'label': 'Target Operation',
					'totalTime': 0,
					'expectedTime': 0,
					'actualTime': 0
				}];

				for (var eventKey in progressData) {
					if (eventKey === 'CONN')
						progressData[eventKey].label = 'Connection';
					else if (eventKey === 'TRIP')
						progressData[eventKey].label = 'Trip';

					directiveData[0].totalTime += progressData[eventKey].totalTime;
					directiveData[0].expectedTime += progressData[eventKey].expectedTime;
					directiveData[0].actualTime += progressData[eventKey].actualTime;

					directiveData.push(progressData[eventKey]);
				}

				scope.directiveData = directiveData;
			}

			function getProgressPercentage(totalTime, currentTime) {
				return (currentTime * 100) / totalTime + '%';
			}
		}
	}
})();