import * as angular from 'angular';
import { IModalInstanceService } from '../../../../../../../node_modules/@types/angular-ui-bootstrap';

export class WellUpsertController {
	// 'use strict';

	// angular.module('xpd.admin').controller('WellUpsertController', wellUpsertController);

	public static $inject = ['$scope', '$uibModalInstance', 'callback', 'initialData'];
	public actionButtonClose: () => void;
	public actionButtonSave: () => void;
	public changeOnshore: () => void;

	constructor ($scope, $modalInstance: IModalInstanceService, callback, initialData) {
		const vm = this;

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

}
