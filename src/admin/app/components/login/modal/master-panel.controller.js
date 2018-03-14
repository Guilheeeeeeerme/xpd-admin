(function () {
	'use strict';

	angular.module('xpd.admin.login').controller('MasterPanelController', MasterPanelController);

	MasterPanelController.$inject = ['$scope', '$uibModalInstance', 'setupAPIService'];

	function MasterPanelController($scope, $uibModalInstance, setupAPIService) {

		var vm = this;

		vm.actionButtonClose = actionButtonClose;
		vm.actionButtonSave = actionButtonSave;
		vm.actionButtonAdd = actionButtonAdd;
		vm.actionButtonEdit = actionButtonEdit;
		vm.actionButtonRemove = actionButtonRemove;

		$scope.modalData = {};

		loadUsersList();

		function loadUsersList() {
			setupAPIService.getList('setup/admin-user', function (response) {
				response = response.data;
				$scope.modalData.usersList = response;
			});
		}

		function actionButtonAdd() {
			$scope.viewControl.showList = false;
			$scope.modalData.upsertData = {};
		}

		function actionButtonClose() {
			$uibModalInstance.close();
		}

		function actionButtonEdit(user) {
			$scope.viewControl.showList = false;
			$scope.modalData.upsertData = user;
		}

		function actionButtonRemove(index, user) {
			setupAPIService.removeObject('setup/admin-user', user, function (data) {
				loadUsersList();
				$scope.viewControl.showList = true;
			});
		}

		function actionButtonSave() {

			var user = angular.copy($scope.modalData.upsertData);
			delete user.rpassword;

			setupAPIService.updateObject('setup/admin-user', user, function (data) {
				$scope.viewControl.showList = true;
				loadUsersList();
			}, function (error) {
				console.log(error);
			});

		}

	}

})();
