import * as angular from 'angular';
import * as d3 from 'd3';
import './trip-ruler.style.scss';
import template from './trip-ruler.template.html';

export class TripRulerDirective implements ng.IDirective {

	public static $inject = ['$window'];
	public static Factory(): ng.IDirectiveFactory {
		return ($window: any) => new TripRulerDirective($window);
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

	constructor(private $window: any) { }

	public link: ng.IDirectiveLinkFn = (
		scope: any,
		element: ng.IAugmentedJQuery,
		attributes: ng.IAttributes,
		ctrl: any,
	) => {

		const vm = this;

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

			if (!scope.svg) {
				scope.svg = {
					height: element[0].offsetHeight,
					width: element[0].clientWidth,
				};
			} else {
				scope.svg.height = element[0].offsetHeight;
				scope.svg.width = element[0].clientWidth;
			}

			// console.log(scope.svg);
			// console.log(element.parent().height());

			scope.svg.viewBoxHeight = (scope.svg.height * 100) / scope.svg.width;
			scope.svg.viewBox = '0 0 100 ' + scope.svg.viewBoxHeight;

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

		buildRuler();

		scope.$watch('operation', (data) => checkLabelRuler(data));
		scope.$watch('expectedChanging', (data) => checkExpectedChanging(data), true);
		scope.$watch('expectedAlarmChanging', (data) => checkExpectedAlarmChanging(data), true);

		angular.element(vm.$window).bind('resize', () => {

			buildRuler();

			// manuall $digest required as resize event
			// is outside of angular
			scope.$digest();
		});

		// setTimeout(() => {
		// 	buildRuler();
		// }, 500);

	}

}
