import { IModalService } from '../../../../../../../node_modules/@types/angular-ui-bootstrap';
import { OperationDataFactory } from '../../../../../../xpd-resources/ng/xpd.communication/operation-server-data.factory';
import { DialogFactory } from '../../../../../../xpd-resources/ng/xpd.dialog/xpd.dialog.factory';
import { SectionSetupAPIService } from '../../../../../../xpd-resources/ng/xpd.setupapi/section-setupapi.service';
import { WellSetupAPIService } from '../../../../../../xpd-resources/ng/xpd.setupapi/well-setupapi.service';

export class SectionController {
	// 'use strict';

	// angular.module('xpd.admin').controller('SectionController', sectionController);

	public static $inject = ['$scope', '$filter', '$location', '$uibModal', '$routeParams', 'sectionSetupAPIService', 'dialogFactory', 'wellSetupAPIService', 'operationDataFactory'];
	public operationDataFactory: any;
	public actionButtonAddSection: () => void;
	public actionButtonEditSection: (section: any) => void;
	public actionButtonRemoveSection: (section: any) => void;
	public actionButtonAddOperation: (type: any, section: any) => void;
	public actionButtonEditOperation: (section: any, operation: any) => void;
	public actionButtonRemoveOperation: (operation: any) => void;
	public swapSection: (section1: any, section2: any) => void;
	public swapOperation: (operation1: any, operation2: any) => void;
	public actionButtonMakeCurrent: (operation: any) => void;

	constructor(
		$scope: any,
		$filter: any,
		$location: any,
		$modal: IModalService,
		$routeParams: any,
		sectionSetupAPIService: SectionSetupAPIService,
		dialogFactory: DialogFactory,
		wellSetupAPIService: WellSetupAPIService,
		operationDataFactory: OperationDataFactory) {

		const vm = this;

		$routeParams.wellId = +$routeParams.wellId;

		$scope.dados = {
			sectionList: [],
		};

		wellSetupAPIService.getObjectById($routeParams.wellId, function (well) {
			$scope.well = well;
		});

		if (!localStorage.getItem('xpd.admin.setup.openedSections')) {
			localStorage.setItem('xpd.admin.setup.openedSections', JSON.stringify({}));
		}

		$scope.openedSections = JSON.parse(localStorage.getItem('xpd.admin.setup.openedSections'));

		$scope.$watch('openedSections', function (openedSections) {

			const tempOpenedSections = JSON.parse(localStorage.getItem('xpd.admin.setup.openedSections'));

			if (openedSections && tempOpenedSections) {

				for (const i in openedSections) {
					tempOpenedSections[i] = openedSections[i] === true;
				}

				localStorage.setItem('xpd.admin.setup.openedSections', JSON.stringify(tempOpenedSections));
			}

		}, true);

		operationDataFactory.openConnection([]).then(function (response) {
			vm.operationDataFactory = response;
			$scope.operationData = operationDataFactory.operationData;
		});

		vm.actionButtonAddSection = actionButtonAddSection;
		vm.actionButtonEditSection = actionButtonEditSection;
		vm.actionButtonRemoveSection = actionButtonRemoveSection;

		vm.actionButtonAddOperation = actionButtonAddOperation;
		vm.actionButtonEditOperation = actionButtonEditOperation;
		vm.actionButtonRemoveOperation = actionButtonRemoveOperation;

		vm.swapSection = swapSection;
		vm.swapOperation = swapOperation;

		vm.actionButtonMakeCurrent = actionButtonMakeCurrent;

		operationDataFactory.addEventListener('sectionController', 'setOnOperationQueueChangeListener', loadSectionList);
		operationDataFactory.addEventListener('sectionController', 'setOnCurrentOperationQueueListener', loadSectionList);
		operationDataFactory.addEventListener('sectionController', 'setOnNoCurrentOperationQueueListener', loadSectionList);
		operationDataFactory.addEventListener('sectionController', 'setOnUnableToMakeCurrentListener', unableToMakeCurrent);

		loadSectionList();

		function actionButtonMakeCurrent(operation) {
			if ($scope.operationData.operationContext.currentOperation && $scope.operationData.operationContext.currentOperation.running) {
				dialogFactory.showMessageDialog('Unable to make operation #' + operation.id + ', ' + operation.name + ' current due to running operation', 'Error');
			} else {
				vm.operationDataFactory.emitMakeCurrentOperation(operation);
			}
		}

		function swapSection(section1, section2) {
			vm.operationDataFactory.emitUpdateSectionOrder([section1, section2]);
		}

		function swapOperation(operation1, operation2) {
			vm.operationDataFactory.emitUpdateOperationOrder([operation1, operation2]);
		}

		function loadSectionList() {

			$scope.dados.sectionList = [];

			if ($routeParams.wellId != null) {
				sectionSetupAPIService.getListOfSectionsByWell($routeParams.wellId, function (sectionList) {
					$scope.dados.sectionList = $filter('orderBy')(sectionList, 'sectionOrder');
				});
			}

		}

		function actionButtonAddSection() {

			$modal.open({
				animation: true,
				keyboard: false,
				backdrop: 'static',
				size: 'md',
				templateUrl: 'app/components/admin/views/modal/section-upsert.modal.html',
				controller: 'SectionUpsertController as suController',
				resolve: {
					callback() {
						return modalUpsertCallback;
					},
					initialData() {
						return {
							well: $scope.well,
						};
					},
				},
			});
		}

		function actionButtonEditSection(section) {

			section.well = $scope.well;

			$modal.open({
				animation: true,
				keyboard: false,
				backdrop: 'static',
				size: 'md',
				templateUrl: 'app/components/admin/views/modal/section-upsert.modal.html',
				controller: 'SectionUpsertController as suController',
				resolve: {
					callback() {
						return modalUpsertCallback;
					},
					initialData() {
						return section;
					},
				},
			});
		}

		function actionButtonRemoveSection(section) {

			dialogFactory.showCriticalDialog({ templateHtml: 'By <b>removing</b> a Section you will no longer be able to access its operations. Proceed?' }, function () {
				vm.operationDataFactory.emitRemoveSection(section);
			});

		}

		function modalUpsertCallback(section) {

			section.well = {
				id: $routeParams.wellId,
			};

			delete section.operations;

			if (section.id != null) {
				sectionSetupAPIService.updateObject(
					section, replaceOnList);
			} else {
				section.sectionOrder = $scope.dados.sectionList.length + 1;

				sectionSetupAPIService.insertObject(
					section,
					vm.operationDataFactory.emitRefreshQueue);
			}
		}

		function replaceOnList(updatedSection) {

			for (const i in $scope.dados.sectionList) {
				const section = $scope.dados.sectionList[i];

				if (section.id === updatedSection.id) {
					$scope.dados.sectionList[i] = updatedSection;
					break;
				}
			}
		}

		/********************************************************/
		/********************************************************/
		/********************************************************/

		function actionButtonAddOperation(type, section) {

			$location.path('/setup/well/' + $routeParams.wellId + '/section/' + section.id + '/operation/').search({
				operation: JSON.stringify({
					id: null,
					type,
					section,
				}),
			});
		}

		function actionButtonEditOperation(section, operation) {

			operation.section = section;
			delete operation.section.operations;

			$location.path('/setup/well/' + $routeParams.wellId + '/section/' + section.id + '/operation/').search({
				operation: JSON.stringify({
					id: operation.id,
					type: operation.type,
					section,
				}),
			});

		}

		function actionButtonRemoveOperation(operation) {
			dialogFactory.showCriticalDialog({ templateHtml: 'By <b>removing</b> a Operation you will not be able to start it and all the data will be lost. Proceed?' }, function () {
				vm.operationDataFactory.emitRemoveOperation(operation);
			});
		}

		function unableToMakeCurrent(operation) {
			dialogFactory.showMessageDialog('Unable to make operation #' + operation.nextOperation.name + ' current', 'Error');
		}
	}

}
