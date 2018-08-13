import * as angular from 'angular';
import { IModalInstanceService } from 'angular-ui-bootstrap';

export class SectionUpsertController {
	// 'use strict';

	public static $inject = ['$scope', '$uibModalInstance', 'callback', 'section'];

	constructor(
		private $scope,
		private $modalInstance: IModalInstanceService,
		private callback,
		private section) {
		$scope.section = angular.copy(section);
	}

	public actionButtonClose() {
		this.$modalInstance.close();
	}

	public actionButtonSave() {
		this.callback(this.$scope.section);
		this.$modalInstance.close();
	}

}
