/*
* @Author:
* @Date:   2017-05-19 15:12:22
* @Last Modified by:   Gezzy Ramos
* @Last Modified time: 2017-09-19 16:40:21
*/
(function() {
	'use strict';

	angular.module('xpd.admin').controller('PlannerController', plannerController);

	plannerController.$inject = ['$scope', '$filter', 'operationDataFactory', 'dialogFactory', 'vCruisingCalculator'];

	function plannerController($scope, $filter, operationDataFactory, dialogFactory, vCruisingCalculator) {

		const vm = this;

		$scope.dados = {
			settings: null,
			timeSlices: null,
		};

		operationDataFactory.openConnection([]).then(function(response) {
			operationDataFactory = response;
			$scope.operationData = operationDataFactory.operationData;

			startWatching();

			loadOperationStates();
			loadTimeSlice();
		});

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

			for (const i in $scope.operationData.stateContext.operationStates) {
				const stateName = i;
				const state = $scope.operationData.stateContext.operationStates[i];

				for (const j in state.calcVREParams) {
					const eventType = j;
					const param = state.calcVREParams[j];

					if (eventType != 'TIME') {
						setAllActivitiesParams(stateName, state, eventType, param, state.stateType);
					}

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

					stateName,
					stateType: state.calcVREParams[eventType].type,
					eventType,

					optimumAccelerationTimeLimit: +params.accelerationTimeLimit,
					targetAccelerationTimeLimit: +params.accelerationTimeLimit * +$scope.operationData.vtargetContext.vTargetPercentages[stateName][eventType].accelerationTimeLimitPercentage,

					optimumDecelerationTimeLimit: +params.decelerationTimeLimit,
					targetDecelerationTimeLimit: +params.decelerationTimeLimit * +$scope.operationData.vtargetContext.vTargetPercentages[stateName][eventType].decelerationTimeLimitPercentage,

					optimumSafetySpeedLimit: +params.safetySpeedLimit,
					targetSafetySpeedLimit: +params.safetySpeedLimit * +$scope.operationData.vtargetContext.vTargetPercentages[stateName][eventType].safetySpeedLimitPercentage,

					optimumSpeed: +params.voptimum,
					targetSpeed: +params.voptimum * +$scope.operationData.vtargetContext.vTargetPercentages[stateName][eventType].voptimumPercentage,
				};
			}

			if (eventType == 'TRIP') {

				let displacement;

				if (stateName == 'casing') {
					displacement = $scope.operationData.operationContext.currentOperation.averageSectionLength;
				} else {
					displacement = $scope.operationData.operationContext.currentOperation.averageStandLength;
				}

				$scope.dados.settings[stateName][eventType].displacement = displacement;

				const targetSpeed = $scope.dados.settings[stateName][eventType].targetSpeed;

				const time = (displacement / targetSpeed) - $scope.operationData.operationContext.currentOperation.inSlips;

				const accelerationTimeLimit = $scope.dados.settings[stateName][eventType].targetAccelerationTimeLimit;
				const decelerationTimeLimit = $scope.dados.settings[stateName][eventType].targetDecelerationTimeLimit;

				const vcruising = vCruisingCalculator.calculate((displacement / time), time, accelerationTimeLimit, decelerationTimeLimit);

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
			if (index == 0) {
				actionSelectActivityToPlan(stateName, eventType);
			}
		}

		function actionButtonApply() {

			const eventData = {};

			eventData.stateKey = $scope.dados.selectedState;
			eventData.eventKey = $scope.dados.selectedEventType;

			eventData.voptimumPercentage = +$scope.dados.settings[$scope.dados.selectedState][$scope.dados.selectedEventType].targetSpeed / +$scope.dados.settings[$scope.dados.selectedState][$scope.dados.selectedEventType].optimumSpeed;
			eventData.accelerationTimeLimitPercentage = +$scope.dados.settings[$scope.dados.selectedState][$scope.dados.selectedEventType].targetAccelerationTimeLimit / +$scope.dados.settings[$scope.dados.selectedState][$scope.dados.selectedEventType].optimumAccelerationTimeLimit;
			eventData.decelerationTimeLimitPercentage = +$scope.dados.settings[$scope.dados.selectedState][$scope.dados.selectedEventType].targetDecelerationTimeLimit / +$scope.dados.settings[$scope.dados.selectedState][$scope.dados.selectedEventType].optimumDecelerationTimeLimit;
			eventData.safetySpeedLimitPercentage = +$scope.dados.settings[$scope.dados.selectedState][$scope.dados.selectedEventType].targetSafetySpeedLimit / +$scope.dados.settings[$scope.dados.selectedState][$scope.dados.selectedEventType].optimumSafetySpeedLimit;
			eventData.stateType = $scope.dados.settings[$scope.dados.selectedState][$scope.dados.selectedEventType].stateType;

			operationDataFactory.emitUpdateContractParams(eventData);

		}

		function prepareTimeSlices(timeSlices) {

			let timeOrder = 1;

			for (const i in timeSlices) {
				const timeSlice = timeSlices[i];

				timeSlice.timeOrder = timeOrder;

				if (timeSlice.percentage > 0) {
					timeOrder++;
				} else {
					timeSlice.enabled = false;
					timeSlice.canDelete = true;
				}

				timeSlice.operation = {
					id: $scope.operationData.operationContext.currentOperation.id,
				};

			}

			return timeSlices;

		}

		function actionButtonApplyConn() {
			dialogFactory.showConfirmDialog('Are you sure you want to apply this change?', function() {

				try {

					$scope.dados.timeSlices.tripin = prepareTimeSlices($scope.dados.timeSlices.tripin);
					// .map(addOperationInfo);
					$scope.dados.timeSlices.tripout = prepareTimeSlices($scope.dados.timeSlices.tripout);
					// .map(addOperationInfo);
					operationDataFactory.emitUpdateTimeSlices($scope.dados.timeSlices);

					$scope.dados.timeSlices.tripin = $filter('filter')($scope.dados.timeSlices.tripin, returnValidTimeSlices);
					$scope.dados.timeSlices.tripout = $filter('filter')($scope.dados.timeSlices.tripout, returnValidTimeSlices);

				} catch (e) {
					//
				}

				actionButtonApply();

			});

		}

		function actionButtonApplyTrip() {

			dialogFactory.showConfirmDialog('Are you sure you want to apply this change?', function() {

				operationDataFactory.emitUpdateInSlips($scope.operationData.operationContext.currentOperation.inSlips);
				actionButtonApply();

			});

		}

		function sumTripConnduration(stateSettings) {

			const tripDuration = stateSettings.TRIP.targetTime * 1000;
			const connDuration = stateSettings.CONN.targetTime * 1000;

			return tripDuration + connDuration;
		}

		function returnValidTimeSlices(timeSlice) {
			return timeSlice.percentage > 0;
		}

	}

})();
