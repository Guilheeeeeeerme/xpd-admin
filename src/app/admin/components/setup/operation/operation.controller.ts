import * as angular from 'angular';
import { IModalService } from 'angular-ui-bootstrap';
import { DialogService } from '../../../../shared/xpd.dialog/xpd.dialog.factory';
import { MenuConfirmationService } from '../../../../shared/xpd.menu-confirmation/menu-confirmation.factory';
import { OperationDataService } from '../../../../shared/xpd.operation-data/operation-data.service';
import { OperationSetupAPIService } from '../../../../shared/xpd.setupapi/operation-setupapi.service';
import { SectionSetupAPIService } from '../../../../shared/xpd.setupapi/section-setupapi.service';
import { WellSetupAPIService } from '../../../../shared/xpd.setupapi/well-setupapi.service';
import { OperationConfigurationService } from './operation-configuration.service';
import operationCopyTemplate from './operation-copy-options.modal.html';

export class OperationController {
	// 'use strict';

	public static $inject = ['$scope', '$routeParams', '$location', '$uibModal', 'operationDataService', 'dialogService', 'wellSetupAPIService', 'sectionSetupAPIService', 'operationSetupAPIService', 'OperationConfigurationService', 'menuConfirmationService'];
	public contract: any;

	public info: any;
	public operationDataFactory: any;
	public modalInstance: any;
	public operation: any;

	constructor(
		private $scope: any,
		private $routeParams: any,
		private $location: any,
		private $uibModal: IModalService,
		private operationDataService: OperationDataService,
		private dialogService: DialogService,
		private wellSetupAPIService: WellSetupAPIService,
		private sectionSetupAPIService: SectionSetupAPIService,
		private operationSetupAPIService: OperationSetupAPIService,
		private operationConfigurationService: OperationConfigurationService,
		private menuConfirmationService: MenuConfirmationService) {

		const vm = this;

		this.modalInstance = null;
		this.operation = JSON.parse($routeParams.operation);

		$routeParams.wellId = +$routeParams.wellId;
		$routeParams.sectionId = +$routeParams.sectionId;
		// vm.changeOperationQueue = changeOperationQueue;

		wellSetupAPIService.getObjectById($routeParams.wellId).then((well) => {
			$scope.well = well;
			this.getOperation();
		});

		sectionSetupAPIService.getObjectById($routeParams.sectionId).then((section) => {
			$scope.section = section;
		});

		$scope.dados = {
			section: this.operation.section,
			operationQueue: null,
			result: 0,
		};

		/**
		 * Impede que o usuario saia da tela
		 * de edição sem confirmacao do mesmo
		 */
		menuConfirmationService.setBlockMenu(true);

		operationDataService.openConnection([]).then(() => {
			vm.operationDataFactory = operationDataService.operationDataFactory;
		});

	}

	public myFunction(value) {
		/* Get the text field */
		const copyText = document.getElementById('result');

		// /* Select the text field */
		(copyText as any).select();

		/* Copy the text inside the text field */
		document.execCommand('copy');
	}

	public calcContractParamsConverter(value, unit) {

		if (unit === 'min') {
			this.$scope.dados.result = this.minutesToMetersPerHour(value);
		}

	}

	public actionTimeOperationItemClick(custom, type, name, standardTime) {
		this.$scope.dados.operation.custom = custom;

		this.$scope.dados.operation.name = name;
		this.$scope.dados.operation.metaType = type;

		if (!this.$scope.dados.operation.contractParams.timeSpeed) {
			this.$scope.dados.operation.contractParams.timeSpeed = {};
		}

		this.$scope.dados.operation.contractParams.timeSpeed.vstandard = 1 / standardTime;
		this.$scope.dados.operation.contractParams.timeSpeed.vpoor = 1 / (standardTime * 1.1);
		this.$scope.dados.operation.contractParams.timeSpeed.voptimum = 1 / (standardTime * 0.9);
	}

	public validateGeneralInfo() {
		this.$scope.dados.tabIndex = 0;
		angular.forEach(this.info.$error.required, (field) => {
			field.$setDirty();
		});
	}

	public validateContractParams() {
		this.$scope.dados.tabIndex = 1;
		angular.forEach(this.contract.$error.required, (field) => {
			field.$setDirty();
		});
	}

	public bhaFormCalcs(param) {

		switch (param) {
			case 'startHoleDepth':
				this.$scope.dados.operation.holeDepth = this.$scope.dados.operation.startHoleDepth;
				break;
			case 'numberOfDPPerStand':
			case 'averageDPLength':
				this.$scope.dados.operation.averageStandLength = +this.$scope.dados.operation.numberOfDPPerStand * +this.$scope.dados.operation.averageDPLength;
				// $scope.dados.operation.endBitDepth = +$scope.dados.operation.numberOfJoints * +$scope.dados.operation.averageStandLength + +$scope.dados.operation.length;
				this.$scope.dados.operation.numberOfJoints = null;
				this.$scope.dados.operation.endBitDepth = null;
				break;
			case 'endBitDepth':
			case 'length':
			case 'averageStandLength':
				this.$scope.dados.operation.numberOfJoints = Math.ceil((+this.$scope.dados.operation.endBitDepth - +this.$scope.dados.operation.length) / +this.$scope.dados.operation.averageStandLength);
				break;
			case 'numberOfJoints':
				this.$scope.dados.operation.endBitDepth = +this.$scope.dados.operation.numberOfJoints * +this.$scope.dados.operation.averageStandLength + +this.$scope.dados.operation.length;
				break;
			case 'inSlips':
				this.$scope.dados.operation.inSlipsDefault = +this.$scope.dados.operation.inSlips;
				break;
			default:
				break;
		}

	}

	public riserFormCalcs(param) {

		switch (param) {
			case 'averageJointLength':
				this.$scope.dados.operation.averageStandLength = +this.$scope.dados.operation.averageJointLength * +this.$scope.dados.operation.numberOfRiserPerSection;
				this.riserFormCalcs('averageStandLength');
				break;
			case 'numberOfRiserPerSection':
				this.$scope.dados.operation.averageStandLength = +this.$scope.dados.operation.averageJointLength * +this.$scope.dados.operation.numberOfRiserPerSection;
				break;
			case 'numberOfJoints':
				this.$scope.dados.operation.startHoleDepth = +this.$scope.dados.operation.numberOfJoints * +this.$scope.dados.operation.averageStandLength;
				break;
			case 'averageStandLength':
			case 'startHoleDepth':
				this.$scope.dados.operation.numberOfJoints = Math.ceil(+this.$scope.dados.operation.startHoleDepth / +this.$scope.dados.operation.averageStandLength);
				break;
			case 'length':
				this.$scope.dados.operation.numberOfJoints = Math.ceil((+this.$scope.dados.operation.startHoleDepth - (+this.$scope.dados.operation.length)) / +this.$scope.dados.operation.averageStandLength);
				break;
			default:
				break;
		}

	}

	public changeImportedOperation(operationId) {
		this.operationSetupAPIService.getObjectById(operationId).then((arg) => { this.openModalOperationImport(arg); });
	}

	public actionButtonSave() {

		this.dialogService.showConfirmDialog('Save and exit?', () => {

			const operation = this.$scope.dados.operation;

			if (operation.type === 'time') {
				operation.optimumTime = this.speedToTime(this.$scope.dados.operation.contractParams.timeSpeed.voptimum);
				operation.standardTime = this.speedToTime(this.$scope.dados.operation.contractParams.timeSpeed.vstandard); // $scope.dados.operation.contractParams.timeSpeed.vstandard * 3600000;
				operation.poorTime = this.speedToTime(this.$scope.dados.operation.contractParams.timeSpeed.vpoor);

			}

			operation.contractParams = this.saveContractParams(operation, operation.contractParams);

			if (operation.id) {
				this.operationSetupAPIService.updateObject(operation).then((arg) => { this.updateOperationCallback(arg); });
			} else {
				this.operationSetupAPIService.insertObject(operation).then((arg) => { this.insertOperationCallback(); });

			}

		});

	}

	public actionSelectCasingType() {

		const newId = this.$scope.dados.operation.metaType;
		const averageSectionLength = this.$scope.dados.operation.averageSectionLength;

		const casingTripSpeedParams = angular.copy(this.operationConfigurationService.getCasingTripSpeedParams(newId));

		if (!casingTripSpeedParams) {
			return;
		}

		casingTripSpeedParams.voptimum = casingTripSpeedParams.voptimum * averageSectionLength;
		casingTripSpeedParams.vstandard = casingTripSpeedParams.vstandard * averageSectionLength;
		casingTripSpeedParams.vpoor = casingTripSpeedParams.vpoor * averageSectionLength;

		this.$scope.dados.operation.contractParams.casingTripSpeed = casingTripSpeedParams;
	}

	public casingFormCalcs(param) {

		switch (param) {
			case 'averageJointLength':
			case 'numberOfCasingJointsPerSection':
				this.$scope.dados.operation.averageSectionLength = +this.$scope.dados.operation.averageJointLength * +this.$scope.dados.operation.numberOfCasingJointsPerSection;
				this.casingFormCalcs('averageSectionLength');
				break;
			case 'averageSectionLength':
				this.$scope.dados.operation.length = +this.$scope.dados.operation.numberOfCasingSections * +this.$scope.dados.operation.averageSectionLength;
				this.$scope.dados.operation.numberOfCasingSections = Math.ceil(+this.$scope.dados.operation.length / +this.$scope.dados.operation.averageSectionLength);
				this.casingFormCalcs('length');
				break;
			case 'numberOfCasingSections':
				this.$scope.dados.operation.length = +this.$scope.dados.operation.numberOfCasingSections * +this.$scope.dados.operation.averageSectionLength;
				this.casingFormCalcs('length');
				break;
			case 'length':
				this.$scope.dados.operation.settlementStringSize = (+this.$scope.dados.operation.endBitDepth - (+this.$scope.dados.operation.length));
				this.$scope.dados.operation.numberOfCasingSections = Math.ceil(+this.$scope.dados.operation.length / +this.$scope.dados.operation.averageSectionLength);
				this.casingFormCalcs('settlementStringSize');
				break;
			case 'holeDepth':
				this.$scope.dados.operation.settlementStringSize = (+this.$scope.dados.operation.holeDepth - (+this.$scope.dados.operation.length + +this.$scope.dados.operation.ratHole));
				this.$scope.dados.operation.endBitDepth = (+this.$scope.dados.operation.holeDepth - +this.$scope.dados.operation.ratHole);
				this.casingFormCalcs('settlementStringSize');
				break;
			case 'ratHole':
				this.$scope.dados.operation.settlementStringSize = (+this.$scope.dados.operation.holeDepth - (+this.$scope.dados.operation.length));
				this.$scope.dados.operation.endBitDepth = (+this.$scope.dados.operation.holeDepth - +this.$scope.dados.operation.ratHole);
				this.casingFormCalcs('settlementStringSize');
				break;
			case 'settlementStringSize':
			case 'averageStandLength':
				this.$scope.dados.operation.numberOfJoints = Math.ceil(+this.$scope.dados.operation.settlementStringSize / +this.$scope.dados.operation.averageStandLength);
				break;
			case 'averageDPLength':
			case 'numberOfDPPerStand':
				this.$scope.dados.operation.averageStandLength = +this.$scope.dados.operation.averageDPLength * +this.$scope.dados.operation.numberOfDPPerStand;
				this.casingFormCalcs('averageStandLength');
				break;
			default:
				break;
		}

	}

	public confirmLeaving() {
		this.dialogService.showCriticalDialog('Your changes will be lost. Proceed?', () => {
			this.$location.path('/setup/well/' + this.$routeParams.wellId + '/section/').search();

			/** Libera o menu apos sair da tela */
			this.menuConfirmationService.setBlockMenu(false);
		});
	}

	public markTabAsVisited(index) {
		this.$scope.visitedTab[index] = true;
		this.$scope.dados.allTabsWereVisited = (this.$scope.visitedTab[0] === true) && (this.$scope.visitedTab[1] === true) && (this.$scope.visitedTab[2] === true);
	}

	private getOperation() {
		if (this.operation.id != null) {
			this.operationSetupAPIService.getObjectById(this.operation.id).then(
				(arg) => {
					this.loadOperationSetup(arg);
				});
		} else {
			this.operationSetupAPIService.getOperationQueue(this.$routeParams.wellId).then((operationQueue) => {

				this.$scope.dados.operationQueue = operationQueue;
				// $scope.dados.operationQueue = operationQueue.filter((operation) => {
				// 	return operation.type == operation.type;
				// });
				this.operationSetupAPIService.getDefaultFields(this.operation.type).then((arg) => {
					this.loadOperationSetup(arg);
				});
			});
		}
	}

	private loadOperationSetup(operation) {

		const contractParams = {};

		for (const i in operation.contractParams) {
			contractParams[operation.contractParams[i].type] = operation.contractParams[i];
			delete contractParams[operation.contractParams[i].type].type;
		}

		operation.contractParams = contractParams;

		try {
			operation.alarms = operation.alarms.map((alarm) => {

				if (alarm.enabled === false) {
					alarm.enabled = false;
				} else {
					alarm.enabled = true;
				}

				return alarm;
			});
		} catch (error) {
			console.error(error);
		}

		operation.section = {
			id: this.$routeParams.sectionId,
		};

		let lastSectionId = null;

		try {

			for (const op of this.$scope.dados.operationQueue) {

				if (lastSectionId !== op.section.id) {

					if (lastSectionId === this.$routeParams.sectionId) {
						break;
					}

					lastSectionId = this.$routeParams.sectionId;

				}

			}

		} catch (e) {
			console.error(e);
		}

		this.$scope.dados.operation = operation;

		// OPERATION CONFIGURATION
		this.$scope.casingTypeSizeItems = this.operationConfigurationService.getCasingTypeSizeItems();
		this.$scope.htmlPopover = this.operationConfigurationService.getHtmlPopOver();
		this.$scope.htmlSlipsThreshold = this.operationConfigurationService.getHtmlSlipsThreshold();
		this.$scope.tabs = this.operationConfigurationService.getOperationViewTabs(this.$scope.dados.operation);

		this.$scope.visitedTab = [false, false, false];
		this.$scope.dados.allTabsWereVisited = false;

		this.$scope.flags = {
			duplicatedAlarmAlert: false,
		};

		this.$scope.dados.leftPercentage = 100;

		if (this.contract) {
			this.$scope.hasContractError = (typeError) => {
				if (!(this.contract.$error === undefined) && this.contract.$error) {
					for (const i in this.contract.$error.required) {
						if (this.contract.$error.required[i].$name === typeError) {
							return true;
						}
					}
				}
			};
		}
	}

	/**
	 * OPERATION FORM
	 **/

	private updateOperationCallback(operation) {

		if (operation && operation.running) {

			try { delete operation.alarms; } catch (e) { console.error(e); }
			try { delete operation.contractParams; } catch (e) { console.error(e); }
			try { delete operation.timeSlices; } catch (e) { console.error(e); }
			try { delete operation.section; } catch (e) { console.error(e); }

			this.operationDataFactory.emitUpdateRunningOperation(operation);

		}
		/** Libera o menu apos sair da tela */
		this.menuConfirmationService.setBlockMenu(false);

		this.$location.path('/setup/well/' + this.$routeParams.wellId + '/section/').search();

	}

	private insertOperationCallback() {
		/** Libera o menu apos sair da tela */
		this.menuConfirmationService.setBlockMenu(false);

		this.$location.path('/setup/well/' + this.$routeParams.wellId + '/section/').search();
		this.operationDataFactory.emitRefreshQueue();

	}

	private saveContractParams(operation, contractParams) {

		const newContractParams = [];

		delete this.$scope.dados.contractParams;

		for (const i in contractParams) {

			if (operation && operation.id) {
				contractParams[i].operation = {
					id: operation.id,
				};
			}

			contractParams[i].type = i;
			newContractParams.push(contractParams[i]);
		}

		return newContractParams;
	}

	private speedToTime(speed) {
		const time = (1 / speed) * 3600000;
		return time;
	}

	private openModalOperationImport(importedOperation) {
		const vm = this;

		this.modalInstance = this.$uibModal.open({
			animation: true,
			keyboard: false,
			backdrop: 'static',
			template: operationCopyTemplate,
			controller: 'OperationCopyOptionsModalController as ocomController',
			resolve: {
				actionButtonConfirmCallback() {
					return (arg) => { vm.actionButtonConfirmCallback(arg); };
				},
				actionButtonCancelCallback() {
					// tslint:disable-next-line:no-empty
					return () => { };
				},
				importedOperation, // operação que será importada
				currentOperation: this.$scope.dados.operation, // operação que está no formulário
			},
		});
	}

	private actionButtonConfirmCallback(newOperation) {
		this.$scope.dados.selectedOperation = '';
		this.$scope.dados.operation = newOperation;
		this.modalInstance.close();
	}

	private minutesToMetersPerHour(value) {
		if (value <= 0) {
			return 0;
		}

		return ((1 * this.$scope.dados.operation.averageStandLength) / value) * 60;
	}

}
