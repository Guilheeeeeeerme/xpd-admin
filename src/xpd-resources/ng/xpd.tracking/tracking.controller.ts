import * as angular from 'angular';
import { IModalService } from 'angular-ui-bootstrap';
import { DialogService } from '../xpd.dialog/xpd.dialog.factory';
import { XPDIntervalService, XPDTimeoutService } from '../xpd.timers/xpd-timers.service';

import failureModalTemplate from '../../../components/admin/views/modal/failures.modal.html';
import lessonLearnedModalTemplate from '../../../components/admin/views/modal/lesson-learned.modal.html';
import { OperationDataService } from '../xpd.operation-data/operation-data.service';

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

	// constructor(
	// 	$scope: any,
	// 	$uibModalInstance: IModalServiceInstance,
	// 	lessonLearnedSetupAPIService: LessonLearnedSetupAPIService,
	// 	selectedLessonLearned: any,
	// 	modalSuccessCallback: any,
	// 	modalErrorCallback: any) {

	constructor(
		private $scope: any,
		$xpdInterval: XPDIntervalService,
		private $xpdTimeout: XPDTimeoutService,
		private $uibModal: IModalService,
		operationDataService: OperationDataService,
		private dialogService: DialogService) {

		const vm = this;

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

		setInterval(function () {
			console.log($scope.operationData);
		}, 500);

		operationDataService.openConnection([]).then(function () {

			vm.operationDataFactory = operationDataService.operationDataFactory;
			// TODO: adaptacao as any
			$scope.operationData = vm.operationDataFactory.operationData;

			$xpdInterval.run(() => {
				vm.circulateShiftList();
			}, 10000, $scope);

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
			operationDataService.on('setOnEventChangeListener', (data) => { vm.buildEventStruture(); });
			operationDataService.on('setOnCurrentEventListener', (data) => { vm.buildEventStruture(); });
			operationDataService.on('setOnNoCurrentEventListener', (data) => { vm.buildEventStruture(); });
			operationDataService.on('setOnEventLogUpdateListener', (data) => { vm.buildEventStruture(); });
			operationDataService.on('setOnWaitEventListener', (data) => { vm.buildEventStruture(); });

			// buildTimeSlicesStruture();
			operationDataService.on('setOnTimeSlicesChangeListener', (data) => { vm.buildTimeSlicesStruture(); });
			operationDataService.on('setOnTimeSlicesListener', (data) => { vm.buildTimeSlicesStruture(); });
			operationDataService.on('setOnNoTimeSlicesListener', (data) => { vm.buildTimeSlicesStruture(); });

			operationDataService.on('setOnAboveSpeedLimitListener', (data) => { vm.onAboveSpeedLimit(); });
			operationDataService.on('setOnUnreachableTargetListener', (data) => { vm.onUnreachableTarget(); });

			// removeTeamsFromShift();
			operationDataService.on('setOnShiftListener', (data) => { vm.removeTeamsFromShift(); });

			// buildAcknowledgementList();
			operationDataService.on('setOnAlarmsChangeListener', (data) => { vm.buildAcknowledgementList(); });
			operationDataService.on('setOnCurrentAlarmsListener', (data) => { vm.buildAcknowledgementList(); });
			operationDataService.on('setOnNoCurrentAlarmsListener', (data) => { vm.buildAcknowledgementList(); });
			operationDataService.on('setOnSpeedRestrictionAlarmListener', (data) => { vm.buildAcknowledgementList(); });
			operationDataService.on('setOnDurationAlarmListener', (data) => { vm.buildAcknowledgementList(); });
			operationDataService.on('setOnNoCurrentAlarmListener', (data) => { vm.buildAcknowledgementList(); });
			operationDataService.on('setOnExpectedAlarmChangeListener', (data) => { vm.buildAcknowledgementList(); });

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
