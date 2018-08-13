
import { VCruisingCalculatorService } from '../xpd.calculation/calculation.service';
import './operation-contract-info-table.style.scss';
import template from './operation-contract-info-table.template.html';

export class OperationContractInfoTableDirective {

	public static $inject: string[] = ['vCruisingCalculator'];

	public static Factory(): ng.IDirectiveFactory {
		return (vCruisingCalculator: VCruisingCalculatorService) => new OperationContractInfoTableDirective(vCruisingCalculator);
	}

	// Runs during compile
	public scope = {
		state: '@',
		operation: '=',
		tripUnit: '@',
		connUnit: '@',
		connRequired: '@',
		tripRequired: '@',
		stateId: '@',
		viewOnly: '@',
		contractParams: '=',
		contractForm: '=',
		tripSpeedParams: '=',
		uiPopover: '=',
	};
	public restrict = 'E';
	public template = template;

	constructor(private vCruisingCalculator: VCruisingCalculatorService) { }

	public link: ng.IDirectiveLinkFn = (
		scope: any,
		element: ng.IAugmentedJQuery,
		attrs: ng.IAttributes,
		ctrl: any,
	) => {

		const self = this;

		if (attrs.safetyBased === true || attrs.safetyBased === 'true') {
			scope.safetyBased = true;

			scope.$watch('contractParams.' + scope.stateId + 'TripSpeed.safetySpeedLimit', function (safetySpeedLimit) {
				try {
					scope.contractParams[scope.stateId + 'TripSpeed'].voptimum = safetySpeedLimit * 0.9;
					scope.contractParams[scope.stateId + 'TripSpeed'].vpoor = safetySpeedLimit * 0.7;
					scope.contractParams[scope.stateId + 'TripSpeed'].vstandard = safetySpeedLimit * 0.8;
				} catch (e) { }
			});

		} else {
			scope.safetyBased = false;
		}

		scope.calculateVCruising = function () {

			try {
				// var displacement = (scope.stateId != 'casing') ? scope.operation.averageStandLength : scope.operation.averageSectionLength;

				let displacement;

				switch (scope.stateId) {
					case 'inBreakDPInterval':
						displacement = scope.operation.averageDPLength || 0;
						scope.label = 'Missing Average DP Length';
						break;
					case 'casing':
						displacement = scope.operation.averageSectionLength || 0;
						scope.label = 'Missing Average Casing Stand Length';
						break;
					default:
						displacement = scope.operation.averageStandLength || 0;
						scope.label = 'Missing Average Stand Length';
				}

				scope.displacement = displacement;

				let targetSpeed = scope.contractParams[scope.stateId + 'TripSpeed'].voptimum / 3600;
				const time = Math.abs((displacement / targetSpeed) - scope.operation.inSlips);

				const accelerationTimeLimit = scope.contractParams[scope.stateId + 'TripSpeed'].accelerationTimeLimit;
				const decelerationTimeLimit = scope.contractParams[scope.stateId + 'TripSpeed'].decelerationTimeLimit;

				targetSpeed = displacement / time;

				// if (time < (accelerationTimeLimit + decelerationTimeLimit)) {

				// 	var tempAcceleration = accelerationTimeLimit / (accelerationTimeLimit + decelerationTimeLimit);
				// 	var tempDeceleration = decelerationTimeLimit / (accelerationTimeLimit + decelerationTimeLimit);

				// 	accelerationTimeLimit = tempAcceleration * time;
				// 	decelerationTimeLimit = tempDeceleration * time;

				// 	scope.contractParams[scope.stateId + 'TripSpeed'].accelerationTimeLimit = accelerationTimeLimit;
				// 	scope.contractParams[scope.stateId + 'TripSpeed'].decelerationTimeLimit = decelerationTimeLimit;

				// }

				const vcruising = self.vCruisingCalculator.calculate(targetSpeed, time, accelerationTimeLimit, decelerationTimeLimit) * 3600;

				scope.contractParams[scope.stateId + 'TripSpeed'].vcruising = +vcruising.toFixed(2);

				return vcruising;

			} catch (e) { }
		};

		scope.$watchGroup(['operation.averageStandLength',
			'operation.averageSectionLength',
			'operation.inSlips',
		], scope.calculateVCruising, true);

		scope.$watch('operation.safetySpeedLimit', scope.ensureTripSpeedLimit, true);

		scope.ensureTripSpeedLimit = function () {
			if (scope.contractParams[scope.stateId + 'TripSpeed'].safetySpeedLimit > scope.operation.safetySpeedLimit) {
				scope.contractParams[scope.stateId + 'TripSpeed'].safetySpeedLimit = scope.operation.safetySpeedLimit;
			}
		};

		// vCruisingCalculator

		element[0].className = element[0].className + ' table-contract-info';
	}
}

// })();
