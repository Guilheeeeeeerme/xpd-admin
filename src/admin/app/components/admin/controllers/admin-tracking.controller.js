(function () {
	'use strict';

	angular.module('xpd.admin').controller('AdminTrackingController', adminTrackingController);

	adminTrackingController.$inject = ['$scope', '$uibModal', 'operationDataFactory', 'eventDetailsModal', 'failureModal', 'eventlogSetupAPIService', 'lessonLearnedModal', 'setupAPIService', 'dialogFactory', '$rootScope'];

	function adminTrackingController($scope, $uibModal, operationDataFactory, eventDetailsModal, failureModal, eventlogSetupAPIService, lessonLearnedModal, setupAPIService, dialogFactory, $rootScope) {

		var vm = this;

		var startTime, endTime;

		vm.actionBarClick = actionBarClick;
		vm.actionBarDoubleClick = actionBarDoubleClick;
		vm.actionClickFailuresButton = actionClickFailuresButton;
		vm.actionClickLessonsLearnedButton = actionClickLessonsLearnedButton;

		$rootScope.XPDmodule = 'admin';

		operationDataFactory.operationData = [];
		// $scope.operationData = operationDataFactory.operationData;

		buildEventStruture();

		operationDataFactory.addEventListener('adminTrackingController', 'setOnEventChangeListener', buildEventStruture);
		operationDataFactory.addEventListener('adminTrackingController', 'setOnCurrentEventListener', buildEventStruture);
		operationDataFactory.addEventListener('adminTrackingController', 'setOnNoCurrentEventListener', buildEventStruture);
		operationDataFactory.addEventListener('adminTrackingController', 'setOnEventLogUpdateListener', buildEventStruture);
		operationDataFactory.addEventListener('adminTrackingController', 'setOnWaitEventListener', buildEventStruture);

		function buildEventStruture() {
			getOperationEvents();
			// getConnectionTimes();
			// getTripTimes();
		}

		function actionBarClick($event, eventLog) {
			// $event.preventDefault();
			$event.stopPropagation();

			var modalOption = document.querySelector('.slips-to-slips-dropdown-menu');

			modalOption.style.top = ($event.clientY - 60) + 'px';
			modalOption.style.left = ($event.clientX) + 'px';

			if (!$scope.flags.modalFailureLessonLearned) {
				$scope.flags.modalFailureLessonLearned = !$scope.flags.modalFailureLessonLearned;
			}

			startTime = eventLog.startTime;
			endTime = eventLog.endTime;

		}

		function actionBarDoubleClick($event, eventLog){

			eventDetailsModal.open(eventLog.id);
		}

		function actionClickFailuresButton(){
			var operationId = $scope.operationData.operationContext.currentOperation.id;
			var start = new Date(startTime);
			var end = new Date(endTime);

			var selectedFailure = {
				operation: {
					'id': operationId
				},
				startTime: start,
				endTime: end
			};

			failureModal.open(selectedFailure, insertFailureCallback, updateFailureCallback);
		}

		function actionClickLessonsLearnedButton(){
			var operationId = $scope.operationData.operationContext.currentOperation.id;
			var start = new Date(startTime);
			var end = new Date(endTime);

			var selectedLessonLearned = {
				operation: {
					'id': operationId
				},
				startTime: start,
				endTime: end
			};

			lessonLearnedModal.open(selectedLessonLearned, insertLessonLearnedCallback, updateLessonLearnedCallback);
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

		function getOperationEvents() {
			if ($scope.operationData.operationContext.currentOperation != null) {

				eventlogSetupAPIService.listTrackingEventByOperation($scope.operationData.operationContext.currentOperation.id, function (trackingEvents) {
					// $scope.dados.bitDepthByEvents = [];
					$scope.dados.connectionEvents = [];
					$scope.dados.tripEvents = [];
					$scope.dados.timeEvents = [];
					$scope.dados.connectionTimes = [];
					$scope.dados.tripTimes = [];

					trackingEvents.map(function (event) {
						event.startTime = new Date(event.startTime).getTime();
						event.endTime = new Date(event.endTime).getTime();

						// if (event.eventType != 'TIME' && event.duration) {
						// 	$scope.dados.bitDepthByEvents.push({
						// 		x: event.startTime,
						// 		y: null
						// 	});
						// 	$scope.dados.bitDepthByEvents.push({
						// 		x: event.startTime,
						// 		y: event.startBitDepth,
						// 	});
						// 	$scope.dados.bitDepthByEvents.push({
						// 		x: event.endTime,
						// 		y: event.endBitDepth
						// 	});
						// 	$scope.dados.bitDepthByEvents.push({
						// 		x: event.endTime,
						// 		y: null
						// 	});

						// }

						if (event.eventType == 'CONN')
							$scope.dados.connectionEvents.push(event);

						if (event.eventType == 'TRIP')
							$scope.dados.tripEvents.push(event);

						if (event.eventType == 'TIME')
							$scope.dados.timeEvents.push(event);

					});

					$scope.dados.connectionTimes = $scope.dados.connectionEvents.slice(-200);
					$scope.dados.tripTimes = $scope.dados.tripEvents.slice(-200);
					
				});
			}
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
