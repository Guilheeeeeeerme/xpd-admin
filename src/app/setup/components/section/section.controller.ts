import { IModalService } from 'angular-ui-bootstrap';
import { DialogService } from '../../../shared/xpd.dialog/xpd.dialog.factory';
import { OperationDataService } from '../../../shared/xpd.operation-data/operation-data.service';
import { SectionSetupAPIService } from '../../../shared/xpd.setupapi/section-setupapi.service';
import { WellSetupAPIService } from '../../../shared/xpd.setupapi/well-setupapi.service';
import { SectionUpsertController } from './section-upsert.controller';
import sectionUpsertTemplate from './section-upsert.modal.html';

export class SectionController {
	// 'use strict';

	public static $inject = ['$scope', '$filter', '$location', '$uibModal', '$routeParams', 'sectionSetupAPIService', 'dialogService', 'wellSetupAPIService', 'operationDataService'];
	public operationDataFactory: any;

	constructor(
		private $scope: any,
		private $filter: any,
		private $location: any,
		private $modal: IModalService,
		private $routeParams: any,
		private sectionSetupAPIService: SectionSetupAPIService,
		private dialogService: DialogService,
		private wellSetupAPIService: WellSetupAPIService,
		private operationDataService: OperationDataService) {

		$routeParams.wellId = +$routeParams.wellId;

		$scope.dados = {
			sectionList: [],
		};

		wellSetupAPIService.getObjectById($routeParams.wellId).then((well) => {
			$scope.well = well;
		});

		if (!localStorage.getItem('xpd.admin.setup.openedSections')) {
			localStorage.setItem('xpd.admin.setup.openedSections', JSON.stringify({}));
		}

		$scope.openedSections = JSON.parse(localStorage.getItem('xpd.admin.setup.openedSections'));

		$scope.$watch('openedSections', (openedSections) => {

			if (openedSections) {

				const tempOpenedSections = JSON.parse(localStorage.getItem('xpd.admin.setup.openedSections')) || {};

				for (const i in openedSections) {
					tempOpenedSections[i] = openedSections[i] === true;
				}

				localStorage.setItem('xpd.admin.setup.openedSections', JSON.stringify(tempOpenedSections));
			}

		}, true);

		operationDataService.openConnection(['operation', 'operationQueue', 'well']).then(() => {
			this.operationDataFactory = operationDataService.operationDataFactory;
			$scope.operationData = this.operationDataFactory.operationData;
		});

		operationDataService.on($scope, 'setOnOperationQueueChangeListener', () => { this.loadSectionList(); });
		operationDataService.on($scope, 'setOnCurrentOperationQueueListener', () => { this.loadSectionList(); });
		operationDataService.on($scope, 'setOnNoCurrentOperationQueueListener', () => { this.loadSectionList(); });
		operationDataService.on($scope, 'setOnUnableToMakeCurrentListener', (operation) => { this.unableToMakeCurrent(operation); });

		this.loadSectionList();
	}

	public actionButtonMakeCurrent(operation) {
		if (this.$scope.operationData.operationContext.currentOperation && this.$scope.operationData.operationContext.currentOperation.running) {
			this.dialogService.showMessageDialog('Unable to make operation #' + operation.id + ', ' + operation.name + ' current due to running operation', 'Error');
		} else {
			this.operationDataFactory.emitMakeCurrentOperation(operation);
		}
	}

	public swapSection(section1, section2) {
		this.operationDataFactory.emitUpdateSectionOrder([section1, section2]);
	}

	public swapOperation(operation1, operation2) {
		this.operationDataFactory.emitUpdateOperationOrder([operation1, operation2]);
	}

	public actionButtonAddSection() {
		const vm = this;

		this.$modal.open({
			animation: true,
			keyboard: false,
			backdrop: 'static',
			size: 'md',
			template: sectionUpsertTemplate,
			controller: SectionUpsertController.name + ' as suController',
			resolve: {
				callback() {
					return (section) => { vm.modalUpsertCallback(section); };
				},
				section() {
					return {
						well: vm.$scope.well,
					};
				},
			},
		});
	}

	public actionButtonEditSection(section) {
		const vm = this;

		section.well = this.$scope.well;

		this.$modal.open({
			animation: true,
			keyboard: false,
			backdrop: 'static',
			size: 'md',
			template: sectionUpsertTemplate,
			controller: SectionUpsertController.name + ' as suController',
			resolve: {
				callback() {
					return (section1) => {  vm.modalUpsertCallback(section1); };
				},
				section() {
					return section;
				},
			},
		});
	}

	public actionButtonRemoveSection(section) {

		this.dialogService.showCriticalDialog({ templateHtml: 'By <b>removing</b> a Section you will no longer be able to access its operations. Proceed?' }, () => {
			this.operationDataFactory.emitRemoveSection(section);
		});

	}

	/********************************************************/
	/********************************************************/
	/********************************************************/

	public actionButtonAddOperation(type, section) {

		this.$location.path('/well/' + this.$routeParams.wellId + '/section/' + section.id + '/operation/').search({
			operation: JSON.stringify({
				id: null,
				type,
				section,
			}),
		});
	}

	public actionButtonEditOperation(section, operation) {

		operation.section = section;
		delete operation.section.operations;

		this.$location.path('/well/' + this.$routeParams.wellId + '/section/' + section.id + '/operation/').search({
			operation: JSON.stringify({
				id: operation.id,
				type: operation.type,
				section,
			}),
		});

	}

	public actionButtonRemoveOperation(operation) {
		this.dialogService.showCriticalDialog({ templateHtml: 'By <b>removing</b> a Operation you will not be able to start it and all the data will be lost. Proceed?' }, () => {
			this.operationDataFactory.emitRemoveOperation(operation);
		});
	}

	private unableToMakeCurrent(operationContext) {
		this.dialogService.showMessageDialog('Unable to make operation #' + operationContext.nextOperation.name + ' current', 'Error');
	}

	private replaceOnList(updatedSection) {

		for (const i in this.$scope.dados.sectionList) {
			const section = this.$scope.dados.sectionList[i];

			if (section.id === updatedSection.id) {
				this.$scope.dados.sectionList[i] = updatedSection;
				break;
			}
		}
	}

	private modalUpsertCallback(section) {

		section.well = {
			id: this.$routeParams.wellId,
		};

		delete section.operations;

		if (section.id != null) {
			this.sectionSetupAPIService.updateObject(
				section).then((arg) => {
					this.replaceOnList(arg);
					this.operationDataFactory.emitRefreshQueue();
				});
		} else {
			section.sectionOrder = this.$scope.dados.sectionList.length + 1;

			this.sectionSetupAPIService.insertObject(
				section).then(() => {
					this.operationDataFactory.emitRefreshQueue();
				});
		}
	}

	private loadSectionList() {

		this.$scope.dados.sectionList = [];

		if (this.$routeParams.wellId != null) {
			this.sectionSetupAPIService.getListOfSectionsByWell(this.$routeParams.wellId).then((sectionList) => {
				this.$scope.dados.sectionList = this.$filter('orderBy')(sectionList, 'sectionOrder');
			});
		}

	}

}
