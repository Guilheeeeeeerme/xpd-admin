(function() {

	'use strict';

	angular.module('xpd.failure-controller')
		.controller('TabsCtrl', TabsCtrl);

	TabsCtrl.$inject = ['$scope', '$uibModalInstance'];

	function TabsCtrl($scope, $uibModalInstance) {
		let vm = this;

		$scope.controller = vm;

		vm.modalActionButtonClose = modalActionButtonClose;

		function modalActionButtonClose() {
			$uibModalInstance.close();
		}

	}

})();
