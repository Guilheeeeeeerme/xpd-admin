(function () {
	'use strict';

	angular.module('xpd.admin.login').controller('MasterLoginController', MasterLoginController);

	MasterLoginController.$inject = ['$scope', '$uibModalInstance', 'callback'];

	function MasterLoginController($scope, $uibModalInstance, callback) {

		var vm = this;

		vm.actionButtonClose = actionButtonClose;
		vm.actionButtonLogin = actionButtonLogin;

		function actionButtonClose() {
			callback(null);
			$uibModalInstance.close();
		}

		function actionButtonLogin() {
			callback($scope.modalData);
			$uibModalInstance.close();
		}

	}

})();
