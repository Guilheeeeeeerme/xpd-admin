(function() {

	'use strict',

	angular.module('xpd.admin').controller('TrackingUpdateTimesController', trackingUpdateTimesController);

	trackingUpdateTimesController.$inject = ['$scope', '$uibModalInstance', 'selectedEvent', 'confirmCallback', 'changeEventStatusCallback'];

	function trackingUpdateTimesController($scope, $uibModalInstance, selectedEvent, confirmCallback, changeEventStatusCallback) {

		const vm = this;

		const useful = selectedEvent.useful;

		$scope.selectedEvent = angular.copy(selectedEvent);

		vm.actionButtonClose = actionButtonClose;
		vm.actionButtonSave = actionButtonSave;

		function actionButtonClose() {
			$uibModalInstance.close();
		}

		function actionButtonSave() {

			if (!angular.equals(selectedEvent, $scope.selectedEvent)) {
				selectedEvent = $scope.selectedEvent;
				if (useful != selectedEvent.useful) {
					changeEventStatusCallback(selectedEvent);
				} else {
					confirmCallback(selectedEvent);
				}
			}

			$uibModalInstance.close();
		}

	}

})();
