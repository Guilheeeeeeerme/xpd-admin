import * as d3 from 'd3';
import './trip-ruler.style.scss';
import template from './trip-ruler.template.html';

export class TripRulerDirective implements ng.IDirective {

	public static Factory(): ng.IDirectiveFactory {
		return () => new TripRulerDirective();
	}
	public restrict = 'E';
	public template = template;
	public scope = {
		readings: '=',
		calculated: '=',
		operation: '=',
		showSlowDown: '=',
		expectedChanging: '=',
		expectedAlarmChanging: '=',
		unreachable: '=',
	};

	public link: ng.IDirectiveLinkFn = (
		scope: any,
		element: ng.IAugmentedJQuery,
		attributes: ng.IAttributes,
		ctrl: any,
	) => {

		const alarmColors = d3.scaleOrdinal(d3.schemeCategory10);

		const checkLabelRuler = (operation) => {
			if (operation == null) {
				return;
			}

			scope.upperStopLabel = operation.upperStop;
			scope.dpLimitLabel = operation.stickUp + operation.averageStandLength;

			if (scope.upperStopLabel === scope.dpLimitLabel) {
				scope.upperStopLabel = scope.upperStopLabel + 0.6;
				scope.dpLimitLabel = scope.dpLimitLabel - 0.6;
			}
		};

		const checkExpectedChanging = (expectedChanging) => {
			scope._expectedChanging = expectedChanging;
		};

		const checkExpectedAlarmChanging = (expectedChanging) => {
			scope._expectedAlarmChanging = expectedChanging;

			for (const i in scope._expectedAlarmChanging) {
				scope._expectedAlarmChanging[i].color = alarmColors(i);
			}
		};

		const buildRuler = () => {

			scope.ruler = {
				size: 45,
				// size: scope.operation.averageStandLength + scope.operation.stickUp,
				ticks: [],
			};

			scope.yPosition = d3.scaleLinear().domain([scope.ruler.size, 0]).range([0, scope.svg.viewBoxHeight]);

			scope.ruler.ticks = scope.yPosition.ticks(scope.ruler.size);
		};

		// scope.showSlowDown = false;

		scope._expectedChanging = [];
		scope._expectedAlarmChanging = [];

		scope.svg = {
			height: element[0].offsetHeight,
			width: element[0].clientWidth,
		};

		scope.svg.viewBoxHeight = (scope.svg.height * 100) / scope.svg.width;
		scope.svg.viewBox = '0 0 100 ' + scope.svg.viewBoxHeight;

		scope.$watch('operation', (data) => checkLabelRuler(data) );
		scope.$watch('expectedChanging', (data) => checkExpectedChanging(data) , true);
		scope.$watch('expectedAlarmChanging', (data) => checkExpectedAlarmChanging(data) , true);

		buildRuler();

	}

}
