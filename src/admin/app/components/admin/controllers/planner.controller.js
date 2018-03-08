/*
* @Author: 
* @Date:   2017-05-19 15:12:22
* @Last Modified by:   Gezzy Ramos
* @Last Modified time: 2017-09-19 16:40:21
*/
(function () {
	'use strict';

	angular.module('xpd.admin').controller('PlannerController', plannerController);

	plannerController.$inject = ['$scope', 'operationDataFactory', 'dialogFactory', 'vCruisingCalculator'];

	function plannerController($scope, operationDataFactory, dialogFactory, vCruisingCalculator) {

		var vm = this;

		$scope.dados = {
			settings: null,
			timeSlices: null
		};

		$scope.operationData = operationDataFactory.operationData;

		vm.actionSelectActivityToPlan = actionSelectActivityToPlan;
		vm.selectActivityOnInit = selectActivityOnInit;
		vm.actionButtonApplyTrip = actionButtonApplyTrip;
		vm.actionButtonApplyConn = actionButtonApplyConn;
		vm.sumTripConnduration = sumTripConnduration;

		// operationDataFactory.addEventListener('plannerController', 'setOnTimeSlicesChangeListener', loadTimeSlice);
		// operationDataFactory.addEventListener('plannerController', 'setOnTimeSlicesListener', loadTimeSlice);
		// operationDataFactory.addEventListener('plannerController', 'setOnNoTimeSlicesListener', loadTimeSlice);

		// operationDataFactory.addEventListener('plannerController', 'setOnVtargetsChangeListener', loadOperationStates);
		// operationDataFactory.addEventListener('plannerController', 'setOnInitVtargetListener', loadOperationStates);
		// operationDataFactory.addEventListener('plannerController', 'setOnNoVtargetListener', loadOperationStates);
		// operationDataFactory.addEventListener('plannerController', 'setOnOperationVtargetsReadyListener', loadOperationStates);

		function startWatching() {
			vm.timeSlicesContext = $scope.$watch('operationData.timeSlicesContext', loadTimeSlice, true);
			vm.stateContext = $scope.$watch('operationData.stateContext', loadOperationStates, true);
			vm.vtargetContext = $scope.$watch('operationData.vtargetContext', loadOperationStates, true);
		}

		function stopWatching() {
			vm.timeSlicesContext && vm.timeSlicesContext();
			vm.stateContext && vm.stateContext();
			vm.vtargetContext && vm.vtargetContext();
		}

		startWatching();

		loadOperationStates();
		loadTimeSlice();

		function loadTimeSlice() {

			if (!$scope.operationData.timeSlicesContext || !$scope.operationData.timeSlicesContext.timeSlices) {
				$scope.dados.timeSlices = null;
				return;
			}

			$scope.dados.timeSlices = angular.copy($scope.operationData.timeSlicesContext.timeSlices);
		}

		function loadOperationStates() {

			if (!$scope.operationData.vtargetContext ||
				!$scope.operationData.stateContext ||
				!$scope.operationData.vtargetContext.vTargetPercentages ||
				!$scope.operationData.stateContext.operationStates) {

				$scope.dados.settings = null;
				return;
			}

			for (var i in $scope.operationData.stateContext.operationStates) {
				var stateName = i;
				var state = $scope.operationData.stateContext.operationStates[i];

				for (var j in state.calcVREParams) {
					var eventType = j;
					var param = state.calcVREParams[j];

					if (eventType != 'TIME')
						setAllActivitiesParams(stateName, state, eventType, param, state.stateType);

				}
			}

		}

		function setAllActivitiesParams(stateName, state, eventType, params, stateType) {

			if ($scope.dados.settings == null) {
				$scope.dados.settings = {};
			}

			if ($scope.dados.settings[stateName] == null) {
				$scope.dados.settings[stateName] = {};
			}

			if ($scope.dados.settings[stateName][eventType] == null) {
				$scope.dados.settings[stateName][eventType] = {

					label: stateType + ' [' + eventType + ']',

					stateName: stateName,
					stateType: state.calcVREParams[eventType].type,
					eventType: eventType,

					optimumAccelerationTimeLimit: +params.accelerationTimeLimit,
					targetAccelerationTimeLimit: +params.accelerationTimeLimit * +$scope.operationData.vtargetContext.vTargetPercentages[stateName][eventType].accelerationTimeLimitPercentage,

					optimumDecelerationTimeLimit: +params.decelerationTimeLimit,
					targetDecelerationTimeLimit: +params.decelerationTimeLimit * +$scope.operationData.vtargetContext.vTargetPercentages[stateName][eventType].decelerationTimeLimitPercentage,

					optimumSafetySpeedLimit: +params.safetySpeedLimit,
					targetSafetySpeedLimit: +params.safetySpeedLimit * +$scope.operationData.vtargetContext.vTargetPercentages[stateName][eventType].safetySpeedLimitPercentage,

					optimumSpeed: +params.voptimum,
					targetSpeed: +params.voptimum * +$scope.operationData.vtargetContext.vTargetPercentages[stateName][eventType].voptimumPercentage
				};
			}

			if (eventType == 'TRIP') {

				var displacement;

				if (stateName == 'casing') {
					displacement = $scope.operationData.operationContext.currentOperation.averageSectionLength;
				} else {
					displacement = $scope.operationData.operationContext.currentOperation.averageStandLength;
				}

				$scope.dados.settings[stateName][eventType].displacement = displacement;

				var targetSpeed = $scope.dados.settings[stateName][eventType].targetSpeed;

				var time = (displacement / targetSpeed) - $scope.operationData.operationContext.currentOperation.inSlips;

				var accelerationTimeLimit = $scope.dados.settings[stateName][eventType].targetAccelerationTimeLimit;
				var decelerationTimeLimit = $scope.dados.settings[stateName][eventType].targetDecelerationTimeLimit;

				var vcruising = vCruisingCalculator.calculate( (displacement/time) , time, accelerationTimeLimit, decelerationTimeLimit);

				$scope.dados.settings[stateName][eventType].vcruising = vcruising;

				$scope.dados.settings[stateName][eventType].targetTime = displacement / $scope.dados.settings[stateName][eventType].targetSpeed;
				$scope.dados.settings[stateName][eventType].optimumTime = displacement / $scope.dados.settings[stateName][eventType].optimumSpeed;
			} else {

				$scope.dados.settings[stateName][eventType].targetTime = 1 / $scope.dados.settings[stateName][eventType].targetSpeed;
				$scope.dados.settings[stateName][eventType].optimumTime = 1 / $scope.dados.settings[stateName][eventType].optimumSpeed;
			}

		}

		function actionSelectActivityToPlan(stateName, eventType) {

			stopWatching();

			$scope.dados.selectedEventType = null;

			$scope.dados.leftPercentage = 0;

			$scope.dados.selectedState = stateName;
			$scope.dados.selectedEventType = eventType;

		}

		function selectActivityOnInit(index, stateName, eventType) {
			if(index == 0)
				actionSelectActivityToPlan(stateName, eventType);
		}

		function actionButtonApply() {

			var eventData = {};

			eventData.stateKey = $scope.dados.selectedState;
			eventData.eventKey = $scope.dados.selectedEventType;

			eventData.voptimumPercentage = +$scope.dados.settings[$scope.dados.selectedState][$scope.dados.selectedEventType].targetSpeed / +$scope.dados.settings[$scope.dados.selectedState][$scope.dados.selectedEventType].optimumSpeed;
			eventData.accelerationTimeLimitPercentage = +$scope.dados.settings[$scope.dados.selectedState][$scope.dados.selectedEventType].targetAccelerationTimeLimit / +$scope.dados.settings[$scope.dados.selectedState][$scope.dados.selectedEventType].optimumAccelerationTimeLimit;
			eventData.decelerationTimeLimitPercentage = +$scope.dados.settings[$scope.dados.selectedState][$scope.dados.selectedEventType].targetDecelerationTimeLimit / +$scope.dados.settings[$scope.dados.selectedState][$scope.dados.selectedEventType].optimumDecelerationTimeLimit;
			eventData.safetySpeedLimitPercentage = +$scope.dados.settings[$scope.dados.selectedState][$scope.dados.selectedEventType].targetSafetySpeedLimit / +$scope.dados.settings[$scope.dados.selectedState][$scope.dados.selectedEventType].optimumSafetySpeedLimit;
			eventData.stateType = $scope.dados.settings[$scope.dados.selectedState][$scope.dados.selectedEventType].stateType;

			operationDataFactory.emitUpdateContractParams(eventData);

		}

		function actionButtonApplyConn() {
			dialogFactory.showConfirmDialog('Are you sure you want to apply this change?', function () {

				try {

					$scope.dados.timeSlices.tripin.map(addOperationInfo);
					$scope.dados.timeSlices.tripout.map(addOperationInfo);

					function addOperationInfo(slice) {
						slice.operation = {
							id: $scope.operationData.operationContext.currentOperation.id
						};
						return slice;
					}

					operationDataFactory.emitUpdateTimeSlices($scope.dados.timeSlices);

				} catch (e) {

				}

				actionButtonApply();

			});

		}

		function actionButtonApplyTrip() {

			dialogFactory.showConfirmDialog('Are you sure you want to apply this change?', function () {

				operationDataFactory.emitUpdateInSlips($scope.operationData.operationContext.currentOperation.inSlips);
				actionButtonApply();

			});


		}

		function sumTripConnduration(stateSettings) {

			var tripDuration = stateSettings.TRIP.targetTime * 1000;
			var connDuration = stateSettings.CONN.targetTime * 1000;

			return tripDuration + connDuration;
		}

	}

})();
