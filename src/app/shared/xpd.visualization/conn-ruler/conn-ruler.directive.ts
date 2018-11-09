// (function() {
// 	'use strict';

import * as angular from 'angular';
import * as d3 from 'd3';
import './conn-ruler.style.scss';
import template from './conn-ruler.template.html';

export class ConnRulerDirective implements ng.IDirective {

	public static $inject = ['$window'];
	public static Factory(): ng.IDirectiveFactory {
		return ($window: any) => new ConnRulerDirective($window);
	}

	public restrict = 'E';
	public template = template;
	public scope = {
		chronometer: '=',
		timeBlocks: '=',
		vtargetDuration: '=',
		flashGoDiv: '=',
	};

	constructor(private $window: any) { }

	public link: ng.IDirectiveLinkFn = (
		scope: any,
		element: ng.IAugmentedJQuery,
		attrs: ng.IAttributes,
		ctrl: any,
	) => {

		const vm = this;

		let unwatchChronometer;
		function buildRuler(timeBlocks, vtargetDuration) {
			if (vtargetDuration == null) {
				scope.hasVtarget = false;
				vtargetDuration = 3600;
			} else {
				scope.hasVtarget = true;
			}

			if (unwatchChronometer) {
				unwatchChronometer();
			}

			if (timeBlocks == null) {
				return;
			}

			scope.ruler = {
				size: +vtargetDuration,
				ticks: [],
			};

			scope.yPosition = d3.scaleLinear().domain([0, scope.ruler.size]).range([0, scope.svg.viewBoxHeight]);

			scope.ruler.ticks = scope.yPosition.ticks();

			let yPosition = 0;

			for (const i in timeBlocks) {

				const timeBlock = timeBlocks[i];

				timeBlock.timeOrder = +i + 1;

				timeBlock.startTime = yPosition;
				timeBlock.startPosition = scope.yPosition(yPosition);

				timeBlock.duration = (timeBlock.percentage * scope.ruler.size) / 100;
				timeBlock.height = scope.yPosition(timeBlock.duration);

				yPosition += timeBlock.duration;

				timeBlock.endTime = yPosition;
				timeBlock.endPosition = scope.yPosition(yPosition);

			}

			scope.plottedTimeBlocks = timeBlocks;

			// TODO VERIFICAR A ADAPTAÇÃO AS ANY
			scope.colorGradientScale = d3.scaleLinear()
				.domain([0, 100])
				.range([('#000000' as any), ('#517f89' as any)]);
			scope.colorGradientScaleInverse = d3.scaleLinear()
				.domain([0, 100])
				.range([('#517f89' as any), ('#000000' as any)]);

			if (scope.hasVtarget) {
				unwatchChronometer = watchChronometer();
			}
		}

		function calculateColorGradient(chronometer, index) {
			const timeBlock = scope.plottedTimeBlocks[index];

			let result;

			if (chronometer < timeBlock.startTime) {
				result = 0;
			} else if (chronometer >= timeBlock.startTime && chronometer < timeBlock.endTime) {
				result = ((chronometer - timeBlock.startTime) * 100) / timeBlock.duration;
			} else {
				result = 100;
			}

			timeBlock.tempHeight = timeBlock.height * (result / 100);

			timeBlock.offset = result;
			timeBlock.stopColor = scope.colorGradientScale(result);
			timeBlock.stopColorInverse = scope.colorGradientScaleInverse(result);

		}

		function checkPastEvent(chronometer, index) {
			const timeBlock = scope.plottedTimeBlocks[index];

			if (chronometer > timeBlock.startTime && !timeBlock.past) {
				timeBlock.past = true;

				if (index > 0 && scope.flashGoDiv) {
					scope.flashGoDiv();
				}
			}

		}

		function watchChronometer() {
			return scope.$watch('chronometer', function (newValue) {
				for (const i in scope.plottedTimeBlocks) {
					checkPastEvent(newValue, i);
					calculateColorGradient(newValue, i);
				}
			});
		}

		scope.$watch('timeBlocks', function (timeBlocks) {
			buildRuler(angular.copy(timeBlocks), scope.vtargetDuration);
		}, true);

		scope.$watch('vtargetDuration', function (vtargetDuration) {
			buildRuler(angular.copy(scope.timeBlocks), vtargetDuration);
		}, true);

		if (!scope.svg) {
			scope.svg = {
				height: element[0].offsetHeight,
				width: element[0].clientWidth,
			};
		} else {
			scope.svg.height = element[0].offsetHeight;
			scope.svg.width = element[0].clientWidth;
		}

		scope.svg.viewBoxHeight = Math.floor((scope.svg.height * 100) / scope.svg.width);
		scope.svg.viewBox = '0 0 100 ' + scope.svg.viewBoxHeight;

		angular.element(vm.$window).bind('resize', () => {
			// scope.$digest();
		});

	}
}
