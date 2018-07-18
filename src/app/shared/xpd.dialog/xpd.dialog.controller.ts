import { IModalServiceInstance } from 'angular-ui-bootstrap';

// (function() {
// 	'use strict';

// 		.factory('dialogService', dialogService)
// 		.controller('dialogController', dialogController);

// 	dialogController.$inject = ['$scope', '$uibModalInstance', 'content', 'confirmCallback', 'cancelCallback'];
export class DialogController {

	public static $inject: string[] = ['$scope', '$uibModalInstance', 'content', 'confirmCallback', 'cancelCallback'];

	constructor(
		$scope: any,
		$uibModalInstance: IModalServiceInstance,
		content: any,
		confirmCallback: any,
		cancelCallback: any) {

		$scope.content = content;

		$scope.confirmCallback = confirmCallback;
		$scope.cancelCallback = cancelCallback;

		$scope.actionButtonYes = function () {
			$uibModalInstance.close();
			if (confirmCallback) {
				confirmCallback();
			}
		};

		$scope.actionButtonNo = function () {
			$uibModalInstance.close();
			if (cancelCallback) {
				cancelCallback();
			}
		};
	}

}
