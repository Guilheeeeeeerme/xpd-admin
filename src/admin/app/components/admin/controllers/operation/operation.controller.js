(function () {
	'use strict';

	angular.module('xpd.admin').controller('OperationController', operationController);

	operationController.$inject = ['$scope', '$filter', '$routeParams', '$location', '$uibModal', 'alarmSetupAPIService', 'operationDataFactory', 'dialogFactory', 'setupAPIService', 'operationSetupAPIService', 'OperationConfigurationService', 'menuConfirmationFactory'];

	function operationController($scope, $filter, $routeParams, $location, $uibModal, alarmSetupAPIService, operationDataFactory, dialogFactory, setupAPIService, operationSetupAPIService, operationConfigurationService, menuConfirmationFactory) {
		var vm = this;

		var modalInstance = null;
		var operation = JSON.parse($routeParams.operation);

		$routeParams.wellId = +$routeParams.wellId;
		$routeParams.sectionId = +$routeParams.sectionId;

		vm.changeImportedOperation = changeImportedOperation;
		// vm.changeOperationQueue = changeOperationQueue;

		setupAPIService.getObjectById('setup/well', $routeParams.wellId, function (response) {
			$scope.well = response.data;
			getOperation();
		});

		setupAPIService.getObjectById('setup/section', $routeParams.sectionId, function (response) {
			$scope.section = response.data;
		});

		$scope.dados = {
			section: operation.section,
			operationQueue: null,
			result: 0,
		};

		/**
		 * Impede que o usuario saia da tela
		 * de edição sem confirmacao do mesmo
		 */
		menuConfirmationFactory.setBlockMenu(true);

		operationDataFactory.operationData = [];


		function getOperation() {
			if (operation.id != null) {
				setupAPIService.getObjectById('setup/operation', operation.id, function (response) {
					loadOperationSetup(response.data);
				});
			} else {
				operationSetupAPIService.getOperationQueue($routeParams.wellId, function (operationQueue) {

					$scope.dados.operationQueue = operationQueue;
					// $scope.dados.operationQueue = operationQueue.filter((operation) => {
					// 	return operation.type == operation.type;
					// });
					operationSetupAPIService.getDefaultFields(operation.type, loadOperationSetup);
				});
			}
		}
		

		function loadOperationSetup(operation) {

			var contractParams = {};

			for (var i in operation.contractParams) {
				contractParams[operation.contractParams[i].type] = operation.contractParams[i];
				delete contractParams[operation.contractParams[i].type].type;
			}

			operation.contractParams = contractParams;

			try {
				operation.alarms = operation.alarms.map(function (alarm) {

					if (alarm.enabled == false) {
						alarm.enabled = false;
					} else {
						alarm.enabled = true;
					}

					return alarm;
				});
			} catch (_ex) {
				console.error(_ex);
			}

			operation.section = {
				id: $routeParams.sectionId
			};

			var afterRiser = false;
			var lastSectionId = null;

			try{

				for( const op of $scope.dados.operationQueue ) {

					if(op.type == 'riser'){
						afterRiser = true;
						break;
					}

					if(lastSectionId != op.section.id){

						if(lastSectionId == $routeParams.sectionId){
							break;
						}

						lastSectionId = $routeParams.sectionId;

					}


				};

			}catch(e){
				console.error(e);
			}

			$scope.dados.afterRiser = afterRiser;
			$scope.dados.operation = operation;

			//OPERATION CONFIGURATION
			$scope.casingTypeSizeItems = operationConfigurationService.getCasingTypeSizeItems();
			$scope.htmlPopover = operationConfigurationService.getHtmlPopOver();
			$scope.htmlSlipsThreshold = operationConfigurationService.getHtmlSlipsThreshold();
			$scope.tabs = operationConfigurationService.getOperationViewTabs($scope.dados.operation);

			$scope.visitedTab = [false, false, false];
			$scope.dados.allTabsWereVisited = false;

			$scope.flags = {
				duplicatedAlarmAlert: false
			};

			$scope.dados.leftPercentage = 100;

			if (vm.contract) {
				$scope.hasContractError = function (typeError) {
					if (!(vm.contract.$error === undefined) && vm.contract.$error) {
						for (var i in vm.contract.$error.required) {
							if (vm.contract.$error.required[i].$name == typeError) {
								return true;
							}
						}
					}
				};
			}


			/**
             * OPERATION FORM
             **/
			vm.actionButtonSave = actionButtonSave;

			vm.actionSelectCasingType = actionSelectCasingType;

			vm.markTabAsVisited = markTabAsVisited;

			vm.confirmLeaving = confirmLeaving;

			vm.casingFormCalcs = casingFormCalcs;
			vm.riserFormCalcs = riserFormCalcs;
			vm.bhaFormCalcs = bhaFormCalcs;

			vm.validateContractParams = validateContractParams;
			vm.validateGeneralInfo = validateGeneralInfo;

			vm.actionTimeOperationItemClick = actionTimeOperationItemClick;

			vm.calcContractParamsConverter = calcContractParamsConverter;
			vm.myFunction = myFunction;
			

			function validateGeneralInfo() {
				angular.forEach(vm.info.$error.required, function (field) {
					field.$setDirty();
				});
			}

			function validateContractParams() {
				angular.forEach(vm.contract.$error.required, function (field) {
					field.$setDirty();
				});
			}

			function casingFormCalcs(param) {

				switch (param) {
				case 'averageJointLength':
				case 'numberOfCasingJointsPerSection':
					$scope.dados.operation.averageSectionLength = +$scope.dados.operation.averageJointLength * +$scope.dados.operation.numberOfCasingJointsPerSection;
					casingFormCalcs('averageSectionLength');
					break;
				case 'averageSectionLength':
					$scope.dados.operation.length = +$scope.dados.operation.numberOfCasingSections * +$scope.dados.operation.averageSectionLength;
					$scope.dados.operation.numberOfCasingSections = Math.ceil(+$scope.dados.operation.length / +$scope.dados.operation.averageSectionLength);
					casingFormCalcs('length');
					break;
				case 'numberOfCasingSections':
					$scope.dados.operation.length = +$scope.dados.operation.numberOfCasingSections * +$scope.dados.operation.averageSectionLength;
					casingFormCalcs('length');
					break;
				case 'length':
					$scope.dados.operation.settlementStringSize = (+$scope.dados.operation.endBitDepth - (+$scope.dados.operation.length));
					$scope.dados.operation.numberOfCasingSections = Math.ceil(+$scope.dados.operation.length / +$scope.dados.operation.averageSectionLength);
					casingFormCalcs('settlementStringSize');
					break;
				case 'holeDepth':
					$scope.dados.operation.settlementStringSize = (+$scope.dados.operation.holeDepth - (+$scope.dados.operation.length + +$scope.dados.operation.ratHole));
					$scope.dados.operation.endBitDepth = (+$scope.dados.operation.holeDepth - +$scope.dados.operation.ratHole);
					casingFormCalcs('settlementStringSize');
					break;
				case 'ratHole':
					$scope.dados.operation.settlementStringSize = (+$scope.dados.operation.holeDepth - (+$scope.dados.operation.length));
					$scope.dados.operation.endBitDepth = (+$scope.dados.operation.holeDepth - +$scope.dados.operation.ratHole);
					casingFormCalcs('settlementStringSize');
					break;
				case 'settlementStringSize':
				case 'averageStandLength':
					$scope.dados.operation.numberOfJoints = Math.ceil(+$scope.dados.operation.settlementStringSize / +$scope.dados.operation.averageStandLength);
					break;
				case 'averageDPLength':
				case 'numberOfDPPerStand':
					$scope.dados.operation.averageStandLength = +$scope.dados.operation.averageDPLength * +$scope.dados.operation.numberOfDPPerStand;
					casingFormCalcs('averageStandLength');
					break;
				default:
					break;
				}

			}

			function riserFormCalcs(param) {

				switch (param) {
				case 'averageJointLength':
					$scope.dados.operation.averageStandLength = +$scope.dados.operation.averageJointLength * +$scope.dados.operation.numberOfRiserPerSection;
					riserFormCalcs('averageStandLength');
					break;
				case 'numberOfRiserPerSection':
					$scope.dados.operation.averageStandLength = +$scope.dados.operation.averageJointLength * +$scope.dados.operation.numberOfRiserPerSection;
					break;
				case 'numberOfJoints':
					$scope.dados.operation.startHoleDepth = +$scope.dados.operation.numberOfJoints * +$scope.dados.operation.averageStandLength;
					break;
				case 'averageStandLength':
				case 'startHoleDepth':
					$scope.dados.operation.numberOfJoints = Math.ceil(+$scope.dados.operation.startHoleDepth / +$scope.dados.operation.averageStandLength);
					break;
				case 'length':
					$scope.dados.operation.numberOfJoints = Math.ceil((+$scope.dados.operation.startHoleDepth - (+$scope.dados.operation.length)) / +$scope.dados.operation.averageStandLength);
					break;
				default:
					break;
				}

			}

			function bhaFormCalcs(param) {

				switch (param) {
				case 'startHoleDepth':
					$scope.dados.operation.holeDepth = $scope.dados.operation.startHoleDepth;
					break;
				case 'numberOfDPPerStand':
				case 'averageDPLength':
					$scope.dados.operation.averageStandLength = +$scope.dados.operation.numberOfDPPerStand * +$scope.dados.operation.averageDPLength;
					// $scope.dados.operation.endBitDepth = +$scope.dados.operation.numberOfJoints * +$scope.dados.operation.averageStandLength + +$scope.dados.operation.length;
					$scope.dados.operation.numberOfJoints = null;
					$scope.dados.operation.endBitDepth = null;
					break;
				case 'endBitDepth':
				case 'length':
				case 'averageStandLength':
					$scope.dados.operation.numberOfJoints = Math.ceil((+$scope.dados.operation.endBitDepth - +$scope.dados.operation.length) / +$scope.dados.operation.averageStandLength);
					break;
				case 'numberOfJoints':
					$scope.dados.operation.endBitDepth = +$scope.dados.operation.numberOfJoints * +$scope.dados.operation.averageStandLength + +$scope.dados.operation.length;
					break;
				case 'inSlips':
					$scope.dados.operation.inSlipsDefault = +$scope.dados.operation.inSlips;
					break;
				default:
					break;
				}

			}

			function markTabAsVisited(index) {
				$scope.visitedTab[index] = true;
				$scope.dados.allTabsWereVisited = ($scope.visitedTab[0] == true) && ($scope.visitedTab[1] == true) && ($scope.visitedTab[2] == true);
			}

			function actionButtonSave() {

				dialogFactory.showConfirmDialog('Save and exit?', function () {

					var operation = $scope.dados.operation;


					if (operation.type == 'time') {
						operation.optimumTime = speedToTime($scope.dados.operation.contractParams.timeSpeed.voptimum);
						operation.standardTime = speedToTime($scope.dados.operation.contractParams.timeSpeed.vstandard); //$scope.dados.operation.contractParams.timeSpeed.vstandard * 3600000;
						operation.poorTime = speedToTime($scope.dados.operation.contractParams.timeSpeed.vpoor);

					}

					operation.contractParams = saveContractParams(operation, operation.contractParams);

					if (operation.id) {
						setupAPIService.updateObject('setup/operation',
							operation,
							function () {
								updateOperationCallback(operation);
							});
					} else {
						setupAPIService.insertObject('setup/operation',
							operation,
							insertOperationCallback);

					}

				});

			}

			function updateOperationCallback(operation) {

				if (operation && operation.running) {

					try { delete operation.alarms; } catch (e) { }
					try { delete operation.contractParams; } catch (e) { }
					try { delete operation.timeSlices; } catch (e) { }
					try { delete operation.section; } catch (e) { }

					operationDataFactory.emitUpdateRunningOperation(operation);

				}
				/** Libera o menu apos sair da tela */
				menuConfirmationFactory.setBlockMenu(false);

				$location.path('/setup/well/' + $routeParams.wellId + '/section/').search();

			}

			function insertOperationCallback() {
				/** Libera o menu apos sair da tela */
				menuConfirmationFactory.setBlockMenu(false);

				$location.path('/setup/well/' + $routeParams.wellId + '/section/').search();
				operationDataFactory.emitRefreshQueue();

			}

			function saveContractParams(operation, contractParams) {

				var newContractParams = [];

				delete $scope.dados.contractParams;

				for (var i in contractParams) {

					if (operation && operation.id) {
						contractParams[i].operation = {
							id: operation.id
						};
					}

					contractParams[i].type = i;
					newContractParams.push(contractParams[i]);
				}

				return newContractParams;
			}

			function actionTimeOperationItemClick(custom, type, name, standardTime) {
				$scope.dados.operation.custom = custom;

				$scope.dados.operation.name = name;
				$scope.dados.operation.metaType = type;

				if (!$scope.dados.operation.contractParams.timeSpeed)
					$scope.dados.operation.contractParams.timeSpeed = {};

				$scope.dados.operation.contractParams.timeSpeed.vstandard = 1 / standardTime;
				$scope.dados.operation.contractParams.timeSpeed.vpoor = 1 / (standardTime * 1.1);
				$scope.dados.operation.contractParams.timeSpeed.voptimum = 1 / (standardTime * 0.9);
			}

			function confirmLeaving() {
				dialogFactory.showCriticalDialog('Your changes will be lost. Proceed?', function () {
					$location.path('/setup/well/' + $routeParams.wellId + '/section/').search();

					/** Libera o menu apos sair da tela */
					menuConfirmationFactory.setBlockMenu(false);
				});
			}

			function actionSelectCasingType() {

				var newId = $scope.dados.operation.metaType;
				var averageSectionLength = $scope.dados.operation.averageSectionLength;

				var casingTripSpeedParams = angular.copy(operationConfigurationService.getCasingTripSpeedParams(newId));

				if (!casingTripSpeedParams)
					return;

				casingTripSpeedParams.voptimum = casingTripSpeedParams.voptimum * averageSectionLength;
				casingTripSpeedParams.vstandard = casingTripSpeedParams.vstandard * averageSectionLength;
				casingTripSpeedParams.vpoor = casingTripSpeedParams.vpoor * averageSectionLength;

				$scope.dados.operation.contractParams.casingTripSpeed = casingTripSpeedParams;
			}

			function speedToTime(speed) {
				var time = (1 / speed) * 3600000;
				return time;
			}
		}

		function changeImportedOperation(operationId) {
			setupAPIService.getObjectById('setup/operation', operationId, (response) => {
				openModalOperationImport(response.data);
			});
			
		}

		function openModalOperationImport(importedOperation) {

			modalInstance = $uibModal.open({
				animation: true,
				keyboard: false,
				backdrop: 'static',
				templateUrl: 'app/components/admin/views/modal/operation-copy-options.modal.html',
				controller: 'OperationCopyOptionsModalController as ocomController',
				resolve: {
					actionButtonConfirmCallback: function () {
						return actionButtonConfirmCallback;
					},
					actionButtonCancelCallback: function () {
						return actionButtonCancelCallback;
					},
					importedOperation: importedOperation, //operação que será importada
					currentOperation: $scope.dados.operation //operação que está no formulário
				}
			});
		}

		function actionButtonConfirmCallback(newOperation) {
			$scope.dados.selectedOperation = '';
			$scope.dados.operation = newOperation;
			modalInstance.close();
		}

		function calcContractParamsConverter(value, unit) {

			if(unit == 'min')
				$scope.dados.result = minutesToMetersPerHour(value);

		}

		function minutesToMetersPerHour(value) {
			if(value <= 0)
				return 0;

			return ( (1 * $scope.dados.operation.averageStandLength) / value ) * 60;
		}

		function myFunction(value) {
			/* Get the text field */
			var copyText = document.getElementById("result");

			// /* Select the text field */
			copyText.select();

			/* Copy the text inside the text field */
			document.execCommand("copy");
		}

	}

})();
