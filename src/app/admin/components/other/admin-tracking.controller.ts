import { IQService } from 'angular';
import { EventDetailsModalService } from '../../../shared/xpd.modal.event-details/xpd-modal-event-details.factory';
import { FailureModalFactory } from '../../../shared/xpd.modal.failure/xpd-modal-failure.factory';
import { LessonLearnedModalService } from '../../../shared/xpd.modal.lessonlearned/xpd-modal-lessonlearned.service';
import { OperationDataService } from '../../../shared/xpd.operation-data/operation-data.service';
import { EventLogSetupAPIService } from '../../../shared/xpd.setupapi/eventlog-setupapi.service';
import { FailureSetupAPIService } from '../../../shared/xpd.setupapi/failure-setupapi.service';
import { LessonLearnedSetupAPIService } from '../../../shared/xpd.setupapi/lessonlearned-setupapi.service';

export class AdminTrackingController {
	// 'use strict';

	public static $inject = ['$scope', '$q', 'operationDataService', 'eventDetailsModalService', 'failureModal', 'eventlogSetupAPIService', 'lessonLearnedModal', 'failureSetupAPIService', 'lessonLearnedSetupAPIService', '$rootScope'];
	public operationDataFactory: any;
	public eventStartTime: any;
	public eventEndTime: any;
	public eventId: any;
	public listTrackingEventByOperationPromise: any;

	constructor(
		private $scope: any,
		private $q: IQService,
		private operationDataService: OperationDataService,
		private eventDetailsModalService: EventDetailsModalService,
		private failureModal: FailureModalFactory,
		private eventlogSetupAPIService: EventLogSetupAPIService,
		private lessonLearnedModal: LessonLearnedModalService,
		private failureSetupAPIService: FailureSetupAPIService,
		private lessonLearnedSetupAPIService: LessonLearnedSetupAPIService,
		private $rootScope: any) {

		const vm = this;

		// this.eventStartTime;
		// this.eventEndTime;
		// this.eventId;
		this.listTrackingEventByOperationPromise = null;

		$rootScope.XPDmodule = 'admin';

		operationDataService.openConnection([]).then(() => {
			vm.operationDataFactory = operationDataService.operationDataFactory;
			$scope.operationData = vm.operationDataFactory.operationData;
		});

		this.loadEvents();

		operationDataService.on('setOnEventChangeListener', () => { this.loadEvents(); });
		operationDataService.on('setOnParallelEventChangeListener', () => { this.loadEvents(); });

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

	public actionOpenDropdownMenu($event, eventLog) {

		const modalOption: any = document.querySelector('.slips-to-slips-dropdown-menu');

		modalOption.style.top = ($event.clientY) + 'px';
		modalOption.style.left = ($event.clientX) + 'px';

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

	private insertFailureCallback(failure) {
		console.log('Insert Failure Successfully!');
	}

	private updateFailureCallback(failure) {
		this.failureSetupAPIService.updateObject(failure);
	}

	private insertLessonLearnedCallback(lessonLearned) {
		this.lessonLearnedSetupAPIService.insertObject(lessonLearned);
	}

	private updateLessonLearnedCallback(lessonLearned) {
		this.lessonLearnedSetupAPIService.updateObject(lessonLearned);
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

	}

}
