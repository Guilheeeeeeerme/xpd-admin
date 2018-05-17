(function () {

	'use strict',

	angular.module('xpd.modal-event-details').controller('modalEventDetailsController', modalEventDetailsController);

	modalEventDetailsController.$inject = ['$scope', '$uibModalInstance', 'eventlogSetupAPIService', 'eventId'];

	function modalEventDetailsController($scope, $uibModalInstance, eventlogSetupAPIService, eventId) {
		var vm = this;

		var selectedEvent = null;
		$scope.eventDetails = {};

		vm.modalActionButtonClose = modalActionButtonClose;

		getEventById();

		function getEventById() {
			eventlogSetupAPIService.getWithDetails(eventId, function (event) {
				selectedEvent = event;
				prepareEventToModal();
			});
		}

		// prepareEventToModal();

		function prepareEventToModal() {

			var eventType;
			if (selectedEvent.eventType == 'TRIP') {
				eventType = 'Trip';
			} else if (selectedEvent.eventType == 'CONN') {
				eventType = 'Connection';
			}

			var str = selectedEvent.state;

			$scope.eventDetails = {
				eventType: eventType,
				state: str.substr(0, 1).toUpperCase() + str.substr(1),
				startTime: new Date(selectedEvent.startTime),
				endTime: new Date(selectedEvent.endTime),
				duration: selectedEvent.duration,
				score: selectedEvent.score,
				failures: selectedEvent.failures,
				lessonsLearned: selectedEvent.lessonsLearned,
				alarms: selectedEvent.alarms
			};
		}

		function modalActionButtonClose() {
			$scope.eventDetails = {};

			$uibModalInstance.close();
		}

	}
})();
