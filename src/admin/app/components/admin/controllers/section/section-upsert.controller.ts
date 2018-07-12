(function() {
	'use strict';

	angular.module('xpd.admin').controller('SectionUpsertController', sectionUpsertController);

	sectionUpsertController.$inject = ['$scope', '$uibModalInstance', 'callback', 'initialData'];

	function sectionUpsertController($scope, $modalInstance, callback, initialData) {
		const vm = this;

		vm.actionButtonClose = actionButtonClose;
		vm.actionButtonSave = actionButtonSave;

		$scope.modalData = angular.copy(initialData);

		function actionButtonClose() {
			$modalInstance.close();
		}

		function actionButtonSave() {
			callback($scope.modalData);
			$modalInstance.close();
		}

	}

})();
