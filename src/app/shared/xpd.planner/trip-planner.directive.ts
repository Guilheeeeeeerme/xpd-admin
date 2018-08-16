// (function() {

// 	xpdTripPlanner.$inject = ['vCruisingCalculator'];
import { VCruisingCalculatorService } from '../xpd.calculation/calculation.service';
import './trip-planner.style.scss';
import template from './trip-planner.template.html';

export class XPDTripPlannerDirective implements ng.IDirective {

	public static $inject: string[] = ['vCruisingCalculator'];

	public static Factory(): ng.IDirectiveFactory {
		return (vCruisingCalculator: VCruisingCalculatorService) => new XPDTripPlannerDirective(vCruisingCalculator);
	}

	public scope = {
		label: '@',
		targetSpeed: '=',
		targetTime: '=',
		optimumSpeed: '<',
		displacement: '<',
		optimumSafetySpeedLimit: '<',
		targetSafetySpeedLimit: '=',
		vcruising: '=',

		optimumAccelerationTimeLimit: '<',
		targetAccelerationTimeLimit: '=',
		optimumDecelerationTimeLimit: '<',
		targetDecelerationTimeLimit: '=',

		stickUp: '<',
		upperStop: '<',
		slipsTime: '=',
		inSlipsDefault: '<',

		currentOperation: '=',

		actionButtonApply: '&',
	};

	public template = template;

	constructor(private vCruisingCalculator: VCruisingCalculatorService) {

	}

	public link: ng.IDirectiveLinkFn = (
		scope: any,
		element: ng.IAugmentedJQuery,
		attrs: ng.IAttributes,
		ctrl: any,
	) => {

		const self = this;

		scope.$watch('targetSpeed', updateTargetTime, true);
		scope.$watchGroup([
			'slipsTime',
			'targetAccelerationTimeLimit',
			'targetDecelerationTimeLimit',
			'targetSpeed',
			'displacement',
		], updateSettings, true);

		function updateTargetTime() {
			const reference = scope.displacement;

			scope.targetTime = reference / +scope.targetSpeed;
			scope.optimumTime = reference / +scope.optimumSpeed;
		}

		function updateSettings() {

			scope.slipsTime = Math.floor(scope.slipsTime);
			scope.targetAccelerationTimeLimit = Math.floor(scope.targetAccelerationTimeLimit);
			scope.targetDecelerationTimeLimit = Math.floor(scope.targetDecelerationTimeLimit);

			const displacement = scope.displacement;

			const targetSpeed = scope.targetSpeed;

			const pureDuration = (displacement / targetSpeed);
			const time = pureDuration - scope.slipsTime;

			const accelerationTimeLimit = scope.targetAccelerationTimeLimit;
			const decelerationTimeLimit = scope.targetDecelerationTimeLimit;

			const vcruising = self.vCruisingCalculator.calculate((displacement / time), time, accelerationTimeLimit, decelerationTimeLimit);

			scope.vcruising = vcruising;
		}

	}
}

// })();
