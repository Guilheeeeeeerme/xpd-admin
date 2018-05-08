(function () {
	'use strict';

	angular.module('xpd.admin').controller('AdminTrackingController', adminTrackingController);

	adminTrackingController.$inject = ['$scope', '$uibModal', '$q', 'operationDataFactory', 'eventDetailsModal', 'failureModal', 'eventlogSetupAPIService', 'lessonLearnedModal', 'setupAPIService', 'dialogFactory', '$rootScope'];

	function adminTrackingController($scope, $uibModal, $q, operationDataFactory, eventDetailsModal, failureModal, eventlogSetupAPIService, lessonLearnedModal, setupAPIService, dialogFactory, $rootScope) {

		var vm = this;

		var eventStartTime, eventEndTime, eventId, operationId;

		vm.actionOpenDropdownMenu = actionOpenDropdownMenu;
		vm.actionClickEventDetailsButton = actionClickEventDetailsButton;
		vm.actionClickFailuresButton = actionClickFailuresButton;
		vm.actionClickLessonsLearnedButton = actionClickLessonsLearnedButton;

		$rootScope.XPDmodule = 'admin';

		operationDataFactory.operationData = [];
		// $scope.operationData = operationDataFactory.operationData;

		buildEventStruture();

		operationDataFactory.addEventListener('adminTrackingController', 'setOnEventChangeListener', buildEventStruture);
		operationDataFactory.addEventListener('adminTrackingController', 'setOnParallelEventChangeListener', buildEventStruture);

		function buildEventStruture(context) {

			if ($scope.operationData != null && 
				$scope.operationData.operationContext && 
				$scope.operationData.operationContext.currentOperation && 
				$scope.operationData.operationContext.currentOperation.running) {

				if(operationId != $scope.operationData.operationContext.currentOperation.id){
					operationId = $scope.operationData.operationContext.currentOperation.id;

					listTrackingEventByOperation(operationId).then(function(trackingEvents){

						$scope.dados.connectionEvents = [];
						$scope.dados.tripEvents = [];
						$scope.dados.timeEvents = [];
						$scope.dados.connectionTimes = [];
						$scope.dados.tripTimes = [];

						organizeEventsOnLists(trackingEvents);
					
					});

				}

			}



			// getConnectionTimes();
			// getTripTimes();
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

		function actionClickFailuresButton(){
			failureModal.open(
				getSelectedEvent(),
				insertFailureCallback,
				updateFailureCallback
			);
		}

		function actionClickLessonsLearnedButton(){
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

		function insertFailureCallback(failure){
			console.log('Insert Failure Successfully!');
		}

		function updateFailureCallback(failure){
			setupAPIService.updateObject(
				'setup/failure',
				failure
			);
		}

		function insertLessonLearnedCallback(lessonLearned){
			setupAPIService.insertObject(
				'setup/lessonlearned',
				lessonLearned);
		}

		function updateLessonLearnedCallback(lessonLearned){
			setupAPIService.updateObject(
				'setup/lessonlearned',
				lessonLearned
			);
		}

		function listTrackingEventByOperation(operationId) {
			return $q(function(resolve, reject){
				eventlogSetupAPIService.listTrackingEventByOperation(operationId, resolve, reject);
			});
		}

		function addOrUpdateEvent(events, event) {
			var exists = false;

			events = events.map(function(e){
				if(e.id == event.id){
					exists = true;
					return event;
				}else{
					return e;
				}
			});

			if(!exists){
				events.push(event);
			}

			return events;

		}

		function organizeEventsOnLists(trackingEvents) {

			trackingEvents.map(function (event) {

				if(event.id && event.duration){

					if (event.eventType == 'CONN')
						$scope.dados.connectionEvents = addOrUpdateEvent($scope.dados.connectionEvents, event);

					if (event.eventType == 'TRIP')
						$scope.dados.tripEvents = addOrUpdateEvent($scope.dados.tripEvents, event);

					if (event.eventType == 'TIME')
						$scope.dados.timeEvents = addOrUpdateEvent($scope.dados.timeEvents, event);					
				
				}


			});

			$scope.dados.connectionTimes = $scope.dados.connectionEvents.slice(-200);
			$scope.dados.tripTimes = $scope.dados.tripEvents.slice(-200);
		
		}

		// function getConnectionTimes() {

		// 	if ($scope.operationData.operationContext.currentOperation != null) {
		// 		eventlogSetupAPIService.listByType('CONN', $scope.operationData.operationContext.currentOperation.id, 200, function (times) {
		// 			times.map( function (time) {
		// 				time.startTime = new Date(time.startTime).getTime();
		// 			});
					
		// 			$scope.dados.connectionTimes = times;
		// 		});
		// 	}
		// }

		// function getTripTimes() {

		// 	if ($scope.operationData.operationContext.currentOperation != null) {
		// 		eventlogSetupAPIService.listByType('TRIP', $scope.operationData.operationContext.currentOperation.id, 200, function (times) {
		// 			times.map(function (time) {
		// 				time.startTime = new Date(time.startTime).getTime();
		// 			});
		// 			$scope.dados.tripTimes = times;
		// 		});
		// 	}
		// }
	}
})();
