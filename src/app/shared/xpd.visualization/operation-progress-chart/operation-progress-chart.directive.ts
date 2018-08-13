
// operationProgressChart.$inject = ['d3Service'];
import * as d3 from 'd3';
import './operation-progress-chart.style.scss';
import template from './operation-progress-chart.template.html';

export class OperationProgressChartDirective implements ng.IDirective {

	public static Factory(): ng.IDirectiveFactory {
		return () => new OperationProgressChartDirective();
	}
	public template = template;
	public restrict = 'E';
	public scope = {
		progressData: '=',
		progressDataDelay: '=',
	};

	public link: ng.IDirectiveLinkFn = (
		scope: any,
		element: ng.IAugmentedJQuery,
		attributes: ng.IAttributes,
		ctrl: any,
	) => {

		scope.svg = {
			height: element[0].offsetHeight,
			width: element[0].clientWidth,
		};

		scope.boxWidth = ((scope.svg.width * 330) / scope.svg.height);

		scope.Math = Math;

		const barWidth = scope.boxWidth - 185;
		scope.timeLabelRectWidth = 60;

		scope.svg.viewBox = '0 0 ' + scope.boxWidth + ' 330';

		scope.progressDelayRectSize = {
			width: scope.boxWidth * 0.29,
			height: 120,
			x: scope.boxWidth * 0.70,
		};

		scope.$watch('progressData', function(progressData) {
			if (progressData) {
				renderProgressBars(progressData);
			}
		});

		scope.$watch('progressDataDelay', function(progressDataDelay) {
			if (progressDataDelay) {
				renderProgressDataDelay(progressDataDelay);
			}
		});

		scope.getActualBarColor = getActualBarColor;

		function renderProgressBars(progressData) {
			scope.directiveData = getDirectiveData(progressData);

			scope.barScale = d3.scaleLinear()
				.domain([0, scope.directiveData[0].totalTime])
				.range([0, barWidth - scope.timeLabelRectWidth]);

		}

		function renderProgressDataDelay(progressDataDelay) {
			scope.progressDelayRectSize.height = (Object.keys(progressDataDelay).length * 30) + 10;
		}

		function getDirectiveData(progressData) {
			const directiveData = [{
				label: 'Target Operation',
				totalTime: 0,
				expectedTime: 0,
				actualTime: 0,
			}];

			for (const eventKey in progressData) {
				if (eventKey === 'CONN') {
					progressData[eventKey].label = 'Connection';
				} else if (eventKey === 'TRIP') {
					progressData[eventKey].label = 'Trip';
				}

				directiveData[0].totalTime += progressData[eventKey].totalTime;
				directiveData[0].expectedTime += progressData[eventKey].expectedTime;
				directiveData[0].actualTime += progressData[eventKey].actualTime;

				directiveData.push(progressData[eventKey]);
			}

			return directiveData;
		}

		function getActualBarColor(progressBarItem) {
			if (progressBarItem.actualTime < progressBarItem.expectedTime) {
				return '#80cfde';
			} else {
				return '#860000';
			}
		}

	}
}
