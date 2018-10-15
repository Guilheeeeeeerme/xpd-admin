import * as angular from 'angular';
import { IModalInstanceService } from 'angular-ui-bootstrap';

export class WellUpsertController {
	// 'use strict';

	public static $inject = ['$scope', '$uibModalInstance', 'callback', 'well'];

	constructor(
		private $scope: any,
		private $modalInstance: IModalInstanceService,
		private callback,
		private well) {

		$scope.well = angular.copy(well);
	}

	public actionButtonClose() {
		this.$modalInstance.close();
	}

	public actionButtonSave() {
		this.callback(this.$scope.well);
		this.$modalInstance.close();
	}

}
