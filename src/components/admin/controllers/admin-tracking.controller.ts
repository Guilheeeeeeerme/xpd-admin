import { IQService } from 'angular';
import { EventDetailsModalService } from '../../../app/shared/xpd.modal.event-details/xpd-modal-event-details.factory';
import { FailureModalFactory } from '../../../app/shared/xpd.modal.failure/xpd-modal-failure.factory';
import { LessonLearnedModalService } from '../../../app/shared/xpd.modal.lessonlearned/xpd-modal-lessonlearned.service';
import { OperationDataService } from '../../../app/shared/xpd.operation-data/operation-data.service';
import { EventLogSetupAPIService } from '../../../app/shared/xpd.setupapi/eventlog-setupapi.service';
import { FailureSetupAPIService } from '../../../app/shared/xpd.setupapi/failure-setupapi.service';
import { LessonLearnedSetupAPIService } from '../../../app/shared/xpd.setupapi/lessonlearned-setupapi.service';

export class AdminTrackingController {
	// 'use strict';

	// angular.module('xpd.admin').controller('AdminTrackingController', adminTrackingController);

	public static $inject = ['$scope', '$q', 'operationDataService', 'eventDetailsModalService', 'failureModal', 'eventlogSetupAPIService', 'lessonLearnedModal', 'failureSetupAPIService', 'lessonLearnedSetupAPIService', '$rootScope'];
	public actionOpenDropdownMenu: ($event: any, eventLog: any) => void;
	public actionClickEventDetailsButton: () => void;
	public actionClickFailuresButton: () => void;
	public actionClickLessonsLearnedButton: () => void;
	public operationDataFactory: any;

	constructor(
		$scope: any,
		$q: IQService,
		operationDataService: OperationDataService,
		eventDetailsModalService: EventDetailsModalService,
		failureModal: FailureModalFactory,
		eventlogSetupAPIService: EventLogSetupAPIService,
		lessonLearnedModal: LessonLearnedModalService,
		failureSetupAPIService: FailureSetupAPIService,
		lessonLearnedSetupAPIService: LessonLearnedSetupAPIService,
		$rootScope: any) {

		const vm = this;

		let eventStartTime;
		let eventEndTime;
		let eventId;
		let listTrackingEventByOperationPromise = null;

		vm.actionOpenDropdownMenu = actionOpenDropdownMenu;
		vm.actionClickEventDetailsButton = actionClickEventDetailsButton;
		vm.actionClickFailuresButton = actionClickFailuresButton;
		vm.actionClickLessonsLearnedButton = actionClickLessonsLearnedButton;

		$rootScope.XPDmodule = 'admin';

		operationDataService.openConnection([]).then(function () {
			vm.operationDataFactory = operationDataService.operationDataFactory;
			$scope.operationData = vm.operationDataFactory.operationData;
		});

		loadEvents();

		operationDataService.on('setOnEventChangeListener', loadEvents);
		operationDataService.on('setOnParallelEventChangeListener', loadEvents);

		function loadEvents() {

			if ($scope.operationData != null &&
				$scope.operationData.operationContext &&
				$scope.operationData.operationContext.currentOperation &&
				$scope.operationData.operationContext.currentOperation.running) {

				if (!listTrackingEventByOperationPromise) {
					listTrackingEventByOperationPromise = listTrackingEventByOperation($scope.operationData.operationContext.currentOperation.id);

					listTrackingEventByOperationPromise.then(function (trackingEvents) {
						organizeEventsOnLists(trackingEvents);
						listTrackingEventByOperationPromise = null;
					});
				}
			}

		}

		function actionOpenDropdownMenu($event, eventLog) {

			const modalOption: any = document.querySelector('.slips-to-slips-dropdown-menu');

			modalOption.style.top = ($event.clientY) + 'px';
			modalOption.style.left = ($event.clientX) + 'px';

			if (!$scope.flags.openDropdownMenu) {
				$scope.flags.openDropdownMenu = !$scope.flags.openDropdownMenu;
			}

			eventId = eventLog.id;
			eventStartTime = eventLog.startTime;
			eventEndTime = eventLog.endTime;

		}

		function actionClickEventDetailsButton() {
			eventDetailsModalService.open(eventId);
		}

		function actionClickFailuresButton() {
			failureModal.open(
				getSelectedEvent(),
			);
		}

		function actionClickLessonsLearnedButton() {
			lessonLearnedModal.open(
				getSelectedEvent(),
				insertLessonLearnedCallback,
				updateLessonLearnedCallback,
			);
		}

		function getSelectedEvent() {
			const operationId = $scope.operationData.operationContext.currentOperation.id;
			const start = new Date(eventStartTime);
			const end = new Date(eventEndTime);

			const selectedEvent = {
				operation: {
					id: operationId,
				},
				startTime: start,
				endTime: end,
			};

			return selectedEvent;
		}

		function insertFailureCallback(failure) {
			console.log('Insert Failure Successfully!');
		}

		function updateFailureCallback(failure) {
			failureSetupAPIService.updateObject(failure);
		}

		function insertLessonLearnedCallback(lessonLearned) {
			lessonLearnedSetupAPIService.insertObject(lessonLearned);
		}

		function updateLessonLearnedCallback(lessonLearned) {
			lessonLearnedSetupAPIService.updateObject(lessonLearned);
		}

		function listTrackingEventByOperation(operationId) {
			return $q(function (resolve, reject) {
				eventlogSetupAPIService.listTrackingEventByOperation(operationId, resolve, reject);
			});
		}

		function organizeEventsOnLists(trackingEvents) {

			$scope.dados.connectionEvents = [];
			$scope.dados.tripEvents = [];
			$scope.dados.timeEvents = [];
			$scope.dados.connectionTimes = [];
			$scope.dados.tripTimes = [];

			trackingEvents.map(function (event) {

				if (event.id && event.duration) {

					if (event.eventType === 'CONN') {
						$scope.dados.connectionEvents.push(event);
					}

					if (event.eventType === 'TRIP') {
						$scope.dados.tripEvents.push(event);
					}

					if (event.eventType === 'TIME') {
						$scope.dados.timeEvents.push(event);
					}

				}

			});

			$scope.dados.connectionTimes = $scope.dados.connectionEvents.slice(-200);
			$scope.dados.tripTimes = $scope.dados.tripEvents.slice(-200);

		}
	}
}
