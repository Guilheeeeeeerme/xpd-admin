(function() {
	'use strict';

	angular.module('xpd.admin')
		.controller('UpsertFunctionController', upsertFunctionController);

	upsertFunctionController.$inject = ['$scope', '$uibModalInstance', 'scheduleSetupAPIService', 'insertFunctionCallback', 'updateFunctionCallback', 'removeFunctionCallback', '$function'];

	function upsertFunctionController($scope, $modalInstance, scheduleSetupAPIService, insertFunctionCallback, updateFunctionCallback, removeFunctionCallback, $function) {

		if (!Window.UpsertFunctionController) {
			Window.UpsertFunctionController = [];
		}

		Window.UpsertFunctionController.push($modalInstance.close);

		$modalInstance.close = function() {
			while (Window.UpsertFunctionController && Window.UpsertFunctionController.length > 0) {
				Window.UpsertFunctionController.pop()();
			}
		};

		$scope.actionButtonAdd = actionButtonAdd;
		$scope.actionButtonCancel = actionButtonCancel;
		$scope.actionButtonRemove = actionButtonRemove;

		$scope.modalData = angular.copy($function);

		function actionButtonCancel() {
			$modalInstance.close();
		}

		function actionButtonAdd() {

			let func = {
				id: $scope.modalData.id || null,
				name: $scope.modalData.name,
			};

			console.log(func);

			if (func.id !== null) {
				scheduleSetupAPIService.updateFunction(func, function(func) {
					$modalInstance.close();
					updateFunctionCallback(func);
				});
			} else {
				scheduleSetupAPIService.insertFunction(func, function(func) {
					$modalInstance.close();
					insertFunctionCallback(func);
				});
			}
		}

		function actionButtonRemove() {

			let func = {id: $scope.modalData.id};

			scheduleSetupAPIService.removeFunction(func, function(func) {
				$modalInstance.close();
				removeFunctionCallback(func);
			});
		}
	}

})();
