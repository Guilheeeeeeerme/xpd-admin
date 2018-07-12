(function() {
	'use strict';

	angular.module('xpd.admin').controller('OperationCopyOptionsModalController', operationCopyOptionsModalController);

	operationCopyOptionsModalController.$inject = ['actionButtonConfirmCallback', 'actionButtonCancelCallback', 'importedOperation', 'currentOperation'];

	function operationCopyOptionsModalController(actionButtonConfirmCallback, actionButtonCancelCallback, importedOperation, currentOperation) {
		const vm = this;

		vm.flag = {
			operationInfo: false,
			contractPerformance: false,
			timeSlices: false,
		};

		let newOperation = null;

		vm.bindImportFlag = bindImportFlag;
		vm.actionButtonCancel = actionButtonCancel;
		vm.actionButtonConfirm = actionButtonConfirm;

		function actionButtonCancel() {
			actionButtonCancelCallback && actionButtonCancelCallback();
		}

		function actionButtonConfirm() {

			processOperationInfo();
			processContractPerformance();
			processTimeSlices();

			actionButtonConfirmCallback && actionButtonConfirmCallback(newOperation);
		}

		function processOperationInfo() {
			if (vm.flag.operationInfo == true) {
				delete importedOperation.id;
				delete importedOperation.startDate;
				delete importedOperation.operationOrder;
				newOperation = importedOperation;
				newOperation.section = currentOperation.section;
			} else {
				newOperation = currentOperation;
			}

			newOperation.current = false;
			newOperation.running = false;
			newOperation.hasStarted = false;
		}

		function processContractPerformance() {
			if (vm.flag.contractPerformance == true) {
				const contractParams = objectCleaning(importedOperation.contractParams);
				if (contractParams[0]) {
					newOperation.contractParams = changeKeyContractParams(contractParams);
				}
			} else {
				newOperation.contractParams = currentOperation.contractParams;
			}
		}

		function processTimeSlices() {
			if (vm.flag.timeSlices == true) {
				newOperation.timeSlices = objectCleaning(importedOperation.timeSlices);
			} else {
				newOperation.timeSlices = currentOperation.timeSlices;
			}
		}

		/**
		 * Remove atributos desnecessários
		 * de uma lista de obj
		*/
		function objectCleaning(objList) {
			for (const i in objList) {
				delete objList[i].id;
				delete objList[i].operation;
			}

			return objList;
		}

		function changeKeyContractParams(contractParams) {

			const cp = {};

			for (const i in contractParams) {
				cp[contractParams[i].type] = contractParams[i];
				delete cp[contractParams[i].type].type;
			}

			return cp;
		}

		/**
		 * Na operação de tempo
		 * não faz sentido importar apenas um
		 * dos atributos da operação
		 */
		function bindImportFlag(input) {
			if (currentOperation.type == 'time') {
				if (input == 'contract') {
					vm.flag.timeSlices = vm.flag.contractPerformance;
				}

				if (input == 'timeSlice') {
					vm.flag.contractPerformance = vm.flag.timeSlices;
				}
			}
		}
	}
})();
