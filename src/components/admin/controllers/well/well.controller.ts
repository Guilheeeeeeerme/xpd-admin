import { IModalService } from 'angular-ui-bootstrap';
import { OperationDataService } from '../../../../xpd-resources/ng/xpd.communication/operation-server-data.factory';
import { DialogService } from '../../../../xpd-resources/ng/xpd.dialog/xpd.dialog.factory';
import { SectionSetupAPIService } from '../../../../xpd-resources/ng/xpd.setupapi/section-setupapi.service';
import { WellSetupAPIService } from '../../../../xpd-resources/ng/xpd.setupapi/well-setupapi.service';

export class WellController {
	// 'use strict';

	// angular.module('xpd.admin').controller('WellController', wellController);

	public static $inject = ['$scope', '$uibModal', 'wellSetupAPIService', 'sectionSetupAPIService', 'dialogService', 'operationDataService'];
	public operationDataFactory: any;

	constructor(
		private $scope: any,
		private $modal: IModalService,
		private wellSetupAPIService: WellSetupAPIService,
		private sectionSetupAPIService: SectionSetupAPIService,
		private dialogService: DialogService,
		operationDataService: OperationDataService) {

		const vm = this;

		$scope.dados = {
			wellList: [],
		};

		operationDataService.openConnection([]).then(function (operationDataFactory: any) {
			vm.operationDataFactory = operationDataFactory;
			$scope.operationData = operationDataFactory.operationData;
		});

		this.operationDataFactory.addEventListener('wellController', 'setOnCurrentWellListener', this.loadWellList);
		this.operationDataFactory.addEventListener('wellController', 'setOnNoCurrentWellListener', this.loadWellList);
		this.operationDataFactory.addEventListener('wellController', 'setOnWellChangeListener', this.loadWellList);

		this.loadWellList();

	}

	public actionButtonEditWell(well) {
		const self = this;

		this.$modal.open({
			animation: true,
			keyboard: false,
			backdrop: 'static',
			size: 'lg',
			templateUrl: 'app/components/admin/views/modal/well-upsert.modal.html',
			controller: 'WellUpsertController as wuController',
			resolve: {
				callback() {
					return self.upsertCallback;
				},
				initialData() {
					return well;
				},
			},
		});
	}

	public actionButtonAddWell() {
		const self = this;

		this.$modal.open({
			animation: true,
			keyboard: false,
			backdrop: 'static',
			size: 'lg',
			templateUrl: 'app/components/admin/views/modal/well-upsert.modal.html',
			controller: 'WellUpsertController as wuController',
			resolve: {
				callback() {
					return self.upsertCallback;
				},
				initialData() {
					return {};
				},
			},
		});
	}

	public actionButtonRemoveWell(well) {
		const self = this;

		this.sectionSetupAPIService.getListOfSectionsByWell(well.id, function (sectionList) {
			if (sectionList.length === 0) {
				self.removeWell(well);
			} else {
				self.dialogService.showMessageDialog('You can\'t delete a Well with Sections and Operations inside.', 'Unable to Remove Well');
			}
		});
	}

	public actionButtonMakeCurrent(well) {

		if (this.$scope.operationData.operationContext.currentOperation && this.$scope.operationData.operationContext.currentOperation.running) {
			this.dialogService.showMessageDialog('Unable to change Well due to Running Operation.', 'Error');
		} else {
			this.operationDataFactory.emitMakeCurrentWell(well);
		}
	}

	public actionButtonMakeNotCurrent(well) {

		if (this.$scope.operationData.operationContext.currentOperation && this.$scope.operationData.operationContext.currentOperation.running) {
			this.dialogService.showMessageDialog('Unable to change Well due to Running Operation.', 'Error');
		} else {
			this.operationDataFactory.emitInterruptCurrentWell(well);
		}
	}

	private loadWellList() {
		const self = this;
		delete this.$scope.dados.wellList;

		this.wellSetupAPIService.getList(function (wellList) {
			self.$scope.dados.wellList = wellList;
		});
	}

	private upsertCallback(well) {

		if (well.id != null) {
			this.wellSetupAPIService.updateObject(well, this.loadWellList);
		} else {
			this.wellSetupAPIService.insertObject(well, this.loadWellList);
		}
	}

	private removeWell(well) {
		const self = this;

		this.dialogService.showCriticalDialog({ templateHtml: 'By <b>removing</b> a Well you will no longer be able to access its sections. Proceed?' },
			function () {
				self.wellSetupAPIService.removeObject(well, self.loadWellList);
			});
	}

}
