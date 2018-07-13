import * as angular from 'angular';
import { IModalInstanceService } from '../../../../../../../node_modules/@types/angular-ui-bootstrap';

export class SectionUpsertController {
	// 'use strict';

	// angular.module('xpd.admin').controller('SectionUpsertController', sectionUpsertController);

	public static $inject = ['$scope', '$uibModalInstance', 'callback', 'initialData'];
	public actionButtonClose: () => void;
	public actionButtonSave: () => void;

	constructor($scope, $modalInstance: IModalInstanceService, callback, initialData) {
		const vm = this;

		vm.actionButtonClose = actionButtonClose;
		vm.actionButtonSave = actionButtonSave;

		$scope.modalData = angular.copy(initialData);

		function actionButtonClose() {
			$modalInstance.close();
		}

		function actionButtonSave() {
			callback($scope.modalData);
			$modalInstance.close();
		}

	}

}
