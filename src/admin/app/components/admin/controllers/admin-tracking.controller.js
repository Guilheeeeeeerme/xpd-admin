(function () {
	'use strict';

	angular.module('xpd.admin').controller('AdminTrackingController', adminTrackingController);

	adminTrackingController.$inject = ['$scope', '$uibModal', 'operationDataFactory', 'failureModal', 'eventlogSetupAPIService', 'lessonLearnedModal', 'setupAPIService', 'dialogFactory', '$rootScope'];

	function adminTrackingController($scope, $uibModal, operationDataFactory, failureModal, eventlogSetupAPIService, lessonLearnedModal, setupAPIService, dialogFactory, $rootScope) {

		var vm = this;

		var startTime, endTime;

		$scope.eventFailure = {};

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

			var eventType;
			if(eventLog.eventType == 'TRIP'){
				eventType = 'Trip';
			}else if(eventLog.eventType == 'CONN'){
				eventType = 'Connection';
			}

			var str = eventLog.state;

			$scope.eventFailure = {
				eventType: eventType,
				state: str.substr(0,1).toUpperCase() + str.substr(1),
				startTime: eventLog.startTime,
				endTime: eventLog.endTime,
				duration: eventLog.duration,
				score: eventLog.score,
				failures: eventLog.failures,
				lessonsLearned: eventLog.lessonsLearned,
				alarms: eventLog.alarms
			};

			$scope.$modalInstance = $uibModal.open({
				animation: true,
				keyboard: false,
				backdrop: 'static',
				size: 'modal-sm',
				windowClass: 'xpd-operation-modal',
				templateUrl: 'app/components/admin/views/modal/event.modal.html',
				controller: 'FailuresController as fController',
				scope: $scope
			});
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
				eventlogSetupAPIService.listByOperation($scope.operationData.operationContext.currentOperation.id, function (events) {

					events.map( function (event) {
						event.startTime = new Date(event.startTime).getTime();

						if(event.eventType == 'CONN')
							$scope.dados.connectionEvents.push(event);
						
						if(event.eventType == 'TRIP')
							$scope.dados.tripEvents.push(event);

						if(event.eventType == 'TIME')
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

		$scope.modalActionButtonClose = function() {
			$scope.eventFailure = {};

			$scope.$modalInstance.close();
		};
	}
})();
