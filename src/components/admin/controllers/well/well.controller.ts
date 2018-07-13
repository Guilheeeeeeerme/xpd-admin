import { IModalService } from '../../../../../node_modules/@types/angular-ui-bootstrap';
import { OperationDataFactory } from '../../../../xpd-resources/ng/xpd.communication/operation-server-data.factory';
import { DialogFactory } from '../../../../xpd-resources/ng/xpd.dialog/xpd.dialog.factory';
import { SectionSetupAPIService } from '../../../../xpd-resources/ng/xpd.setupapi/section-setupapi.service';
import { WellSetupAPIService } from '../../../../xpd-resources/ng/xpd.setupapi/well-setupapi.service';

export class WellController {
	// 'use strict';

	// angular.module('xpd.admin').controller('WellController', wellController);

	public static $inject = ['$scope', '$uibModal', 'wellSetupAPIService', 'sectionSetupAPIService', 'dialogFactory', 'operationDataFactory'];
	public operationDataFactory: any;

	constructor(
		private $scope: any,
		private $modal: IModalService,
		private wellSetupAPIService: WellSetupAPIService,
		private sectionSetupAPIService: SectionSetupAPIService,
		private dialogFactory: DialogFactory,
		operationDataFactory: OperationDataFactory) {

		const vm = this;

		$scope.dados = {
			wellList: [],
		};

		operationDataFactory.openConnection([]).then(function (response) {
			vm.operationDataFactory = response;
			$scope.operationData = operationDataFactory.operationData;
		});

		operationDataFactory.addEventListener('wellController', 'setOnCurrentWellListener', this.loadWellList);
		operationDataFactory.addEventListener('wellController', 'setOnNoCurrentWellListener', this.loadWellList);
		operationDataFactory.addEventListener('wellController', 'setOnWellChangeListener', this.loadWellList);

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
				self.dialogFactory.showMessageDialog('You can\'t delete a Well with Sections and Operations inside.', 'Unable to Remove Well');
			}
		});
	}

	public actionButtonMakeCurrent(well) {

		if (this.$scope.operationData.operationContext.currentOperation && this.$scope.operationData.operationContext.currentOperation.running) {
			this.dialogFactory.showMessageDialog('Unable to change Well due to Running Operation.', 'Error');
		} else {
			this.operationDataFactory.emitMakeCurrentWell(well);
		}
	}

	public actionButtonMakeNotCurrent(well) {

		if (this.$scope.operationData.operationContext.currentOperation && this.$scope.operationData.operationContext.currentOperation.running) {
			this.dialogFactory.showMessageDialog('Unable to change Well due to Running Operation.', 'Error');
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

		this.dialogFactory.showCriticalDialog({ templateHtml: 'By <b>removing</b> a Well you will no longer be able to access its sections. Proceed?' },
			function () {
				self.wellSetupAPIService.removeObject(well, self.loadWellList);
			});
	}

}
