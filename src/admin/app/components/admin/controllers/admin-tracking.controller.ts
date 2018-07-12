(function() {
	'use strict';

	angular.module('xpd.admin').controller('AdminTrackingController', adminTrackingController);

	adminTrackingController.$inject = ['$scope', '$q', 'operationDataFactory', 'eventDetailsModal', 'failureModal', 'eventlogSetupAPIService', 'lessonLearnedModal', 'failureSetupAPIService', 'lessonLearnedSetupAPIService', 'dialogFactory', '$rootScope'];

	function adminTrackingController($scope, $q, operationDataFactory, eventDetailsModal, failureModal, eventlogSetupAPIService, lessonLearnedModal, failureSetupAPIService, lessonLearnedSetupAPIService, dialogFactory, $rootScope) {

		let vm = this;

		let eventStartTime, eventEndTime, eventId;
		let listTrackingEventByOperationPromise = null;

		vm.actionOpenDropdownMenu = actionOpenDropdownMenu;
		vm.actionClickEventDetailsButton = actionClickEventDetailsButton;
		vm.actionClickFailuresButton = actionClickFailuresButton;
		vm.actionClickLessonsLearnedButton = actionClickLessonsLearnedButton;

		$rootScope.XPDmodule = 'admin';

		operationDataFactory.openConnection([]).then(function(response) {
			operationDataFactory = response;
			$scope.operationData = operationDataFactory.operationData;
		});

		loadEvents();

		operationDataFactory.addEventListener('adminTrackingController', 'setOnEventChangeListener', loadEvents);
		operationDataFactory.addEventListener('adminTrackingController', 'setOnParallelEventChangeListener', loadEvents);

		function loadEvents() {

			if ($scope.operationData != null &&
				$scope.operationData.operationContext &&
				$scope.operationData.operationContext.currentOperation &&
				$scope.operationData.operationContext.currentOperation.running) {

				if (!listTrackingEventByOperationPromise) {
					listTrackingEventByOperationPromise = listTrackingEventByOperation($scope.operationData.operationContext.currentOperation.id);

					listTrackingEventByOperationPromise.then(function(trackingEvents) {
						organizeEventsOnLists(trackingEvents);
						listTrackingEventByOperationPromise = null;
					});
				}
			}

		}

		function actionOpenDropdownMenu($event, eventLog) {

			let modalOption = document.querySelector('.slips-to-slips-dropdown-menu');

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
			eventDetailsModal.open(eventId);
		}

		function actionClickFailuresButton() {
			failureModal.open(
				getSelectedEvent(),
				insertFailureCallback,
				updateFailureCallback,
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
			let operationId = $scope.operationData.operationContext.currentOperation.id;
			let start = new Date(eventStartTime);
			let end = new Date(eventEndTime);

			let selectedEvent = {
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
			return $q(function(resolve, reject) {
				eventlogSetupAPIService.listTrackingEventByOperation(operationId, resolve, reject);
			});
		}

		function organizeEventsOnLists(trackingEvents) {

			$scope.dados.connectionEvents = [];
			$scope.dados.tripEvents = [];
			$scope.dados.timeEvents = [];
			$scope.dados.connectionTimes = [];
			$scope.dados.tripTimes = [];

			trackingEvents.map(function(event) {

				if (event.id && event.duration) {

					if (event.eventType == 'CONN') {
						$scope.dados.connectionEvents.push(event);
					}

					if (event.eventType == 'TRIP') {
						$scope.dados.tripEvents.push(event);
					}

					if (event.eventType == 'TIME') {
						$scope.dados.timeEvents.push(event);
					}

				}

			});

			$scope.dados.connectionTimes = $scope.dados.connectionEvents.slice(-200);
			$scope.dados.tripTimes = $scope.dados.tripEvents.slice(-200);

		}
	}
})();
