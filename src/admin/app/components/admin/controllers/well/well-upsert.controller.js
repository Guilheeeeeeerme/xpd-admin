(function () {
	'use strict';

	angular.module('xpd.admin').controller('WellUpsertController', wellUpsertController);

	wellUpsertController.$inject = ['$scope', '$uibModalInstance', 'callback', 'initialData'];

	function wellUpsertController($scope, $modalInstance, callback, initialData) {
		var vm = this;

		vm.actionButtonClose = actionButtonClose;
		vm.actionButtonSave = actionButtonSave;
		vm.changeOnshore = changeOnshore;
		vm.actionChangeWaterDepth = actionChangeWaterDepth;

		$scope.modalData = angular.copy(initialData);

		function actionButtonClose() {
			$modalInstance.close();
		}

		function actionButtonSave() {
			callback($scope.modalData);
			$modalInstance.close();
		}

		function changeOnshore() {
			if ($scope.modalData.onshore) {
				$scope.modalData.waterDepth = 0;
				$scope.modalData.holeDepth = 0;
				$scope.modalData.shoeDepth = 0;
			}
		}

		function actionChangeWaterDepth() {
			if (!($scope.modalData.holeDepth && $scope.modalData.shoeDepth) || $scope.modalData.waterDepth > ($scope.modalData.holeDepth || $scope.modalData.shoeDepth)) {
				$scope.modalData.holeDepth = $scope.modalData.waterDepth;
				$scope.modalData.shoeDepth = $scope.modalData.waterDepth;
			}			
		}

	}

})();
