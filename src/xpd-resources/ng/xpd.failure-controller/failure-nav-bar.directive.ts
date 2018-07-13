/*
* @Author: gustavogomides7
* @Date:   2017-06-12 09:47:31
* @Last Modified by:   Gezzy Ramos
* @Last Modified time: 2017-10-05 16:42:35
*/

// (function() {
// 	'use strict';

// 	angular.module('xpd.failure-controller')
// 		.directive('failureNavBar', failureNavBar);

// 	failureNavBar.$inject = ['$uibModal', 'categorySetupAPIService', 'operationDataFactory', 'dialogFactory'];

import failureLessoModal from 'app/components/admin/views/modal/tabs-failure-lesson.modal.html';
import { IModalService } from '../../../../node_modules/@types/angular-ui-bootstrap';
import template from '../xpd-resources/ng/xpd.failure-controller/failure-nav-bar.template.html';
import { OperationDataFactory } from '../xpd.communication/operation-server-data.factory';
import { DialogFactory } from '../xpd.dialog/xpd.dialog.factory';
import { CategorySetupAPIService } from '../xpd.setupapi/category-setupapi.service';

export class FailureNavBarDirective implements ng.IDirective {
	public static $inject: string[] = ['$uibModal', 'categorySetupAPIService', 'operationDataFactory', 'dialogFactory'];

	public scope = {};
	public restrict = 'EA';
	public template = template;

	constructor(
		private $uibModal: IModalService,
		private categorySetupAPIService: CategorySetupAPIService,
		private operationDataFactory: OperationDataFactory,
		private dialogFactory: DialogFactory) { }

	public link: ng.IDirectiveLinkFn = (
		scope: any,
		element: ng.IAugmentedJQuery,
		attrs: ng.IAttributes,
		ctrl: any,
	) => {

		const self = this;

		this.operationDataFactory.openConnection([]).then(function (response) {
			const operationDataFactory: any = response;

			this.operationDataFactory.addEventListener('failureNavBar', 'setOnGoingFailureListener', loadOnGoingFailure);

			scope.actionButtonOpenFailureLessonModal = actionButtonOpenFailureLessonModal;
			scope.actionButtonFinishFailureOnGoing = actionButtonFinishFailureOnGoing;

			// loadOnGoingFailure();

			function loadOnGoingFailure() {
				const failureContext = operationDataFactory.operationData.failureContext;

				if (failureContext.onGoingFailure && failureContext.onGoingFailure != null) {

					scope.onGoingFailure = operationDataFactory.operationData.failureContext.onGoingFailure;

					if (scope.onGoingFailure.npt) {
						scope.failureClass = 'failure-npt';
						scope.categoryClass = 'failure-npt-category';
					} else {
						scope.failureClass = 'failure-normal';
						scope.categoryClass = 'failure-normal-category';
					}

					scope.enableFinishFailure = true;

					self.categorySetupAPIService.getCategoryName(scope.onGoingFailure.category.id, getCategoryNameSuccessCallback);

				} else {
					scope.failureClass = '';
					scope.failureTitle = 'No Failure on Going';
					scope.enableFinishFailure = false;
				}
			}

			function getCategoryNameSuccessCallback(data) {
				scope.failureTitle = 'Failure on Going';
				scope.failureCategory = data.name;
			}

			function actionButtonOpenFailureLessonModal() {
				self.$uibModal.open({
					animation: true,
					keyboard: false,
					backdrop: 'static',
					size: 'modal-sm',
					windowClass: 'xpd-operation-modal',
					template: failureLessoModal,
					controller: 'TabsFailureLLCtrl as tbsController',
				});
			}

			function actionButtonFinishFailureOnGoing() {
				self.dialogFactory.showCriticalDialog('Are you sure you want to finish Failure?', finishFailureOnGoing);
			}

			function finishFailureOnGoing() {
				scope.failureClass = '';
				scope.failureTitle = 'No Failure on Going';
				scope.enableFinishFailure = false;

				scope.onGoingFailure.onGoing = false;

				operationDataFactory.emitFinishFailureOnGoing();
			}
		});

	}

	public static Factory(): ng.IDirectiveFactory {
		return (
			$uibModal: IModalService,
			categorySetupAPIService: CategorySetupAPIService,
			operationDataFactory: OperationDataFactory,
			dialogFactory: DialogFactory) => new FailureNavBarDirective(
				$uibModal,
				categorySetupAPIService,
				operationDataFactory,
				dialogFactory);
	}
}

// })();
