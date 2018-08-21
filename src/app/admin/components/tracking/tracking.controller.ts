import * as angular from 'angular';
import { IModalService } from 'angular-ui-bootstrap';
import { DialogService } from '../../../shared/xpd.dialog/xpd.dialog.factory';
import { EventDetailsModalService } from '../../../shared/xpd.modal.event-details/xpd-modal-event-details.factory';
import { FailureModalFactory } from '../../../shared/xpd.modal.failure/xpd-modal-failure.factory';
import { LessonLearnedModalService } from '../../../shared/xpd.modal.lessonlearned/xpd-modal-lessonlearned.service';
import { OperationDataService } from '../../../shared/xpd.operation-data/operation-data.service';
import { EventLogSetupAPIService } from '../../../shared/xpd.setupapi/eventlog-setupapi.service';
import { FailureSetupAPIService } from '../../../shared/xpd.setupapi/failure-setupapi.service';
import { LessonLearnedSetupAPIService } from '../../../shared/xpd.setupapi/lessonlearned-setupapi.service';

export class TrackingController {

	public static $inject: string[] = [
		'$scope',
		'$q',
		'$rootScope',
		'$interval',
		'$timeout',
		'$uibModal',
		'eventDetailsModalService',
		'eventlogSetupAPIService',
		'failureModal',
		'lessonLearnedSetupAPIService',
		'failureSetupAPIService',
		'lessonLearnedModal',
		'operationDataService',
		'dialogService',
	];

	public listTrackingEventByOperationPromise: any;

	public operationDataFactory: any;
	public eventId: any;
	public eventStartTime: any;
	public eventEndTime: any;

	constructor(
		private $scope: any,
		private $q: angular.IQService,
		private $rootScope: any,
		private $interval: angular.IIntervalService,
		private $timeout: angular.ITimeoutService,
		private $uibModal: IModalService,
		private eventDetailsModalService: EventDetailsModalService,
		private eventlogSetupAPIService: EventLogSetupAPIService,
		private failureModal: FailureModalFactory,
		private lessonLearnedSetupAPIService: LessonLearnedSetupAPIService,
		private failureSetupAPIService: FailureSetupAPIService,
		private lessonLearnedModal: LessonLearnedModalService,
		private operationDataService: OperationDataService,
		private dialogService: DialogService,
	) {

		const vm = this;

		this.listTrackingEventByOperationPromise = null;

		$rootScope.XPDmodule = 'admin';

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

		operationDataService.openConnection([
				'alarm',
				'bitDepth',
				'blockSpeed',
				'chronometer',
				'direction',
				'elevatorTarget',
				'event',
				'jointLog',
				'operation',
				'operationProgress',
				'operationQueue',
				'parallelEvent',
				'reading',
				'score',
				'shift',
				'speedSecurity',
				'state',
				'timeSlices',
				'vre',
				'well',
			]).then(() => {
			vm.operationDataFactory = operationDataService.operationDataFactory;
			$scope.operationData = vm.operationDataFactory.operationData;
			vm.loadEvents();
			vm.init();
			// vm.changeTrackingContent = changeTrackingContent;

			/**
			 * ADMIN ONLY
			 */

			operationDataService.on('setOnParallelEventChangeListener', () => { vm.loadEvents(); });
			// * MODAL ACTIONS *//

			// * ALARM *//

			// buildEventStruture();
			operationDataService.on('setOnEventChangeListener', (data) => { vm.loadEvents(); vm.buildEventStruture(); });
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

	public actionOpenDropdownMenu(mouseEvent, eventLog) {
		const modalOption: any = document.querySelector('.slips-to-slips-dropdown-menu');

		modalOption.style.top = (mouseEvent.clientY) + 'px';
		modalOption.style.left = (mouseEvent.clientX) + 'px';

		if (!this.$scope.flags.openDropdownMenu) {
			this.$scope.flags.openDropdownMenu = !this.$scope.flags.openDropdownMenu;
		}

		this.eventId = eventLog.id;
		this.eventStartTime = eventLog.startTime;
		this.eventEndTime = eventLog.endTime;

	}

	public actionClickEventDetailsButton() {
		this.eventDetailsModalService.open(this.eventId);
	}

	public actionButtonStartOperation(operation: any) {
		const vm = this;
		vm.dialogService.showConfirmDialog(
			'Start current operation?', () => {
				vm.operationDataFactory.emitStartCurrentOperation(operation);
			});
	}

	public actionButtonFinishOperation() {
		const vm = this;
		vm.dialogService.showConfirmDialog(
			'Finish running operation?', () => {
				vm.operationDataFactory.emitFinishRunningOperation();
			});
	}

	public actionButtonStartCementation() {
		const vm = this;

		const operationEndBitDepth = vm.$scope.operationData.operationContext.currentOperation.endBitDepth;
		const currentBitDepth = vm.$scope.operationData.bitDepthContext.bitDepth;

		if (operationEndBitDepth > currentBitDepth) {
			vm.dialogService.showCriticalDialog({
				templateHtml:
					'<b>Important !!!</b> The current bit depth is about <b>' +
					currentBitDepth.toFixed(2) +
					'</b> Please make sure the entire casing string is bellow shoe depth due to start cemementing.',
			}, () => {
				vm.startCementation();
			});
		} else {
			vm.startCementation();
		}
	}

	public actionButtonStopCementation() {
		const vm = this;
		vm.dialogService.showCriticalDialog(
			'Are you sure you want to stop the Cementing Procedure? This action cannot be undone.', () => {
				vm.operationDataFactory.emitStopCementation();
			});
	}

	public flashGoDiv() {
		const vm = this;
		vm.$scope.flags.showGo = true;

		vm.$timeout(() => {
			vm.$scope.flags.showGo = false;
		}, 500, vm.$scope);
	}

	public actionClickFailuresButton() {
		this.failureModal.open(
			this.getSelectedEvent(),
		);
	}

	public actionClickLessonsLearnedButton() {
		this.lessonLearnedModal.open(
			this.getSelectedEvent(),
			(arg) => { this.insertLessonLearnedCallback(arg); },
			(arg) => { this.updateLessonLearnedCallback(arg); },
		);
	}

	public actionButtonCloseAlarmsAcknowledgementModal() {
		const vm = this;
		vm.$scope.$uibModalInstance.close();
	}

	public actionButtonUnconfirmAcknowledgement(acknowledgement) {
		const vm = this;
		vm.dialogService.showConfirmDialog('Unconfirm Acknowledgement?', () => {
			vm.operationDataFactory.emitUnconfirmAcknowledgement(acknowledgement);
		});
	}

	public actionButtonConfirmAcknowledgement(acknowledgement) {
		const vm = this;
		vm.dialogService.showConfirmDialog('Confirm Acknowledgement?', () => {
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

	private getSelectedEvent() {
		const operationId = this.$scope.operationData.operationContext.currentOperation.id;
		const start = new Date(this.eventStartTime);
		const end = new Date(this.eventEndTime);

		const selectedEvent = {
			operation: {
				id: operationId,
			},
			startTime: start,
			endTime: end,
		};

		return selectedEvent;
	}

	private insertLessonLearnedCallback(lessonLearned) {
		this.lessonLearnedSetupAPIService.insertObject(lessonLearned);
	}

	private updateLessonLearnedCallback(lessonLearned) {
		this.lessonLearnedSetupAPIService.updateObject(lessonLearned);
	}

	private init() {
		const vm = this;

		vm.$interval(() => {
			vm.circulateShiftList();
		}, 10000, vm.$scope);

		vm.operationDataFactory = vm.operationDataService.operationDataFactory;
		// TODO: adaptacao as any
		vm.$scope.operationData = vm.operationDataFactory.operationData;

		vm.buildEventStruture();
		vm.buildTimeSlicesStruture();
		vm.removeTeamsFromShift();
		vm.buildAcknowledgementList();
	}

	private startCementation() {
		const vm = this;
		this.dialogService.showConfirmDialog(
			'Are you sure you want to start the Cementing Procedure? This action cannot be undone.', () => {
				vm.operationDataFactory.emitStartCementation();
			});
	}

	private circulateShiftList() {
		if (this.$scope.operationData.shiftContext.onShift != null && this.$scope.operationData.shiftContext.onShift.length > 1) {
			this.$scope.operationData.shiftContext.onShift.push(this.$scope.operationData.shiftContext.onShift.shift());
		}
	}

	private removeTeamsFromShift() {
		if (this.$scope.operationData.shiftContext != null && this.$scope.operationData.shiftContext.onShift != null) {
			this.$scope.operationData.shiftContext.onShift = this.$scope.operationData.shiftContext.onShift.filter((shift) => {
				return shift.member.function.id !== 1;
			});
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

	private onAboveSpeedLimit() {
		const vm = this;

		if (this.$scope.flags.showSlowDown === true) {
			return;
		}

		this.$scope.flags.showSlowDown = true;

		vm.$timeout(() => {
			vm.$scope.flags.showSlowDown = false;
		}, 1500);

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

	private loadEvents() {

		if (this.$scope.operationData != null &&
			this.$scope.operationData.operationContext &&
			this.$scope.operationData.operationContext.currentOperation &&
			this.$scope.operationData.operationContext.currentOperation.running) {

			if (!this.listTrackingEventByOperationPromise) {

				this.listTrackingEventByOperationPromise = this.listTrackingEventByOperation(
					this.$scope.operationData.operationContext.currentOperation.id);

				this.listTrackingEventByOperationPromise.then((trackingEvents) => {
					this.organizeEventsOnLists(trackingEvents);
					this.listTrackingEventByOperationPromise = null;
				});

			}
		}

	}

	private listTrackingEventByOperation(operationId) {
		return this.eventlogSetupAPIService.listTrackingEventByOperation(operationId);
	}

	private organizeEventsOnLists(trackingEvents) {

		this.$scope.dados.connectionEvents = [];
		this.$scope.dados.tripEvents = [];
		this.$scope.dados.timeEvents = [];
		this.$scope.dados.connectionTimes = [];
		this.$scope.dados.tripTimes = [];

		trackingEvents.map((event) => {

			if (event.id && event.duration) {

				if (event.eventType === 'CONN') {
					this.$scope.dados.connectionEvents.push(event);
				}

				if (event.eventType === 'TRIP') {
					this.$scope.dados.tripEvents.push(event);
				}

				if (event.eventType === 'TIME') {
					this.$scope.dados.timeEvents.push(event);
				}

			}

		});

		this.$scope.dados.connectionTimes = this.$scope.dados.connectionEvents.slice(-200);
		this.$scope.dados.tripTimes = this.$scope.dados.tripEvents.slice(-200);

		const lastConn = this.$scope.dados.connectionEvents[this.$scope.dados.connectionEvents.length - 1];
		const lastTrip = this.$scope.dados.tripEvents[this.$scope.dados.tripEvents.length - 1];

		this.$scope.dados.lastConnDuration = (lastConn.duration / 1000);
		this.$scope.dados.lastTripDuration = (lastTrip.duration / 1000);

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
				timeSlicesContext.currentTimeSlices = timeSlicesContext.currentTimeSlices.map((ts) => {

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
				timeSlicesContext.currentTimeSlices.filter((ts) => {
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
