// (function () {

// 	'use strict';

// 	let app = angular.module('xpd.modal.laydown-confirmation', []);

// 	app.directive('laydownConfirmation', laydownConfirmation);

// 	laydownConfirmation.$inject = ['$uibModal', 'operationDataFactory'];

import { IModalService } from 'angular-ui-bootstrap';
import modalTemplate from '../xpd-resources/ng/xpd.modal.laydown-confirmation/xpd.modal.laydown-confirmation.template.html';

export class LayDownConfirmationDirective implements ng.IDirective {

	constructor(private $uibModal: IModalService, private operationDataFactory: OperationDataFactory) { }

	public scope: {
		dismissable: '<',
	};

	public link: ng.IDirectiveLinkFn = (
		scope: any,
		element: ng.IAugmentedJQuery,
		attributes: ng.IAttributes,
		ctrl: any,
	) => {

		const self: LayDownConfirmationDirective = this;

		let layDownDetectedModal = null;

		scope.actionButtonStartLaydown = actionButtonStartLaydown;

		this.operationDataFactory.openConnection([]).then(function (response) {
			self.operationDataFactory = response;
		});

		this.operationDataFactory.addEventListener('trackingController', 'setOnStateChangeListener', checkCurrentState);
		this.operationDataFactory.addEventListener('trackingController', 'setOnCurrentStateListener', checkCurrentState);
		this.operationDataFactory.addEventListener('trackingController', 'setOnChangeLaydownStatusListener', checkCurrentState);

		function actionButtonStartLaydown() {
			self.operationDataFactory.emitStartLayDown();
		}

		function checkCurrentState(stateContext) {

			// console.log(stateContext.currentState, stateContext.layDownDetected);

			if (!layDownDetectedModal && stateContext.currentState === 'layDown' && stateContext.layDownDetected === true) {
				scope.buttonNameStartLayDown = 'Start ' + (self.operationDataFactory.operationData.operationContext.currentOperation.type === 'bha' ? 'BHA' : 'BOP') + ' Lay Down';

				layDownDetectedModal = self.$uibModal.open({
					keyboard: false,
					animation: false,
					scope,
					size: 'lg',
					backdrop: !!scope.dismissable,
					windowClass: 'laydown-confirmation-modal',
					template: modalTemplate,
				});

			} else if (layDownDetectedModal) {
				if (layDownDetectedModal && layDownDetectedModal.close) {
					layDownDetectedModal.close();
				}
				layDownDetectedModal = null;
			}

		}

	}

	public static Factory(): ng.IDirectiveFactory {
		const directive = ($uibModal, operationDataFactory) => new LayDownConfirmationDirective($uibModal, operationDataFactory);
		directive.$inject = ['$uibModal', 'operationDataFactory'];
		return directive;
	}
}

// })();
