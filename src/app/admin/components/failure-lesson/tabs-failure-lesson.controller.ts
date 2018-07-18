export class TabsFailureLLCtrl {

	// 'use strict';

	// 	.controller('TabsFailureLLCtrl', TabsFailureLLCtrl);

	public static $inject = ['$scope', '$uibModalInstance'];
	public modalActionButtonClose: () => void;

	constructor($scope, $uibModalInstance) {
		const vm = this;

		$scope.controller = vm;

		vm.modalActionButtonClose = modalActionButtonClose;

		function modalActionButtonClose() {
			$uibModalInstance.close();
		}

	}

}
