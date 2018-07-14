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

// 	failureNavBar.$inject = ['$uibModal', 'categorySetupAPIService', 'operationDataService', 'dialogService'];

import { IModalService } from 'angular-ui-bootstrap';
import failureLessoModal from 'app/components/admin/views/modal/tabs-failure-lesson.modal.html';
import template from '../xpd-resources/ng/xpd.failure-controller/failure-nav-bar.template.html';
import { OperationServerService } from '../xpd.communication/operation-server.service';
import { DialogService } from '../xpd.dialog/xpd.dialog.factory';
import { CategorySetupAPIService } from '../xpd.setupapi/category-setupapi.service';

export class FailureNavBarDirective implements ng.IDirective {
	public static $inject: string[] = ['$uibModal', 'categorySetupAPIService', 'operationDataService', 'dialogService'];

	public scope = {};
	public restrict = 'EA';
	public template = template;
	public operationDataFactory: any;

	constructor(
		private $uibModal: IModalService,
		private categorySetupAPIService: CategorySetupAPIService,
		private operationDataService: OperationServerService,
		private dialogService: DialogService) { }

	public link: ng.IDirectiveLinkFn = (
		scope: any,
		element: ng.IAugmentedJQuery,
		attrs: ng.IAttributes,
		ctrl: any,
	) => {

		const self = this;

		this.operationDataService.openConnection([]).then(function (operationDataFactory: any) {
			self.operationDataFactory = operationDataFactory;
			self.operationDataFactory.addEventListener('failureNavBar', 'setOnGoingFailureListener', loadOnGoingFailure);

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
				self.dialogService.showCriticalDialog('Are you sure you want to finish Failure?', finishFailureOnGoing);
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
			operationDataService: OperationServerService,
			dialogService: DialogService) => new FailureNavBarDirective(
				$uibModal,
				categorySetupAPIService,
				operationDataService,
				dialogService);
	}
}

// })();
