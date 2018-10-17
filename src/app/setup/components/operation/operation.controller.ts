import * as angular from 'angular';
import { IModalService } from 'angular-ui-bootstrap';
import { OperationConfigurationService } from '../../../shared/operation-configuration/operation-configuration.service';
import { DialogService } from '../../../shared/xpd.dialog/xpd.dialog.factory';
import { MenuConfirmationService } from '../../../shared/xpd.menu-confirmation/menu-confirmation.factory';
import { OperationDataService } from '../../../shared/xpd.operation-data/operation-data.service';
import { OperationSetupAPIService } from '../../../shared/xpd.setupapi/operation-setupapi.service';
import { SectionSetupAPIService } from '../../../shared/xpd.setupapi/section-setupapi.service';
import { WellSetupAPIService } from '../../../shared/xpd.setupapi/well-setupapi.service';

export class OperationController {
	// 'use strict';

	public static $inject = ['$scope', '$routeParams', '$location', '$uibModal', 'operationDataService', 'dialogService', 'wellSetupAPIService', 'sectionSetupAPIService', 'operationSetupAPIService', OperationConfigurationService.name, 'menuConfirmationService'];
	public contract: any;

	public info: any;
	public operationDataFactory: any;
	public modalInstance: any;
	private initialOperationTimeSlices: any;
	private visitedTab: boolean[];

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

		/**
		 * Impede que o usuario saia da tela
		 * de edição sem confirmacao do mesmo
		 */
		menuConfirmationService.setBlockMenu(true);

		this.modalInstance = null;
		$routeParams.operation = JSON.parse($routeParams.operation);
		if ($routeParams.operation.id != null) {
			$routeParams.operation.id = $routeParams.operation.id;
		}
		$routeParams.wellId = +$routeParams.wellId;
		$routeParams.sectionId = +$routeParams.sectionId;

		// vm.changeOperationQueue = changeOperationQueue;

		$scope.dados = {};

		operationDataService.openConnection(['operation', 'operationQueue']).then(() => {

			this.operationDataFactory = operationDataService.operationDataFactory;

			wellSetupAPIService.getObjectById($routeParams.wellId).then((well) => {
				$scope.well = well;
				sectionSetupAPIService.getObjectById($routeParams.sectionId).then((section) => {
					$scope.section = section;

					if (this.$routeParams.operation.id != null) {

						/**
						 * Estou editando uma operação
						 */
						this.operationSetupAPIService.getOperationById(this.$routeParams.operation.id).then(
							(operation: any) => {
								this.initialOperationTimeSlices = angular.copy(operation.timeSlices);
								this.loadOperationSetup(operation);
							});

					} else {

						/**
						 * Estou cadastrando uma operação
						 */
						this.operationSetupAPIService.getOperationQueue(this.$routeParams.wellId).then((queue: any[]) => {

							const operationQueuePromises = queue.map((operation) => {
								return this.operationSetupAPIService.getOperationById(operation.id);
							});

							Promise.all(operationQueuePromises).then((operationQueue: any[]) => {

								this.operationSetupAPIService.getDefaultFields(this.$routeParams.operation.type).then((operation: any) => {

									operation.name = '';

									const attrsToImportFromPreviousOperations = [
										'stickUp',
										'upperStop',
										'blockWeight',
										'slipsThreshold',
									];

									// console.log('section', this.$scope.section);
									// console.log('well', this.$scope.well);

									operationQueue.map((op) => {

										for (const attr of attrsToImportFromPreviousOperations) {

											if (op[attr] != null) {
												operation[attr] = op[attr];
											}

										}
										return op;
									});

									this.loadOperationSetup(operation);
								});

							});

						});
					}

				});
			});

		});

	}

	/**
	 * Calculator Helper
	 */
	public copyAndPaste() {
		/* Get the text field */
		const copyText = document.getElementById('copy-and-paste-calculator-result');

		// /* Select the text field */
		(copyText as any).select();

		/* Copy the text inside the text field */
		document.execCommand('copy');
	}

	public calcContractParamsConverter(value, displacement, unit) {

		if (unit === 'min') {
			this.$scope.measureConversorData.calculatorResult = this.minutesToMetersPerHour(value, displacement);
		}

	}

	/**
	 * Time Operation
	 */
	public actionTimeOperationItemClick(custom, type, name, standardTime) {

		this.$scope.dados.operation.custom = custom;

		if (!this.$scope.dados.operation.contractParams.timeSpeed) {
			this.$scope.dados.operation.contractParams.timeSpeed = {};
			this.$scope.dados.operation.timeSlices[0].name = name;
		} else if (!this.$scope.dados.operation.custom && this.$scope.dados.operation.name) {
			this.$scope.dados.operation.timeSlices = this.$scope.dados.operation.timeSlices.map((ts) => {
				if (this.$scope.dados.operation.name === ts.name) {
					ts.name = name;
				}
				return ts;
			});
		}

		this.$scope.dados.operation.name = name;
		this.$scope.dados.operation.metaType = type;

		this.$scope.dados.operation.contractParams.timeSpeed.vstandard = 1 / standardTime;
		this.$scope.dados.operation.contractParams.timeSpeed.vpoor = 1 / (standardTime * 1.1);
		this.$scope.dados.operation.contractParams.timeSpeed.voptimum = 1 / (standardTime * 0.9);
	}

	/**
	 * Marca os campos que estão inválidos no general info
	 */
	public validateGeneralInfo() {
		this.$scope.dados.tabIndex = 0;
		angular.forEach(this.info.$error.required, (field) => {
			field.$setDirty();
		});
	}

	/**
	 * Marca os campos que estão errados no contract params
	 */
	public validateContractParams() {
		this.$scope.dados.tabIndex = 1;
		angular.forEach(this.contract.$error.required, (field) => {
			field.$setDirty();
		});
	}

	/**
	 * Sai disparando as mudanças em cascata para o respectivo parametro
	 * @param paramName nome do parametro que mudou
	 */
	public bhaFormCalcs(paramName) {

		switch (paramName) {
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

	/**
	 * Sai disparando as mudanças em cascata para o respectivo parametro
	 * @param paramName nome do parametro que mudou
	 */
	public riserFormCalcs(paramName) {

		switch (paramName) {
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

	/**
	 * Sai disparando as mudanças em cascata para o respectivo parametro
	 * @param paramName nome do parametro que mudou
	 */
	public casingFormCalcs(paramName) {

		switch (paramName) {
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

	/**
	 * Quando mudar o metatype na operação de casing
	 */
	public actionSelectCasingType() {

		const metaType = this.$scope.dados.operation.metaType;
		const averageSectionLength = this.$scope.dados.operation.averageSectionLength;

		const casingTripSpeedParams = angular.copy(this.operationConfigurationService.getCasingTripSpeedParams(metaType));

		if (!casingTripSpeedParams) {
			return;
		}

		casingTripSpeedParams.voptimum = casingTripSpeedParams.voptimum * averageSectionLength;
		casingTripSpeedParams.vstandard = casingTripSpeedParams.vstandard * averageSectionLength;
		casingTripSpeedParams.vpoor = casingTripSpeedParams.vpoor * averageSectionLength;

		this.$scope.dados.operation.contractParams.casingTripSpeed = casingTripSpeedParams;
	}

	/**
	 * Quando o usuário clica em SAVE
	 */
	public actionButtonSave() {

		this.dialogService.showConfirmDialog('Save and exit?', () => {

			try {

				for (const timeSlice of this.$scope.dados.operation.timeSlices) {
					this.initialOperationTimeSlices = this.initialOperationTimeSlices.filter((timeSlice2) => {
						return timeSlice2.id !== timeSlice.id;
					});
				}

				this.initialOperationTimeSlices = this.initialOperationTimeSlices.map((ts) => {
					ts.enabled = false;
					return ts;
				});

				this.$scope.dados.operation.timeSlices = [
					...this.$scope.dados.operation.timeSlices,
					...this.initialOperationTimeSlices,
				];

			} catch (error) {
				console.log(error);
			}

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

	/**
	 * Quando sair do formulário sem mexer
	 */
	public confirmLeaving() {
		this.dialogService.showCriticalDialog('Your changes will be lost. Proceed?', () => {
			/** Libera o menu apos sair da tela */
			this.menuConfirmationService.setBlockMenu(false);
			this.$location.path('/well/' + this.$routeParams.wellId + '/section/').search();
		});
	}

	/**
	 *
	 * @param index indice da tab
	 */
	public markTabAsVisited(index) {
		this.visitedTab[index] = true;
	}

	/**
	 * Verifica se já nevegou por todas as tabs
	 */
	public allTabsWereVisited() {

		for (const index in this.visitedTab) {
			if (this.visitedTab[index] !== true) {
				return false;
			}
		}

		return true;

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

		this.$scope.dados.operation = operation;

		// OPERATION CONFIGURATION
		this.$scope.casingTypeSizeItems = this.operationConfigurationService.getCasingTypeSizeItems();
		this.$scope.htmlPopover = this.operationConfigurationService.getImageAceleration();
		this.$scope.htmlSlipsThreshold = this.operationConfigurationService.getHtmlSlipsThreshold();
		this.$scope.tabs = this.operationConfigurationService.getOperationViewTabs(this.$scope.dados.operation);

		this.visitedTab = [false, false, false];

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
		this.operationDataFactory.emitRefreshQueue();
		this.$location.path('/well/' + this.$routeParams.wellId + '/section/').search();

	}

	private insertOperationCallback() {
		/** Libera o menu apos sair da tela */
		this.menuConfirmationService.setBlockMenu(false);
		this.operationDataFactory.emitRefreshQueue();
		this.$location.path('/well/' + this.$routeParams.wellId + '/section/').search();

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

	private minutesToMetersPerHour(minutes, displacement) {
		if (minutes <= 0) {
			return 0;
		}

		return ((displacement) / minutes) * 60;
	}

}
