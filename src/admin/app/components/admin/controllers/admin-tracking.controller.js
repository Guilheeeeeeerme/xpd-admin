(function () {
	'use strict';

	angular.module('xpd.admin').controller('AdminTrackingController', adminTrackingController);

	adminTrackingController.$inject = ['$scope', '$uibModal', '$q', 'operationDataFactory', 'eventDetailsModal', 'failureModal', 'eventlogSetupAPIService', 'lessonLearnedModal', 'setupAPIService', 'dialogFactory', '$rootScope'];

	function adminTrackingController($scope, $uibModal, $q, operationDataFactory, eventDetailsModal, failureModal, eventlogSetupAPIService, lessonLearnedModal, setupAPIService, dialogFactory, $rootScope) {

		var vm = this;

		var eventStartTime, eventEndTime, eventId;

		var eventsPromise = null;
		var parallelEventsPromise = null;

		vm.actionOpenDropdownMenu = actionOpenDropdownMenu;
		vm.actionClickEventDetailsButton = actionClickEventDetailsButton;
		vm.actionClickFailuresButton = actionClickFailuresButton;
		vm.actionClickLessonsLearnedButton = actionClickLessonsLearnedButton;

		$rootScope.XPDmodule = 'admin';

		operationDataFactory.operationData = [];
		// $scope.operationData = operationDataFactory.operationData;

		loadEvents();
		loadParallelEvents();

		operationDataFactory.addEventListener('adminTrackingController', 'setOnEventChangeListener', loadAllEvents);
		operationDataFactory.addEventListener('adminTrackingController', 'setOnParallelEventChangeListener', loadAllEvents);

		function loadAllEvents(){
			loadEvents();
			loadParallelEvents();
		}

		function loadEvents(context) {

			if ($scope.operationData != null &&
				$scope.operationData.operationContext &&
				$scope.operationData.operationContext.currentOperation &&
				$scope.operationData.operationContext.currentOperation.running) {

				eventsPromise = listTrackingEventByOperation($scope.operationData.operationContext.currentOperation.id);

				loadingDone();

			}

		}

		function loadParallelEvents(context) {

			if ($scope.operationData != null &&
				$scope.operationData.operationContext &&
				$scope.operationData.operationContext.currentOperation &&
				$scope.operationData.operationContext.currentOperation.running) {

				parallelEventsPromise = listTrackingParallelEventByOperation($scope.operationData.operationContext.currentOperation.id);

				loadingDone();

			}

		}

		function loadingDone(){

			var promises = [eventsPromise, parallelEventsPromise].filter(function(promise){
				return promise != null;
			});

			$q.all(promises).then(function(results){

				var events = [];

				for(var i in results){
					events = events.concat(results[i]);
				}

				organizeEventsOnLists(events);

			});
		}

		function actionOpenDropdownMenu($event, eventLog) {

			var modalOption = document.querySelector('.slips-to-slips-dropdown-menu');

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
				updateFailureCallback
			);
		}

		function actionClickLessonsLearnedButton() {
			lessonLearnedModal.open(
				getSelectedEvent(),
				insertLessonLearnedCallback,
				updateLessonLearnedCallback
			);
		}

		function getSelectedEvent() {
			var operationId = $scope.operationData.operationContext.currentOperation.id;
			var start = new Date(eventStartTime);
			var end = new Date(eventEndTime);

			var selectedEvent = {
				operation: {
					'id': operationId
				},
				startTime: start,
				endTime: end
			};

			return selectedEvent;
		}

		function insertFailureCallback(failure) {
			console.log('Insert Failure Successfully!');
		}

		function updateFailureCallback(failure) {
			setupAPIService.updateObject(
				'setup/failure',
				failure
			);
		}

		function insertLessonLearnedCallback(lessonLearned) {
			setupAPIService.insertObject(
				'setup/lessonlearned',
				lessonLearned);
		}

		function updateLessonLearnedCallback(lessonLearned) {
			setupAPIService.updateObject(
				'setup/lessonlearned',
				lessonLearned
			);
		}

		function listTrackingEventByOperation(operationId) {
			return $q(function (resolve, reject) {
				eventlogSetupAPIService.listTrackingEventByOperation(operationId, resolve, reject);
			});
		}

		function listTrackingParallelEventByOperation(operationId) {
			return $q(function (resolve, reject) {
				eventlogSetupAPIService.listTrackingParallelEventByOperation(operationId, resolve, reject);
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

					if (event.eventType == 'CONN')
						$scope.dados.connectionEvents.push(event);

					if (event.eventType == 'TRIP')
						$scope.dados.tripEvents.push(event);

					if (event.eventType == 'TIME')
						$scope.dados.timeEvents.push(event);

				}

			});

			$scope.dados.connectionTimes = $scope.dados.connectionEvents.slice(-200);
			$scope.dados.tripTimes = $scope.dados.tripEvents.slice(-200);

		}
	}
})();
