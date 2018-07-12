(function() {
	'use strict';

	angular.module('xpd.admin').controller('WellUpsertController', wellUpsertController);

	wellUpsertController.$inject = ['$scope', '$uibModalInstance', 'callback', 'initialData'];

	function wellUpsertController($scope, $modalInstance, callback, initialData) {
		let vm = this;

		vm.actionButtonClose = actionButtonClose;
		vm.actionButtonSave = actionButtonSave;
		vm.changeOnshore = changeOnshore;

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
			}
		}

	}

})();
