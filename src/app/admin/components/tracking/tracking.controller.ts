
import * as angular from 'angular';
import { DialogService } from '../../../shared/xpd.dialog/xpd.dialog.factory';
import { EventDetailsModalService } from '../../../shared/xpd.modal.event-details/xpd-modal-event-details.factory';
import { FailureModalFactory } from '../../../shared/xpd.modal.failure/xpd-modal-failure.factory';
import { LessonLearnedModalService } from '../../../shared/xpd.modal.lessonlearned/xpd-modal-lessonlearned.service';
import { OperationDataService } from '../../../shared/xpd.operation-data/operation-data.service';
import { EventLogSetupAPIService } from '../../../shared/xpd.setupapi/eventlog-setupapi.service';
import { LessonLearnedSetupAPIService } from '../../../shared/xpd.setupapi/lessonlearned-setupapi.service';


export class TrackingController {

	public static $inject: string[] = [
		'$scope',
		'$rootScope',
		'$interval',
		'$timeout',
		'eventDetailsModalService',
		'eventlogSetupAPIService',
		'failureModal',
		'lessonLearnedSetupAPIService',
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
		$rootScope: any,
		private $interval: angular.IIntervalService,
		private $timeout: angular.ITimeoutService,
		private eventDetailsModalService: EventDetailsModalService,
		private eventlogSetupAPIService: EventLogSetupAPIService,
		private failureModal: FailureModalFactory,
		private lessonLearnedSetupAPIService: LessonLearnedSetupAPIService,
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

			operationDataService.on($scope, 'setOnParallelEventChangeListener', () => { vm.loadEvents(); });
			// * MODAL ACTIONS *//

			// * ALARM *//

			// buildEventStruture();
			operationDataService.on($scope, 'setOnEventChangeListener', () => { vm.loadEvents(); vm.buildEventStruture(); });
			operationDataService.on($scope, 'setOnCurrentEventListener', () => { vm.buildEventStruture(); });
			operationDataService.on($scope, 'setOnNoCurrentEventListener', () => { vm.buildEventStruture(); });
			operationDataService.on($scope, 'setOnEventLogUpdateListener', () => { vm.buildEventStruture(); });
			operationDataService.on($scope, 'setOnWaitEventListener', () => { vm.buildEventStruture(); });

			// buildTimeSlicesStruture();
			operationDataService.on($scope, 'setOnTimeSlicesChangeListener', () => { vm.buildTimeSlicesStruture(); });
			operationDataService.on($scope, 'setOnTimeSlicesListener', () => { vm.buildTimeSlicesStruture(); });
			operationDataService.on($scope, 'setOnNoTimeSlicesListener', () => { vm.buildTimeSlicesStruture(); });

			operationDataService.on($scope, 'setOnAboveSpeedLimitListener', () => { vm.onAboveSpeedLimit(); });
			operationDataService.on($scope, 'setOnUnreachableTargetListener', () => { vm.onUnreachableTarget(); });

			// removeTeamsFromShift();
			operationDataService.on($scope, 'setOnShiftListener', () => { vm.removeTeamsFromShift(); });

			// buildAcknowledgementList();
			operationDataService.on($scope, 'setOnAlarmsChangeListener', () => { vm.buildAcknowledgementList(); });
			operationDataService.on($scope, 'setOnCurrentAlarmsListener', () => { vm.buildAcknowledgementList(); });
			operationDataService.on($scope, 'setOnNoCurrentAlarmsListener', () => { vm.buildAcknowledgementList(); });
			operationDataService.on($scope, 'setOnSpeedRestrictionAlarmListener', () => { vm.buildAcknowledgementList(); });
			operationDataService.on($scope, 'setOnDurationAlarmListener', () => { vm.buildAcknowledgementList(); });
			operationDataService.on($scope, 'setOnNoCurrentAlarmListener', () => { vm.buildAcknowledgementList(); });
			operationDataService.on($scope, 'setOnExpectedAlarmChangeListener', () => { vm.buildAcknowledgementList(); });

		});

	}

	// @XPDMethodDebugDecorator()
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

	// @XPDMethodDebugDecorator()
	public actionClickEventDetailsButton() {
		this.eventDetailsModalService.open(this.eventId);
	}

	// @XPDMethodDebugDecorator()
	public actionButtonStartOperation(operation: any) {
		const vm = this;
		vm.dialogService.showConfirmDialog(
			'Start current operation?', () => {
				vm.operationDataFactory.emitStartCurrentOperation(operation);
			});
	}

	// @XPDMethodDebugDecorator()
	public actionButtonFinishOperation() {
		const vm = this;
		vm.dialogService.showConfirmDialog(
			'Finish running operation?', () => {
				vm.operationDataFactory.emitFinishRunningOperation();
			});
	}

	// @XPDMethodDebugDecorator()
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

	// @XPDMethodDebugDecorator()
	public actionButtonStopCementation() {
		const vm = this;
		vm.dialogService.showCriticalDialog(
			'Are you sure you want to stop the Cementing Procedure? This action cannot be undone.', () => {
				vm.operationDataFactory.emitStopCementation();
			});
	}

	// @XPDMethodDebugDecorator()
	public flashGoDiv() {
		const vm = this;
		vm.$scope.flags.showGo = true;

		vm.$timeout(() => {
			vm.$scope.flags.showGo = false;
		}, 500, vm.$scope);
	}

	// @XPDMethodDebugDecorator()
	public actionClickFailuresButton() {
		this.failureModal.open(
			this.getSelectedEvent(),
			null,
			null,
		);
	}

	// @XPDMethodDebugDecorator()
	public actionClickLessonsLearnedButton() {
		this.lessonLearnedModal.open(
			this.getSelectedEvent(),
			(arg) => { this.successLessonLearnedCallback(arg); },
			(arg) => { this.errorLessonLearnedCallback(arg); },
		);
	}

	// @XPDMethodDebugDecorator()
	public actionButtonCloseAlarmsAcknowledgementModal() {
		const vm = this;
		vm.$scope.$uibModalInstance.close();
	}

	// @XPDMethodDebugDecorator()
	public actionButtonUnconfirmAcknowledgement(acknowledgement) {
		const vm = this;
		vm.dialogService.showConfirmDialog('Unconfirm Acknowledgement?', () => {
			vm.operationDataFactory.emitUnconfirmAcknowledgement(acknowledgement);
		});
	}

	// @XPDMethodDebugDecorator()
	public actionButtonConfirmAcknowledgement(acknowledgement) {
		const vm = this;
		vm.dialogService.showConfirmDialog('Confirm Acknowledgement?', () => {
			vm.operationDataFactory.emitConfirmAcknowledgement(acknowledgement);
		});
	}

	// @XPDMethodDebugDecorator()
	public actionButtonStartMakeUp() {
		this.operationDataFactory.emitStartMakeUp();
	}

	// @XPDMethodDebugDecorator()
	public actionButtonStartLayDown() {
		this.operationDataFactory.emitStartLayDown();
	}

	// @XPDMethodDebugDecorator()
	public actionButtonFinishMakeUp() {
		this.operationDataFactory.emitFinishMakeUp();
	}

	// @XPDMethodDebugDecorator()
	public actionButtonFinishLayDown() {
		this.operationDataFactory.emitFinishLayDown();
	}

	// @XPDMethodDebugDecorator()
	public actionButtonFinishDurationAlarm() {
		this.operationDataFactory.emitFinishDurationAlarm();
	}

	// @XPDMethodDebugDecorator()
	public finishDurationAlarm() {
		this.operationDataFactory.emitFinishDurationAlarm();
	}

	// @XPDMethodDebugDecorator()
	public getSelectedEvent() {
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

	// @XPDMethodDebugDecorator()
	private successLessonLearnedCallback(lessonLearned) {
		// this.lessonLearnedSetupAPIService.insertObject(lessonLearned);
	}

	// @XPDMethodDebugDecorator()
	private errorLessonLearnedCallback(lessonLearned) {
		// this.lessonLearnedSetupAPIService.updateObject(lessonLearned);
	}

	// @XPDMethodDebugDecorator()
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

	// @XPDMethodDebugDecorator()
	private startCementation() {
		const vm = this;
		this.dialogService.showConfirmDialog(
			'Are you sure you want to start the Cementing Procedure? This action cannot be undone.', () => {
				vm.operationDataFactory.emitStartCementation();
			});
	}

	// @XPDMethodDebugDecorator()
	private circulateShiftList() {
		if (this.$scope.operationData.shiftContext.onShift != null && this.$scope.operationData.shiftContext.onShift.length > 1) {
			this.$scope.operationData.shiftContext.onShift.push(this.$scope.operationData.shiftContext.onShift.shift());
		}
	}

	// @XPDMethodDebugDecorator()
	private removeTeamsFromShift() {
		if (this.$scope.operationData.shiftContext != null && this.$scope.operationData.shiftContext.onShift != null) {
			this.$scope.operationData.shiftContext.onShift = this.$scope.operationData.shiftContext.onShift.filter((shift) => {
				return shift.member.function.id !== 1;
			});
		}
	}

	// @XPDMethodDebugDecorator()
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

	// @XPDMethodDebugDecorator()
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

	// @XPDMethodDebugDecorator()
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

	// @XPDMethodDebugDecorator()
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

	// @XPDMethodDebugDecorator()
	private listTrackingEventByOperation(operationId) {
		return this.eventlogSetupAPIService.listTrackingEventByOperation(operationId);
	}

	// @XPDMethodDebugDecorator()
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

	// @XPDMethodDebugDecorator()
	private buildEventStruture() {

		const eventContext = this.$scope.operationData.eventContext;

		if (eventContext && eventContext.currentEvent != null && eventContext.currentEvent.eventType === 'WAIT') {

			this.$scope.dados.timeBlocks = [{
				name: 'Waiting for Readings',
				percentage: 100,
			}];

		}

	}

	// @XPDMethodDebugDecorator()
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
