(function () {
	'use strict';

	angular.module('xpd.visualization')
		.directive('operationProgressChart', operationProgressChart);

	operationProgressChart.$inject = ['d3Service'];

	function operationProgressChart(d3Service) {
		return {
			templateUrl: '../xpd-resources/ng/xpd.visualization/operation-progress-chart.template.html',
			scope: {
				progressData: '=',
				progressDataDelay: '='
			},

			link: link
		};

		function link(scope, element, attrs) {
			d3Service.d3().then(function (d3) {

				element[0].className = element[0].className + ' operation-progress-chart';

				scope.svg = {
					height: element[0].offsetHeight,
					width: element[0].clientWidth
				};

				scope.boxWidth = ((scope.svg.width * 330) / scope.svg.height);

				scope.Math = window.Math;

				var barWidth = scope.boxWidth - 185;
				scope.timeLabelRectWidth = 60;

				scope.svg.viewBox = '0 0 ' + scope.boxWidth + ' 330';

				scope.progressDelayRectSize = {
					width: scope.boxWidth * 0.29,
					height: 120,
					x: scope.boxWidth * 0.70
				};

				scope.$watch('progressData', function (progressData) {
					if (progressData)
						renderProgressBars(progressData);
				});

				scope.$watch('progressDataDelay', function (progressDataDelay) {
					if (progressDataDelay)
						renderProgressDataDelay(progressDataDelay);
				});

				scope.getActualBarColor = getActualBarColor;

				function renderProgressBars(progressData) {
					scope.directiveData = getDirectiveData(progressData);

					scope.barScale = d3.scale.linear()
						.domain([0, scope.directiveData[0].totalTime])
						.range([0, barWidth - scope.timeLabelRectWidth]);

				}

				function renderProgressDataDelay(progressDataDelay) {
					scope.progressDelayRectSize.height = (Object.keys(progressDataDelay).length * 30) + 10;
				}

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

					return directiveData;
				}

				function getActualBarColor(progressBarItem) {
					if (progressBarItem.actualTime < progressBarItem.expectedTime)
						return '#80cfde';
					else
						return '#860000';
				}
			});
		}
	}
})();