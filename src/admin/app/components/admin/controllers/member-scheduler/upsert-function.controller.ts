import * as angular from 'angular';
import { IModalServiceInstance } from '../../../../../../../node_modules/@types/angular-ui-bootstrap';
import { ScheduleSetupAPIService } from '../../../../../../xpd-resources/ng/xpd.setupapi/schedule-setupapi.service';

export class UpsertFunctionController {
	// 'use strict';

	// angular.module('xpd.admin')
	// 	.controller('UpsertFunctionController', upsertFunctionController);

	// upsertFunctionController.$inject = ['$scope', '$uibModalInstance', 'scheduleSetupAPIService', 'insertFunctionCallback', 'updateFunctionCallback', 'removeFunctionCallback', '$function'];
	public static $inject: string[] = [
		'$scope',
		'$uibModalInstance',
		'scheduleSetupAPIService',
		'insertFunctionCallback',
		'updateFunctionCallback',
		'removeFunctionCallback',
		'$function'];

	constructor(
		$scope: any,
		$modalInstance: IModalServiceInstance,
		scheduleSetupAPIService: ScheduleSetupAPIService,
		insertFunctionCallback: any,
		updateFunctionCallback: any,
		removeFunctionCallback: any,
		$function) {

		if (!(Window as any).UpsertFunctionController) {
			(Window as any).UpsertFunctionController = [];
		}

		(Window as any).UpsertFunctionController.push($modalInstance.close);

		$modalInstance.close = function () {
			while ((Window as any).UpsertFunctionController && (Window as any).UpsertFunctionController.length > 0) {
				(Window as any).UpsertFunctionController.pop()();
			}
		};

		$scope.actionButtonAdd = actionButtonAdd;
		$scope.actionButtonCancel = actionButtonCancel;
		$scope.actionButtonRemove = actionButtonRemove;

		$scope.modalData = angular.copy($function);

		function actionButtonCancel() {
			$modalInstance.close();
		}

		function actionButtonAdd() {

			const func = {
				id: $scope.modalData.id || null,
				name: $scope.modalData.name,
			};

			console.log(func);

			if (func.id !== null) {
				scheduleSetupAPIService.updateFunction(func, function (func) {
					$modalInstance.close();
					updateFunctionCallback(func);
				});
			} else {
				scheduleSetupAPIService.insertFunction(func, function (func) {
					$modalInstance.close();
					insertFunctionCallback(func);
				});
			}
		}

		function actionButtonRemove() {

			const func = { id: $scope.modalData.id };

			scheduleSetupAPIService.removeFunction(func, function (func) {
				$modalInstance.close();
				removeFunctionCallback(func);
			});
		}
	}

}
