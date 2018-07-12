(function() {
	'use strict';

	angular.module('xpd.contract-param')
		.directive('operationContractInfoTable', operationContractInfoTable);

	operationContractInfoTable.$inject = ['vCruisingCalculator'];

	function operationContractInfoTable(vCruisingCalculator) {
		// Runs during compile
		return {
			scope: {
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
			},
			restrict: 'E',
			templateUrl: '../xpd-resources/ng/xpd.contract-param/operation-contract-info-table.template.html',
			link,
		};

		function link(scope, element, attrs) {

			if (attrs.safetyBased == true || attrs.safetyBased == 'true') {
				scope.safetyBased = true;

				scope.$watch('contractParams.' + scope.stateId + 'TripSpeed.safetySpeedLimit', function(safetySpeedLimit) {
					try {
						scope.contractParams[scope.stateId + 'TripSpeed'].voptimum = safetySpeedLimit * 0.9;
						scope.contractParams[scope.stateId + 'TripSpeed'].vpoor = safetySpeedLimit * 0.7;
						scope.contractParams[scope.stateId + 'TripSpeed'].vstandard = safetySpeedLimit * 0.8;
					} catch (e) {}
				});

			} else {
				scope.safetyBased = false;
			}

			scope.calculateVCruising = function() {

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
					let time = Math.abs((displacement / targetSpeed) - scope.operation.inSlips);

					let accelerationTimeLimit = scope.contractParams[scope.stateId + 'TripSpeed'].accelerationTimeLimit;
					let decelerationTimeLimit = scope.contractParams[scope.stateId + 'TripSpeed'].decelerationTimeLimit;

					targetSpeed = displacement / time;

					// if (time < (accelerationTimeLimit + decelerationTimeLimit)) {

					// 	var tempAcceleration = accelerationTimeLimit / (accelerationTimeLimit + decelerationTimeLimit);
					// 	var tempDeceleration = decelerationTimeLimit / (accelerationTimeLimit + decelerationTimeLimit);

					// 	accelerationTimeLimit = tempAcceleration * time;
					// 	decelerationTimeLimit = tempDeceleration * time;

					// 	scope.contractParams[scope.stateId + 'TripSpeed'].accelerationTimeLimit = accelerationTimeLimit;
					// 	scope.contractParams[scope.stateId + 'TripSpeed'].decelerationTimeLimit = decelerationTimeLimit;

					// }

					let vcruising = vCruisingCalculator.calculate(targetSpeed, time, accelerationTimeLimit, decelerationTimeLimit) * 3600;

					scope.contractParams[scope.stateId + 'TripSpeed'].vcruising = +vcruising.toFixed(2);

					return vcruising;

				} catch (e) {}
			};

			scope.$watchGroup(['operation.averageStandLength',
				'operation.averageSectionLength',
				'operation.inSlips',
			], scope.calculateVCruising, true);

			scope.$watch('operation.safetySpeedLimit', scope.ensureTripSpeedLimit, true);

			scope.ensureTripSpeedLimit = function() {
				if (scope.contractParams[scope.stateId + 'TripSpeed'].safetySpeedLimit > scope.operation.safetySpeedLimit) {
					scope.contractParams[scope.stateId + 'TripSpeed'].safetySpeedLimit = scope.operation.safetySpeedLimit;
				}
			};

			// vCruisingCalculator

			element[0].className = element[0].className + ' table-contract-info';
		}
	}

})();
