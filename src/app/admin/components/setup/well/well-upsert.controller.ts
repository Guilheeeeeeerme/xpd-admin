import * as angular from 'angular';
import { IModalInstanceService } from 'angular-ui-bootstrap';

export class WellUpsertController {
	// 'use strict';

	public static $inject = ['$scope', '$uibModalInstance', 'callback', 'initialData'];

	constructor(
		private $scope: any,
		private $modalInstance: IModalInstanceService,
		private callback,
		private initialData) {

		$scope.modalData = angular.copy(initialData);
	}

	public actionButtonClose() {
		this.$modalInstance.close();
	}

	public actionButtonSave() {
		this.callback(this.$scope.modalData);
		this.$modalInstance.close();
	}

	public changeOnshore() {
		if (this.$scope.modalData.onshore) {
			this.$scope.modalData.waterDepth = 0;
		}
	}

}
