// (function() {
// 	'use strict';

// 	displacementArea.$inject = ['d3Service'];
import * as d3 from 'd3';
import './displacement-area.style.scss';
import template from './displacement-area.template.html';

export class DisplacementAreaFactory implements ng.IDirective {
	public static $inject = [];

	public static Factory(): ng.IDirectiveFactory {
		return () => new DisplacementAreaFactory();
	}
	public template = template;
	public restrict = 'E';
	public scope = {
		slipsTime: '<',
		accelerationTimeLimit: '<',
		decelerationTimeLimit: '<',
		targetSpeed: '<',
		displacement: '<',
		safetyLimit: '<',
		vcruising: '<',
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

		scope.svg.viewBoxHeight = (scope.svg.height * 100) / scope.svg.width;
		scope.svg.viewBox = '0 0 100 ' + scope.svg.viewBoxHeight;

		scope.xPosition = d3.scaleLinear().domain([0, (scope.safetyLimit * 3600)]).range([0, 30]);
		scope.xPositionTicks = scope.xPosition.ticks();

		scope.$watchGroup(['slipsTime', 'accelerationTimeLimit', 'decelerationTimeLimit', 'targetSpeed', 'displacement', 'vcruising'], function (newValues) {

			const slipsTime = newValues[0];
			const accelerationTimeLimit = newValues[1];
			const decelerationTimeLimit = newValues[2];
			const targetSpeed = newValues[3];
			const displacement = newValues[4];
			const vcruising = newValues[5];

			try {

				scope.yPosition = d3.scaleLinear().domain([0, (displacement / targetSpeed)]).range([20, scope.svg.viewBoxHeight]).clamp(true);
				scope.yPositionTicks = scope.yPosition.ticks();

				// TEMPO TOTAL QUE DEVE SER GASTO
				const time = (displacement / targetSpeed) - slipsTime;

				// targetSpeed = displacement / time;

				// if (time < (accelerationTimeLimit + decelerationTimeLimit)) {

				// 	var tempAcceleration = accelerationTimeLimit / (accelerationTimeLimit + decelerationTimeLimit);
				// 	var tempDeceleration = decelerationTimeLimit / (accelerationTimeLimit + decelerationTimeLimit);

				// 	accelerationTimeLimit = tempAcceleration * time;
				// 	decelerationTimeLimit = tempDeceleration * time;

				// }

				scope.time = time;
				// scope.vcruising = vcruising;

			} catch (e) {
				console.log(e);
			}

		});

	}

}
