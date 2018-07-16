import * as d3 from 'd3';
import template from './trip-ruler.template.html';

export class TripRulerDirective implements ng.IDirective {
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

		// scope.showSlowDown = false;

		scope._expectedChanging = [];
		scope._expectedAlarmChanging = [];

		scope.svg = {
			height: element[0].offsetHeight,
			width: element[0].clientWidth,
		};

		scope.svg.viewBoxHeight = (scope.svg.height * 100) / scope.svg.width;
		scope.svg.viewBox = '0 0 100 ' + scope.svg.viewBoxHeight;

		scope.$watch('operation', checkLabelRuler);

		scope.$watch('calculated', checkCalculatedSpeed);

		scope.$watch('expectedChanging', checkExpectedChanging, true);

		scope.$watch('expectedAlarmChanging', checkExpectedAlarmChanging, true);

		buildRuler();

		function checkCalculatedSpeed(newValue, oldValue) {
			/*if (newValue && oldValue) {
				if (newValue.speed && oldValue.speed && newValue.speed < oldValue.speed)
					scope.showSlowDown = true;
				else
					scope.showSlowDown = false;
			}*/
		}

		function checkLabelRuler(operation) {
			if (operation == null) {
				return;
			}

			scope.upperStopLabel = operation.upperStop;
			scope.dpLimitLabel = operation.stickUp + operation.averageStandLength;

			if (scope.upperStopLabel === scope.dpLimitLabel) {
				scope.upperStopLabel = scope.upperStopLabel + 0.6;
				scope.dpLimitLabel = scope.dpLimitLabel - 0.6;
			}
		}

		function checkExpectedChanging(expectedChanging) {
			scope._expectedChanging = expectedChanging;
		}

		const alarmColors = d3.scaleOrdinal(d3.schemeCategory10);
		function checkExpectedAlarmChanging(expectedChanging) {
			scope._expectedAlarmChanging = expectedChanging;

			for (const i in scope._expectedAlarmChanging) {
				scope._expectedAlarmChanging[i].color = alarmColors(i);
			}
		}

		function buildRuler() {

			scope.ruler = {
				size: 45,
				// size: scope.operation.averageStandLength + scope.operation.stickUp,
				ticks: [],
			};

			scope.yPosition = d3.scaleLinear().domain([scope.ruler.size, 0]).range([0, scope.svg.viewBoxHeight]);

			scope.ruler.ticks = scope.yPosition.ticks(scope.ruler.size);
		}

	}

	public static Factory(): ng.IDirectiveFactory {
		return () => new TripRulerDirective();
	}

}
