(function () {
	'use strict',

	angular.module('xpd.tracking').controller('TrackingController', trackingController);

	trackingController.$inject = ['$scope', '$interval', '$timeout', '$aside', '$uibModal', 'operationDataFactory', 'dialogFactory', '$filter'];

	function trackingController($scope, $interval, $timeout, $aside, $uibModal, operationDataFactory, dialogFactory, $filter) {

		var vm = this;

		$interval(circulateShiftList, 10000);

		$scope.dados = {
			connectionTimes: [],
			tripTimes: [],
			currentTime: new Date()
		};

		$scope.flags = {
			showGo: false,
			showSlowDown: false,
			showUnreachable: false,

			//ADMIN ONLY
			failuresMenuOpen: false,

			hasAlarm: false,
			hasMessage: false
		};

		$scope.acknowledgement = {
			timeAlarms: [],
			depthAlarms: []
		};


		operationDataFactory.operationData = [];

		$scope.operationData = operationDataFactory.operationData;

		vm.actionButtonStartOperation = actionButtonStartOperation;
		vm.actionButtonFinishOperation = actionButtonFinishOperation;
		vm.actionButtonStartCementation = actionButtonStartCementation;
		vm.actionButtonStopCementation = actionButtonStopCementation;
		vm.flashGoDiv = flashGoDiv;

		/**
		 * ADMIN ONLY
		 */
		vm.actionClickFailuresButton = actionClickFailuresButton;
		vm.actionClickLessonsLearnedButton = actionClickLessonsLearnedButton;

		//* MODAL ACTIONS *//
		vm.actionOpenAlarmConfirmationModal = actionOpenAlarmConfirmationModal;
		vm.actionButtonCloseAlarmsAcknowledgementModal = actionButtonCloseAlarmsAcknowledgementModal;
		vm.actionButtonUnconfirmAcknowledgement = actionButtonUnconfirmAcknowledgement;
		vm.actionButtonConfirmAcknowledgement = actionButtonConfirmAcknowledgement;

		//* ASSEMBLY *//
		vm.actionButtonStartMakeUp = actionButtonStartMakeUp;
		vm.actionButtonStartLayDown = actionButtonStartLayDown;
		vm.actionButtonFinishMakeUp = actionButtonFinishMakeUp;
		vm.actionButtonFinishLayDown = actionButtonFinishLayDown;
		vm.actionButtonFinishDurationAlarm = actionButtonFinishDurationAlarm;

		//* ALARM *//
		vm.finishDurationAlarm = finishDurationAlarm;

		buildEventStruture();
		operationDataFactory.addEventListener('trackingController', 'setOnEventChangeListener', buildEventStruture);
		operationDataFactory.addEventListener('trackingController', 'setOnCurrentEventListener', buildEventStruture);
		operationDataFactory.addEventListener('trackingController', 'setOnNoCurrentEventListener', buildEventStruture);
		operationDataFactory.addEventListener('trackingController', 'setOnEventLogUpdateListener', buildEventStruture);
		operationDataFactory.addEventListener('trackingController', 'setOnWaitEventListener', buildEventStruture);

		buildTimeSlicesStruture();
		operationDataFactory.addEventListener('trackingController', 'setOnTimeSlicesChangeListener', buildTimeSlicesStruture);
		operationDataFactory.addEventListener('trackingController', 'setOnTimeSlicesListener', buildTimeSlicesStruture);
		operationDataFactory.addEventListener('trackingController', 'setOnNoTimeSlicesListener', buildTimeSlicesStruture);

		operationDataFactory.addEventListener('trackingController', 'setOnAboveSpeedLimitListener', onAboveSpeedLimit);
		operationDataFactory.addEventListener('trackingController', 'setOnUnreachableTargetListener', onUnreachableTarget);

		removeTeamsFromShift();
		operationDataFactory.addEventListener('trackingController', 'setOnShiftListener', removeTeamsFromShift);

		buildAcknowledgementList();
		operationDataFactory.addEventListener('trackingController', 'setOnAlarmsChangeListener', buildAcknowledgementList);
		operationDataFactory.addEventListener('trackingController', 'setOnCurrentAlarmsListener', buildAcknowledgementList);
		operationDataFactory.addEventListener('trackingController', 'setOnNoCurrentAlarmsListener', buildAcknowledgementList);
		operationDataFactory.addEventListener('trackingController', 'setOnSpeedRestrictionAlarmListener', buildAcknowledgementList);
		operationDataFactory.addEventListener('trackingController', 'setOnDurationAlarmListener', buildAcknowledgementList);
		operationDataFactory.addEventListener('trackingController', 'setOnNoCurrentAlarmListener', buildAcknowledgementList);
		operationDataFactory.addEventListener('trackingController', 'setOnExpectedAlarmChangeListener', buildAcknowledgementList);


		function actionButtonStartOperation(operation) {
			dialogFactory.showConfirmDialog('Start current operation?', function () {
				operationDataFactory.emitStartCurrentOperation(operation);
			});
		}

		function actionButtonFinishOperation() {
			dialogFactory.showConfirmDialog('Finish running operation?', operationDataFactory.emitFinishRunningOperation);
		}

		function actionButtonStartCementation(currentBitDepth) {

			var operationEndBitDepth = $scope.operationData.operationContext.currentOperation.endBitDepth;

			if (operationEndBitDepth > currentBitDepth)
				dialogFactory.showCriticalDialog({
					templateHtml: '<b>Important !!!</b> The current bit depth is about <b>' + currentBitDepth.toFixed(2) + '</b> Please make sure the entire casing string is bellow shoe depth due to start cemementing.'
				}, startCementation);
			else
				startCementation();
		}

		function startCementation() {
			dialogFactory.showConfirmDialog('Are you sure you want to start the Cementing Procedure? This action cannot be undone.', operationDataFactory.emitStartCementation);
		}

		function actionClickFailuresButton() {
			$uibModal.open({
				animation: true,
				keyboard: false,
				backdrop: 'static',
				size: 'modal-sm',
				windowClass: 'xpd-operation-modal',
				templateUrl: 'app/components/admin/views/modal/failures.modal.html',
				controller: 'FailuresController as fController'
			});
		}

		function actionClickLessonsLearnedButton() {
			$uibModal.open({
				animation: true,
				keyboard: false,
				backdrop: 'static',
				size: 'modal-sm',
				windowClass: 'xpd-operation-modal',
				templateUrl: 'app/components/admin/views/modal/lesson-learned.modal.html',
				controller: 'LessonLearnedController as llController'
			});
		}

		function actionButtonStopCementation() {
			dialogFactory.showCriticalDialog('Are you sure you want to stop the Cementing Procedure? This action cannot be undone.', operationDataFactory.emitStopCementation);
		}

		function circulateShiftList() {
			if ($scope.operationData.shiftContext.onShift != null && $scope.operationData.shiftContext.onShift.length > 1) {
				$scope.operationData.shiftContext.onShift.push($scope.operationData.shiftContext.onShift.shift());
			}
		}

		function removeTeamsFromShift() {
			if ($scope.operationData.shiftContext != null && $scope.operationData.shiftContext.onShift != null) {
				$scope.operationData.shiftContext.onShift = $scope.operationData.shiftContext.onShift.filter(filterMembersOnly);
			}
		}

		function buildAcknowledgementList() {

			$scope.acknowledgement.depthAlarms = [];
			$scope.acknowledgement.timeAlarms = [];

			$scope.flags.hasAlarm = false;
			$scope.flags.hasMessage = false;

			var acknowledgements = $scope.operationData.alarmContext.acknowledgementList;

			for (var i in acknowledgements) {
				var alarm = acknowledgements[i].alarm;

				if (alarm.alarmType == 'depth') {
					if (!acknowledgements[i].acknowledgeTime)
						$scope.flags.hasAlarm = true;

					$scope.acknowledgement.depthAlarms.push(acknowledgements[i]);

				} else {
					if (!acknowledgements[i].acknowledgeTime)
						$scope.flags.hasMessage = true;

					$scope.acknowledgement.timeAlarms.push(acknowledgements[i]);
				}
			}
		}

		function filterMembersOnly(shift) {
			return shift.member.function.id != 1;
		}

		function actionOpenAlarmConfirmationModal() {
			$scope.$uibModalInstance = $aside.open({
				templateUrl: './app/components/driller/driller-alarms-acknowledgement/driller-alarms-acknowledgement.modal.html',
				placement: 'left',
				scope: $scope,
				backdrop: false,
				windowClass: 'driller-aside-window-class',
				size: 'sm'
			});
		}

		function actionButtonConfirmAcknowledgement(acknowledgement) {
			dialogFactory.showConfirmDialog('Confirm Acknowledgement?', function () {
				operationDataFactory.emitConfirmAcknowledgement(acknowledgement);
			});
		}

		function actionButtonUnconfirmAcknowledgement(acknowledgement) {
			dialogFactory.showConfirmDialog('Unconfirm Acknowledgement?', function () {
				operationDataFactory.emitUnconfirmAcknowledgement(acknowledgement);
			});
		}

		function actionButtonStartMakeUp() {
			// console.log('actionButtonStartMakeUp()');
			operationDataFactory.emitStartMakeUp();
		}

		function actionButtonStartLayDown() {
			// console.log('actionButtonStartLayDown()');
			operationDataFactory.emitStartLayDown();
		}

		function actionButtonFinishMakeUp() {
			// console.log('actionButtonFinishMakeUp()');
			operationDataFactory.emitFinishMakeUp();
		}

		function actionButtonFinishLayDown() {
			// console.log('actionButtonFinishLayDown()');
			operationDataFactory.emitFinishLayDown();
		}

		function actionButtonFinishDurationAlarm() {
			operationDataFactory.emitFinishDurationAlarm();
		}

		function actionButtonCloseAlarmsAcknowledgementModal() {
			$scope.$uibModalInstance.close();
		}

		function onAboveSpeedLimit() {

			if ($scope.flags.showSlowDown == true)
				return;

			$scope.flags.showSlowDown = true;

			$timeout(function () {
				$scope.flags.showSlowDown = false;
			}, 1500);
		}

		function onUnreachableTarget() {
			/*
             if ($scope.flags.showUnreachable == true)
             return;

             $scope.flags.showUnreachable = true;

             $timeout(function() {
             $scope.flags.showUnreachable = false;
             }, 500);
             */
		}

		function flashGoDiv() {
			$scope.flags.showGo = true;

			$timeout(function () {
				$scope.flags.showGo = false;
			}, 500);
		}

		function buildEventStruture() {

			var eventContext = $scope.operationData.eventContext;

			if (eventContext.currentEvent != null && eventContext.currentEvent.eventType == 'WAIT') {

				$scope.dados.timeBlocks = [{
					name: 'Waiting for Readings',
					percentage: 100
				}];

			}

		}

		function buildTimeSlicesStruture() {

			var timeSlicesContext = $scope.operationData.timeSlicesContext;

			if (timeSlicesContext.currentTimeSlices != null) {

				try {
					timeSlicesContext.currentTimeSlices = timeSlicesContext.currentTimeSlices.map(function (ts) {

						if (ts.enabled == false) {
							ts.enabled = false;
						} else {
							ts.enabled = true;
						}

						return ts;
					});
				} catch (_ex) {
					console.error(_ex);
				}

				timeSlicesContext.currentTimeSlices = ($filter('filter')(timeSlicesContext.currentTimeSlices, { enabled: true }));

				$scope.dados.timeBlocks = angular.copy(timeSlicesContext.currentTimeSlices);

			} else {
				$scope.dados.timeBlocks = [{
					name: 'Undefined',
					percentage: 100,
					timeOrder: 1
				}];
			}

		}

		function finishDurationAlarm() {
			operationDataFactory.emitFinishDurationAlarm();
		}

	}

})();
