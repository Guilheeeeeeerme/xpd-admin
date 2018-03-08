(function () {
	'use strict';

	angular.module('xpd.admin')
		.controller('UpsertFunctionController', upsertFunctionController);

	upsertFunctionController.$inject = ['$scope', '$uibModalInstance', 'setupAPIService', 'insertFunctionCallback', 'updateFunctionCallback', 'removeFunctionCallback', '$function'];

	function upsertFunctionController($scope, $modalInstance, setupAPIService, insertFunctionCallback, updateFunctionCallback, removeFunctionCallback, $function) {

		if(!Window.UpsertFunctionController)
			Window.UpsertFunctionController = [];

		Window.UpsertFunctionController.push($modalInstance.close);

		$modalInstance.close = function(){
			while(Window.UpsertFunctionController && Window.UpsertFunctionController.length > 0){
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

			var func = {
				id: $scope.modalData.id || null,
				name: $scope.modalData.name,
			};

			console.log(func);

			if (func.id !== null){
				setupAPIService.updateObject('setup/function', func, function(response){
					func = response.data;
					$modalInstance.close();
					updateFunctionCallback(func);
				});
			} else {
				setupAPIService.insertObject('setup/function', func, function(response){
					func = response.data;
					$modalInstance.close();
					insertFunctionCallback(func);
				});
			}
		}

		function actionButtonRemove() {

			var func = {id: $scope.modalData.id};

			setupAPIService.removeObject('setup/function', func, function(response){
				func = response.data;
				$modalInstance.close();
				removeFunctionCallback(func);
			});
		}
	}

})();
