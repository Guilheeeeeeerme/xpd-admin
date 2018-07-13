import * as angular from 'angular';
import { IModalInstanceService } from '../../../../../../node_modules/@types/angular-ui-bootstrap';

export class TrackingUpdateTimesController {

	// 'use strict',

	// angular.module('xpd.admin').controller('TrackingUpdateTimesController', trackingUpdateTimesController);

	public static $inject = ['$scope', '$uibModalInstance', 'selectedEvent', 'confirmCallback', 'changeEventStatusCallback'];
	public actionButtonClose: () => void;
	public actionButtonSave: () => void;

	constructor($scope, $uibModalInstance: IModalInstanceService, selectedEvent, confirmCallback, changeEventStatusCallback) {

		const vm = this;

		const useful = selectedEvent.useful;

		$scope.selectedEvent = angular.copy(selectedEvent);

		vm.actionButtonClose = actionButtonClose;
		vm.actionButtonSave = actionButtonSave;

		function actionButtonClose() {
			$uibModalInstance.close();
		}

		function actionButtonSave() {

			if (!angular.equals(selectedEvent, $scope.selectedEvent)) {
				selectedEvent = $scope.selectedEvent;
				if (useful != selectedEvent.useful) {
					changeEventStatusCallback(selectedEvent);
				} else {
					confirmCallback(selectedEvent);
				}
			}

			$uibModalInstance.close();
		}

	}

}
