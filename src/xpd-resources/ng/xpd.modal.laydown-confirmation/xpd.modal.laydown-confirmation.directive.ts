// (function () {

// 	'use strict';

// 	let app = angular.module('xpd.modal.laydown-confirmation', []);

// 	app.directive('laydownConfirmation', laydownConfirmation);

// 	laydownConfirmation.$inject = ['$uibModal', 'operationDataService'];

import { IModalService } from 'angular-ui-bootstrap';
import { OperationDataService } from '../xpd.operation-data/operation-data.service';
import modalTemplate from './xpd.modal.laydown-confirmation.template.html';

export class LayDownConfirmationDirective implements ng.IDirective {

	public operationDataFactory: any;
	public layDownDetectedModal: any;
	constructor(private $uibModal: IModalService, private operationDataService: OperationDataService) { }

	public scope: any = {
		dismissable: '<',
	};

	public link: ng.IDirectiveLinkFn = (
		scope: any,
		element: ng.IAugmentedJQuery,
		attributes: ng.IAttributes,
		ctrl: any,
	) => {
		const vm = this;

		this.operationDataService.openConnection([]).then(function () {
			vm.operationDataFactory = vm.operationDataService.operationDataFactory;

			scope.actionButtonStartLaydown = actionButtonStartLaydown;

			vm.operationDataService.on('setOnStateChangeListener', (stateContext: any) => {
				vm.checkCurrentState(stateContext);
			});

			vm.operationDataService.on('setOnCurrentStateListener', (stateContext: any) => {
				vm.checkCurrentState(stateContext);
			});

			vm.operationDataService.on('setOnChangeLaydownStatusListener', (stateContext: any) => {
				vm.checkCurrentState(stateContext);
			});

			function actionButtonStartLaydown() {
				vm.operationDataFactory.emitStartLayDown();
			}

		});

	}

	private checkCurrentState(stateContext) {

		// console.log(stateContext.currentState, stateContext.layDownDetected);

		if (!this.layDownDetectedModal && stateContext.currentState === 'layDown' && stateContext.layDownDetected === true) {
			this.scope.buttonNameStartLayDown = 'Start ' + (this.operationDataFactory.operationData.operationContext.currentOperation.type === 'bha' ? 'BHA' : 'BOP') + ' Lay Down';

			this.layDownDetectedModal = this.$uibModal.open({
				keyboard: false,
				animation: false,
				scope: this.scope,
				size: 'lg',
				backdrop: !!this.scope.dismissable,
				windowClass: 'laydown-confirmation-modal',
				template: modalTemplate,
			});

		} else if (this.layDownDetectedModal) {
			if (this.layDownDetectedModal && this.layDownDetectedModal.close) {
				this.layDownDetectedModal.close();
			}
			this.layDownDetectedModal = null;
		}

	}

	public static Factory(): ng.IDirectiveFactory {
		const directive = ($uibModal, operationDataService) => new LayDownConfirmationDirective($uibModal, operationDataService);
		directive.$inject = ['$uibModal', 'operationDataService'];
		return directive;
	}
}

// })();
