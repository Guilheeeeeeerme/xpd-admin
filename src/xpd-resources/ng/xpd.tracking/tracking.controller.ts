import * as angular from 'angular';
import { IModalService } from 'angular-ui-bootstrap';
import failureModalTemplate from 'app/components/admin/views/modal/failures.modal.html';
import lessonLearnedModalTemplate from 'app/components/admin/views/modal/lesson-learned.modal.html';
import { OperationDataFactory } from '../xpd.communication/operation-server-data.factory';
import { DialogFactory } from '../xpd.dialog/xpd.dialog.factory';
import { XPDIntervalService, XPDTimeoutService } from '../xpd.timers/xpd-timers.service';
// (function() {
// 	'use strict',

// 	angular.module('xpd.tracking').controller('TrackingController', trackingController);

// 	trackingController.$inject = ['$scope', '$xpdInterval', '$xpdTimeout', '$uibModal', 'operationDataFactory', 'dialogFactory', '$filter'];

export class TrackingController {

	public operationDataFactory: any;

	public static $inject: string[] = [
		'$scope',
		'$xpdInterval',
		'$xpdTimeout',
		'$uibModal',
		'operationDataFactory',
		'dialogFactory',
	];

	public actionButtonStartOperation: (operation: any) => void;
	public actionButtonFinishOperation: () => void;
	public actionButtonStartCementation: () => void;
	public actionButtonStopCementation: () => void;
	public flashGoDiv: () => void;
	public actionClickFailuresButton: () => void;
	public actionClickLessonsLearnedButton: () => void;
	public actionButtonCloseAlarmsAcknowledgementModal: () => void;
	public actionButtonUnconfirmAcknowledgement: (acknowledgement: any) => void;
	public actionButtonConfirmAcknowledgement: (acknowledgement: any) => void;
	public actionButtonStartMakeUp: () => void;
	public actionButtonStartLayDown: () => void;
	public actionButtonFinishMakeUp: () => void;
	public actionButtonFinishLayDown: () => void;
	public actionButtonFinishDurationAlarm: () => void;
	public finishDurationAlarm: () => void;

	// constructor(
	// 	$scope: any,
	// 	$uibModalInstance: IModalServiceInstance,
	// 	lessonLearnedSetupAPIService: LessonLearnedSetupAPIService,
	// 	selectedLessonLearned: any,
	// 	modalSuccessCallback: any,
	// 	modalErrorCallback: any) {

	constructor(
		$scope: any,
		$xpdInterval: XPDIntervalService,
		$xpdTimeout: XPDTimeoutService,
		$uibModal: IModalService,
		operationDataFactory: OperationDataFactory,
		dialogFactory: DialogFactory) {

		const vm = this;

		$scope.$on('$destroy', destroy);

		const circulateShiftListInterval = $xpdInterval.run(circulateShiftList, 10000, $scope);

		$scope.dados = {
			connectionTimes: [],
			tripTimes: [],

			bitDepthByEvents: [],
			connectionEvents: [],
			tripEvents: [],
			timeEvents: [],
			currentTime: new Date(),
		};

		$scope.flags = {
			showGo: false,
			showSlowDown: false,
			showUnreachable: false,

			// ADMIN ONLY
			failuresMenuOpen: false,

			hasAlarm: false,
			hasMessage: false,

			// showDMEC: !!JSON.parse(localStorage.getItem('xpd.admin.tracking.openDmecAsDefault'))
		};

		$scope.acknowledgement = {
			timeAlarms: [],
			depthAlarms: [],
		};

		operationDataFactory.openConnection([]).then(function (response) {
			vm.operationDataFactory = response;
			// TODO: adaptacao as any
			$scope.operationData = (operationDataFactory as any).operationData;

			buildEventStruture();
			buildTimeSlicesStruture();
			removeTeamsFromShift();
			buildAcknowledgementList();
		});

		vm.actionButtonStartOperation = actionButtonStartOperation;
		vm.actionButtonFinishOperation = actionButtonFinishOperation;
		vm.actionButtonStartCementation = actionButtonStartCementation;
		vm.actionButtonStopCementation = actionButtonStopCementation;
		vm.flashGoDiv = flashGoDiv;
		// vm.changeTrackingContent = changeTrackingContent;

		/**
		 * ADMIN ONLY
		 */
		vm.actionClickFailuresButton = actionClickFailuresButton;
		vm.actionClickLessonsLearnedButton = actionClickLessonsLearnedButton;

		// * MODAL ACTIONS *//
		vm.actionButtonCloseAlarmsAcknowledgementModal = actionButtonCloseAlarmsAcknowledgementModal;
		vm.actionButtonUnconfirmAcknowledgement = actionButtonUnconfirmAcknowledgement;
		vm.actionButtonConfirmAcknowledgement = actionButtonConfirmAcknowledgement;

		// * ASSEMBLY *//
		vm.actionButtonStartMakeUp = actionButtonStartMakeUp;
		vm.actionButtonStartLayDown = actionButtonStartLayDown;
		vm.actionButtonFinishMakeUp = actionButtonFinishMakeUp;
		vm.actionButtonFinishLayDown = actionButtonFinishLayDown;
		vm.actionButtonFinishDurationAlarm = actionButtonFinishDurationAlarm;

		// * ALARM *//
		vm.finishDurationAlarm = finishDurationAlarm;

		// buildEventStruture();
		operationDataFactory.addEventListener('trackingController', 'setOnEventChangeListener', buildEventStruture);
		operationDataFactory.addEventListener('trackingController', 'setOnCurrentEventListener', buildEventStruture);
		operationDataFactory.addEventListener('trackingController', 'setOnNoCurrentEventListener', buildEventStruture);
		operationDataFactory.addEventListener('trackingController', 'setOnEventLogUpdateListener', buildEventStruture);
		operationDataFactory.addEventListener('trackingController', 'setOnWaitEventListener', buildEventStruture);

		// buildTimeSlicesStruture();
		operationDataFactory.addEventListener('trackingController', 'setOnTimeSlicesChangeListener', buildTimeSlicesStruture);
		operationDataFactory.addEventListener('trackingController', 'setOnTimeSlicesListener', buildTimeSlicesStruture);
		operationDataFactory.addEventListener('trackingController', 'setOnNoTimeSlicesListener', buildTimeSlicesStruture);

		operationDataFactory.addEventListener('trackingController', 'setOnAboveSpeedLimitListener', onAboveSpeedLimit);
		operationDataFactory.addEventListener('trackingController', 'setOnUnreachableTargetListener', onUnreachableTarget);

		// removeTeamsFromShift();
		operationDataFactory.addEventListener('trackingController', 'setOnShiftListener', removeTeamsFromShift);

		// buildAcknowledgementList();
		operationDataFactory.addEventListener('trackingController', 'setOnAlarmsChangeListener', buildAcknowledgementList);
		operationDataFactory.addEventListener('trackingController', 'setOnCurrentAlarmsListener', buildAcknowledgementList);
		operationDataFactory.addEventListener('trackingController', 'setOnNoCurrentAlarmsListener', buildAcknowledgementList);
		operationDataFactory.addEventListener('trackingController', 'setOnSpeedRestrictionAlarmListener', buildAcknowledgementList);
		operationDataFactory.addEventListener('trackingController', 'setOnDurationAlarmListener', buildAcknowledgementList);
		operationDataFactory.addEventListener('trackingController', 'setOnNoCurrentAlarmListener', buildAcknowledgementList);
		operationDataFactory.addEventListener('trackingController', 'setOnExpectedAlarmChangeListener', buildAcknowledgementList);

		/**
		 * Quando sair do controller
		 */
		function destroy() {
			if (circulateShiftListInterval) {
				$xpdInterval.cancel(circulateShiftListInterval);
			}
		}

		function actionButtonStartOperation(operation) {
			dialogFactory.showConfirmDialog('Start current operation?', function () {
				vm.operationDataFactory.emitStartCurrentOperation(operation);
			});
		}

		function actionButtonFinishOperation() {
			dialogFactory.showConfirmDialog('Finish running operation?', vm.operationDataFactory.emitFinishRunningOperation);
		}

		function actionButtonStartCementation() {

			const operationEndBitDepth = $scope.operationData.operationContext.currentOperation.endBitDepth;
			const currentBitDepth = $scope.operationData.bitDepthContext.bitDepth;

			if (operationEndBitDepth > currentBitDepth) {
				dialogFactory.showCriticalDialog({
					templateHtml: '<b>Important !!!</b> The current bit depth is about <b>' + currentBitDepth.toFixed(2) + '</b> Please make sure the entire casing string is bellow shoe depth due to start cemementing.',
				}, startCementation);
			} else {
				startCementation();
			}
		}

		function startCementation() {
			dialogFactory.showConfirmDialog('Are you sure you want to start the Cementing Procedure? This action cannot be undone.', vm.operationDataFactory.emitStartCementation);
		}

		function actionClickFailuresButton() {
			$uibModal.open({
				animation: true,
				keyboard: false,
				backdrop: 'static',
				size: 'modal-sm',
				windowClass: 'xpd-operation-modal',
				template: failureModalTemplate,
				controller: 'FailuresController as fController',
			});

		}

		function actionClickLessonsLearnedButton() {
			$uibModal.open({
				animation: true,
				keyboard: false,
				backdrop: 'static',
				size: 'modal-sm',
				windowClass: 'xpd-operation-modal',
				template: lessonLearnedModalTemplate,
				controller: 'LessonLearnedController as llController',
			});
		}

		function actionButtonStopCementation() {
			dialogFactory.showCriticalDialog('Are you sure you want to stop the Cementing Procedure? This action cannot be undone.', vm.operationDataFactory.emitStopCementation);
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

			const alarmContext = $scope.operationData.alarmContext;

			if (alarmContext) {
				const acknowledgements = alarmContext.acknowledgementList;

				for (const i in acknowledgements) {
					const alarm = acknowledgements[i].alarm;

					if (alarm.alarmType === 'depth') {
						if (!acknowledgements[i].acknowledgeTime) {
							$scope.flags.hasAlarm = true;
						}

						$scope.acknowledgement.depthAlarms.push(acknowledgements[i]);

					} else {
						if (!acknowledgements[i].acknowledgeTime) {
							$scope.flags.hasMessage = true;
						}

						$scope.acknowledgement.timeAlarms.push(acknowledgements[i]);
					}
				}
			}
		}

		function filterMembersOnly(shift) {
			return shift.member.function.id !== 1;
		}

		function actionButtonConfirmAcknowledgement(acknowledgement) {
			dialogFactory.showConfirmDialog('Confirm Acknowledgement?', function () {
				vm.operationDataFactory.emitConfirmAcknowledgement(acknowledgement);
			});
		}

		function actionButtonUnconfirmAcknowledgement(acknowledgement) {
			dialogFactory.showConfirmDialog('Unconfirm Acknowledgement?', function () {
				vm.operationDataFactory.emitUnconfirmAcknowledgement(acknowledgement);
			});
		}

		function actionButtonStartMakeUp() {
			vm.operationDataFactory.emitStartMakeUp();
		}

		function actionButtonStartLayDown() {
			vm.operationDataFactory.emitStartLayDown();
		}

		function actionButtonFinishMakeUp() {
			vm.operationDataFactory.emitFinishMakeUp();
		}

		function actionButtonFinishLayDown() {
			vm.operationDataFactory.emitFinishLayDown();
		}

		function actionButtonFinishDurationAlarm() {
			vm.operationDataFactory.emitFinishDurationAlarm();
		}

		function actionButtonCloseAlarmsAcknowledgementModal() {
			$scope.$uibModalInstance.close();
		}

		function onAboveSpeedLimit() {

			if ($scope.flags.showSlowDown === true) {
				return;
			}

			$scope.flags.showSlowDown = true;

			$xpdTimeout.run(function () {
				$scope.flags.showSlowDown = false;
			}, 1500, $scope);
		}

		function onUnreachableTarget() {
			/*
             if ($scope.flags.showUnreachable == true)
             return;

             $scope.flags.showUnreachable = true;

             $xpdTimeout(function() {
             $scope.flags.showUnreachable = false;
             }, 500);
             */
		}

		function flashGoDiv() {
			$scope.flags.showGo = true;

			$xpdTimeout.run(function () {
				$scope.flags.showGo = false;
			}, 500, $scope);
		}

		function buildEventStruture() {

			const eventContext = $scope.operationData.eventContext;

			if (eventContext && eventContext.currentEvent != null && eventContext.currentEvent.eventType === 'WAIT') {

				$scope.dados.timeBlocks = [{
					name: 'Waiting for Readings',
					percentage: 100,
				}];

			}

		}

		function buildTimeSlicesStruture() {

			const timeSlicesContext = $scope.operationData.timeSlicesContext;

			if (timeSlicesContext && timeSlicesContext.currentTimeSlices != null) {

				try {
					timeSlicesContext.currentTimeSlices = timeSlicesContext.currentTimeSlices.map(function (ts) {

						if (ts.enabled === false) {
							ts.enabled = false;
						} else {
							ts.enabled = true;
						}

						return ts;
					});
				} catch (error) {
					console.error(error);
				}

				timeSlicesContext.currentTimeSlices = (
					timeSlicesContext.currentTimeSlices.filter(function (ts) {
						return ts.enabled = true;
					}));

				$scope.dados.timeBlocks = angular.copy(timeSlicesContext.currentTimeSlices);

			} else {
				$scope.dados.timeBlocks = [{
					name: 'Undefined',
					percentage: 100,
					timeOrder: 1,
				}];
			}

		}

		function finishDurationAlarm() {
			vm.operationDataFactory.emitFinishDurationAlarm();
		}

		// function changeTrackingContent() {
		// 	$scope.flags.showDMEC = !$scope.flags.showDMEC;
		// 	localStorage.setItem('xpd.admin.tracking.openDmecAsDefault', $scope.flags.showDMEC);
		// }

	}
}

// })();
