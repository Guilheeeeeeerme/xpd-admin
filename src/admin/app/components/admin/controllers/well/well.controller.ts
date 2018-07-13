import { IModalService } from '../../../../../../../node_modules/@types/angular-ui-bootstrap';
import { OperationDataFactory } from '../../../../../../xpd-resources/ng/xpd.communication/operation-server-data.factory';
import { DialogFactory } from '../../../../../../xpd-resources/ng/xpd.dialog/xpd.dialog.factory';
import { SectionSetupAPIService } from '../../../../../../xpd-resources/ng/xpd.setupapi/section-setupapi.service';
import { WellSetupAPIService } from '../../../../../../xpd-resources/ng/xpd.setupapi/well-setupapi.service';

export class WellController {
	// 'use strict';

	// angular.module('xpd.admin').controller('WellController', wellController);

	public static $inject = ['$scope', '$uibModal', 'wellSetupAPIService', 'sectionSetupAPIService', 'dialogFactory', 'operationDataFactory'];
	public operationDataFactory: any;
	public actionButtonAddWell: () => void;
	public actionButtonEditWell: (well: any) => void;
	public actionButtonRemoveWell: (well: any) => void;
	public actionButtonMakeCurrent: (well: any) => void;
	public actionButtonMakeNotCurrent: (well: any) => void;

	constructor(
		$scope: any,
		$modal: IModalService,
		wellSetupAPIService: WellSetupAPIService,
		sectionSetupAPIService: SectionSetupAPIService,
		dialogFactory: DialogFactory,
		operationDataFactory: OperationDataFactory) {

		const vm = this;

		$scope.dados = {
			wellList: [],
		};

		operationDataFactory.openConnection([]).then(function(response) {
			vm.operationDataFactory = response;
			$scope.operationData = operationDataFactory.operationData;
		});

		vm.actionButtonAddWell = actionButtonAddWell;
		vm.actionButtonEditWell = actionButtonEditWell;
		vm.actionButtonRemoveWell = actionButtonRemoveWell;

		vm.actionButtonMakeCurrent = actionButtonMakeCurrent;
		vm.actionButtonMakeNotCurrent = actionButtonMakeNotCurrent;

		operationDataFactory.addEventListener('wellController', 'setOnCurrentWellListener', loadWellList);
		operationDataFactory.addEventListener('wellController', 'setOnNoCurrentWellListener', loadWellList);
		operationDataFactory.addEventListener('wellController', 'setOnWellChangeListener', loadWellList);

		loadWellList();

		function loadWellList() {
			delete $scope.dados.wellList;

			wellSetupAPIService.getList(function(wellList) {
				$scope.dados.wellList = wellList;
			});
		}

		function actionButtonEditWell(well) {
			$modal.open({
				animation: true,
				keyboard: false,
				backdrop: 'static',
				size: 'lg',
				templateUrl: 'app/components/admin/views/modal/well-upsert.modal.html',
				controller: 'WellUpsertController as wuController',
				resolve: {
					callback() {
						return upsertCallback;
					},
					initialData() {
						return well;
					},
				},
			});
		}

		function actionButtonAddWell() {
			$modal.open({
				animation: true,
				keyboard: false,
				backdrop: 'static',
				size: 'lg',
				templateUrl: 'app/components/admin/views/modal/well-upsert.modal.html',
				controller: 'WellUpsertController as wuController',
				resolve: {
					callback() {
						return upsertCallback;
					},
					initialData() {
						return {};
					},
				},
			});
		}

		function actionButtonRemoveWell(well) {

			sectionSetupAPIService.getListOfSectionsByWell(well.id, function(sectionList) {
				if (sectionList.length === 0) {
					removeWell(well);
				} else {
					dialogFactory.showMessageDialog('You can\'t delete a Well with Sections and Operations inside.', 'Unable to Remove Well');
				}
			});
		}

		function actionButtonMakeCurrent(well) {

			if ($scope.operationData.operationContext.currentOperation && $scope.operationData.operationContext.currentOperation.running) {
				dialogFactory.showMessageDialog('Unable to change Well due to Running Operation.', 'Error');
			} else {
				vm.operationDataFactory.emitMakeCurrentWell(well);
			}
		}

		function actionButtonMakeNotCurrent(well) {

			if ($scope.operationData.operationContext.currentOperation && $scope.operationData.operationContext.currentOperation.running) {
				dialogFactory.showMessageDialog('Unable to change Well due to Running Operation.', 'Error');
			} else {
				vm.operationDataFactory.emitInterruptCurrentWell(well);
			}
		}

		function upsertCallback(well) {

			if (well.id != null) {
				wellSetupAPIService.updateObject(well, loadWellList);
			} else {
				wellSetupAPIService.insertObject(well, loadWellList);
			}
		}

		function removeWell(well) {
			dialogFactory.showCriticalDialog({ templateHtml: 'By <b>removing</b> a Well you will no longer be able to access its sections. Proceed?' },
				function() {
					wellSetupAPIService.removeObject(well, loadWellList);
				});
		}

	}

}
