import * as angular from 'angular';
import { IModalService } from 'angular-ui-bootstrap';
import { OperationDataService } from '../xpd.communication/operation-server-data.factory';
import { DialogService } from '../xpd.dialog/xpd.dialog.factory';
import { XPDIntervalService, XPDTimeoutService } from '../xpd.timers/xpd-timers.service';

import failureModalTemplate from '../../../components/admin/views/modal/failures.modal.html';
import lessonLearnedModalTemplate from '../../../components/admin/views/modal/lesson-learned.modal.html';

// (function() {
// 	'use strict',

// 	angular.module('xpd.tracking').controller('TrackingController', trackingController);

// 	trackingController.$inject = ['$scope', '$xpdInterval', '$xpdTimeout', '$uibModal', 'operationDataService', 'dialogService', '$filter'];

export class TrackingController {

	public operationDataFactory: any;

	public static $inject: string[] = [
		'$scope',
		'$xpdInterval',
		'$xpdTimeout',
		'$uibModal',
		'operationDataService',
		'dialogService',
	];
	public circulateShiftListInterval: any;

	// constructor(
	// 	$scope: any,
	// 	$uibModalInstance: IModalServiceInstance,
	// 	lessonLearnedSetupAPIService: LessonLearnedSetupAPIService,
	// 	selectedLessonLearned: any,
	// 	modalSuccessCallback: any,
	// 	modalErrorCallback: any) {

	constructor(
		private $scope: any,
		private $xpdInterval: XPDIntervalService,
		private $xpdTimeout: XPDTimeoutService,
		private $uibModal: IModalService,
		operationDataService: OperationDataService,
		private dialogService: DialogService) {

		const vm = this;

		$scope.$on('$destroy', this.destroy);

		const circulateShiftListInterval = $xpdInterval.run(this.circulateShiftList, 10000, $scope);

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

		operationDataService.openConnection([]).then(function (operationDataFactory: any) {
			vm.operationDataFactory = operationDataFactory;
			// TODO: adaptacao as any
			$scope.operationData = operationDataFactory.operationData;

			vm.buildEventStruture();
			vm.buildTimeSlicesStruture();
			vm.removeTeamsFromShift();
			vm.buildAcknowledgementList();

			// vm.changeTrackingContent = changeTrackingContent;

			/**
			 * ADMIN ONLY
			 */

			// * MODAL ACTIONS *//

			// * ALARM *//

			// buildEventStruture();
			operationDataService.addEventListener('trackingController', 'setOnEventChangeListener', (data) => { vm.buildEventStruture(); });
			operationDataService.addEventListener('trackingController', 'setOnCurrentEventListener', (data) => { vm.buildEventStruture(); });
			operationDataService.addEventListener('trackingController', 'setOnNoCurrentEventListener', (data) => { vm.buildEventStruture(); });
			operationDataService.addEventListener('trackingController', 'setOnEventLogUpdateListener', (data) => { vm.buildEventStruture(); });
			operationDataService.addEventListener('trackingController', 'setOnWaitEventListener', (data) => { vm.buildEventStruture(); });

			// buildTimeSlicesStruture();
			operationDataService.addEventListener('trackingController', 'setOnTimeSlicesChangeListener', (data) => { vm.buildTimeSlicesStruture(); });
			operationDataService.addEventListener('trackingController', 'setOnTimeSlicesListener', (data) => { vm.buildTimeSlicesStruture(); });
			operationDataService.addEventListener('trackingController', 'setOnNoTimeSlicesListener', (data) => { vm.buildTimeSlicesStruture(); });

			operationDataService.addEventListener('trackingController', 'setOnAboveSpeedLimitListener', (data) => { vm.onAboveSpeedLimit(); });
			operationDataService.addEventListener('trackingController', 'setOnUnreachableTargetListener', (data) => { vm.onUnreachableTarget(); });

			// removeTeamsFromShift();
			operationDataService.addEventListener('trackingController', 'setOnShiftListener', (data) => { vm.removeTeamsFromShift(); });

			// buildAcknowledgementList();
			operationDataService.addEventListener('trackingController', 'setOnAlarmsChangeListener', (data) => { vm.buildAcknowledgementList(); });
			operationDataService.addEventListener('trackingController', 'setOnCurrentAlarmsListener', (data) => { vm.buildAcknowledgementList(); });
			operationDataService.addEventListener('trackingController', 'setOnNoCurrentAlarmsListener', (data) => { vm.buildAcknowledgementList(); });
			operationDataService.addEventListener('trackingController', 'setOnSpeedRestrictionAlarmListener', (data) => { vm.buildAcknowledgementList(); });
			operationDataService.addEventListener('trackingController', 'setOnDurationAlarmListener', (data) => { vm.buildAcknowledgementList(); });
			operationDataService.addEventListener('trackingController', 'setOnNoCurrentAlarmListener', (data) => { vm.buildAcknowledgementList(); });
			operationDataService.addEventListener('trackingController', 'setOnExpectedAlarmChangeListener', (data) => { vm.buildAcknowledgementList(); });

		});
	}

	public actionButtonStartOperation(operation: any) {
		const vm = this;
		this.dialogService.showConfirmDialog('Start current operation?', function () {
			vm.operationDataFactory.emitStartCurrentOperation(operation);
		});
	}

	public actionButtonFinishOperation() {
		const vm = this;
		this.dialogService.showConfirmDialog('Finish running operation?', vm.operationDataFactory.emitFinishRunningOperation);
	}

	public actionButtonStartCementation() {

		const operationEndBitDepth = this.$scope.operationData.operationContext.currentOperation.endBitDepth;
		const currentBitDepth = this.$scope.operationData.bitDepthContext.bitDepth;

		if (operationEndBitDepth > currentBitDepth) {
			this.dialogService.showCriticalDialog({
				templateHtml: '<b>Important !!!</b> The current bit depth is about <b>' + currentBitDepth.toFixed(2) + '</b> Please make sure the entire casing string is bellow shoe depth due to start cemementing.',
			}, this.startCementation);
		} else {
			this.startCementation();
		}
	}

	public actionButtonStopCementation() {
		const vm = this;
		this.dialogService.showCriticalDialog('Are you sure you want to stop the Cementing Procedure? This action cannot be undone.', vm.operationDataFactory.emitStopCementation);
	}

	public flashGoDiv() {
		const vm = this;
		this.$scope.flags.showGo = true;

		this.$xpdTimeout.run(function () {
			vm.$scope.flags.showGo = false;
		}, 500, this.$scope);
	}

	public actionClickFailuresButton() {
		this.$uibModal.open({
			animation: true,
			keyboard: false,
			backdrop: 'static',
			size: 'modal-sm',
			windowClass: 'xpd-operation-modal',
			template: failureModalTemplate,
			controller: 'FailuresController as fController',
		});

	}

	public actionClickLessonsLearnedButton() {
		this.$uibModal.open({
			animation: true,
			keyboard: false,
			backdrop: 'static',
			size: 'modal-sm',
			windowClass: 'xpd-operation-modal',
			template: lessonLearnedModalTemplate,
			controller: 'LessonLearnedController as llController',
		});
	}

	public actionButtonCloseAlarmsAcknowledgementModal() {
		this.$scope.$uibModalInstance.close();
	}

	public actionButtonUnconfirmAcknowledgement(acknowledgement) {
		const vm = this;
		this.dialogService.showConfirmDialog('Unconfirm Acknowledgement?', function () {
			vm.operationDataFactory.emitUnconfirmAcknowledgement(acknowledgement);
		});
	}

	public actionButtonConfirmAcknowledgement(acknowledgement) {
		const vm = this;
		this.dialogService.showConfirmDialog('Confirm Acknowledgement?', function () {
			vm.operationDataFactory.emitConfirmAcknowledgement(acknowledgement);
		});
	}

	public actionButtonStartMakeUp() {
		this.operationDataFactory.emitStartMakeUp();
	}

	public actionButtonStartLayDown() {
		this.operationDataFactory.emitStartLayDown();
	}

	public actionButtonFinishMakeUp() {
		this.operationDataFactory.emitFinishMakeUp();
	}

	public actionButtonFinishLayDown() {
		this.operationDataFactory.emitFinishLayDown();
	}

	public actionButtonFinishDurationAlarm() {
		this.operationDataFactory.emitFinishDurationAlarm();
	}

	public finishDurationAlarm() {
		this.operationDataFactory.emitFinishDurationAlarm();
	}

	/**
		 * Quando sair do controller
		 */
	private destroy() {
		if (this.circulateShiftListInterval) {
			this.$xpdInterval.cancel(this.circulateShiftListInterval);
		}
	}

	private startCementation() {
		this.dialogService.showConfirmDialog('Are you sure you want to start the Cementing Procedure? This action cannot be undone.', this.operationDataFactory.emitStartCementation);
	}

	private circulateShiftList() {
		if (this.$scope.operationData.shiftContext.onShift != null && this.$scope.operationData.shiftContext.onShift.length > 1) {
			this.$scope.operationData.shiftContext.onShift.push(this.$scope.operationData.shiftContext.onShift.shift());
		}
	}

	private removeTeamsFromShift() {
		if (this.$scope.operationData.shiftContext != null && this.$scope.operationData.shiftContext.onShift != null) {
			this.$scope.operationData.shiftContext.onShift = this.$scope.operationData.shiftContext.onShift.filter(this.filterMembersOnly);
		}
	}

	private buildAcknowledgementList() {

		this.$scope.acknowledgement.depthAlarms = [];
		this.$scope.acknowledgement.timeAlarms = [];

		this.$scope.flags.hasAlarm = false;
		this.$scope.flags.hasMessage = false;

		const alarmContext = this.$scope.operationData.alarmContext;

		if (alarmContext) {
			const acknowledgements = alarmContext.acknowledgementList;

			for (const i in acknowledgements) {
				const alarm = acknowledgements[i].alarm;

				if (alarm.alarmType === 'depth') {
					if (!acknowledgements[i].acknowledgeTime) {
						this.$scope.flags.hasAlarm = true;
					}

					this.$scope.acknowledgement.depthAlarms.push(acknowledgements[i]);

				} else {
					if (!acknowledgements[i].acknowledgeTime) {
						this.$scope.flags.hasMessage = true;
					}

					this.$scope.acknowledgement.timeAlarms.push(acknowledgements[i]);
				}
			}
		}
	}

	private filterMembersOnly(shift) {
		return shift.member.function.id !== 1;
	}

	private onAboveSpeedLimit() {
		const vm = this;

		if (this.$scope.flags.showSlowDown === true) {
			return;
		}

		this.$scope.flags.showSlowDown = true;

		this.$xpdTimeout.run(function () {
			vm.$scope.flags.showSlowDown = false;
		}, 1500, this.$scope);
	}

	private onUnreachableTarget() {
		/*
		 if ($scope.flags.showUnreachable == true)
		 return;

		 $scope.flags.showUnreachable = true;

		 $xpdTimeout(function() {
		 $scope.flags.showUnreachable = false;
		 }, 500);
		 */
	}

	private buildEventStruture() {

		const eventContext = this.$scope.operationData.eventContext;

		if (eventContext && eventContext.currentEvent != null && eventContext.currentEvent.eventType === 'WAIT') {

			this.$scope.dados.timeBlocks = [{
				name: 'Waiting for Readings',
				percentage: 100,
			}];

		}

	}

	private buildTimeSlicesStruture() {

		const timeSlicesContext = this.$scope.operationData.timeSlicesContext;

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

			this.$scope.dados.timeBlocks = angular.copy(timeSlicesContext.currentTimeSlices);

		} else {
			this.$scope.dados.timeBlocks = [{
				name: 'Undefined',
				percentage: 100,
				timeOrder: 1,
			}];
		}

	}

	// function changeTrackingContent() {
	// 	$scope.flags.showDMEC = !$scope.flags.showDMEC;
	// 	localStorage.setItem('xpd.admin.tracking.openDmecAsDefault', $scope.flags.showDMEC);
	// }
}

// })();
