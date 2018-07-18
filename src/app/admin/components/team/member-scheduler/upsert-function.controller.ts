import * as angular from 'angular';
import { IModalServiceInstance } from 'angular-ui-bootstrap';
import { ScheduleSetupAPIService } from '../../../../shared/xpd.setupapi/schedule-setupapi.service';

export class UpsertFunctionController {
	// 'use strict';

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
		private $scope: any,
		private $modalInstance: IModalServiceInstance,
		private scheduleSetupAPIService: ScheduleSetupAPIService,
		private insertFunctionCallback: any,
		private updateFunctionCallback: any,
		private removeFunctionCallback: any,
		private $function) {

		if (!(Window as any).UpsertFunctionController) {
			(Window as any).UpsertFunctionController = [];
		}

		(Window as any).UpsertFunctionController.push($modalInstance.close);

		$modalInstance.close = () => {
			while ((Window as any).UpsertFunctionController && (Window as any).UpsertFunctionController.length > 0) {
				(Window as any).UpsertFunctionController.pop()();
			}
		};

		$scope.modalData = angular.copy($function);
	}

	public actionButtonCancel() {
		this.$modalInstance.close();
	}

	public actionButtonAdd() {

		const func = {
			id: this.$scope.modalData.id || null,
			name: this.$scope.modalData.name,
		};

		console.log(func);

		if (func.id !== null) {
			this.scheduleSetupAPIService.updateFunction(func).then((func1) => {
				this.$modalInstance.close();
				this.updateFunctionCallback(func1);
			});
		} else {
			this.scheduleSetupAPIService.insertFunction(func).then((func1) => {
				this.$modalInstance.close();
				this.insertFunctionCallback(func1);
			});
		}
	}

	public actionButtonRemove() {

		const func = { id: this.$scope.modalData.id };

		this.scheduleSetupAPIService.removeFunction(func).then((func1) => {
			this.$modalInstance.close();
			this.removeFunctionCallback(func1);
		});
	}

}
