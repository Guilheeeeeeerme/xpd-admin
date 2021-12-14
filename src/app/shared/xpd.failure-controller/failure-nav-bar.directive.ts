/*
* @Author: gustavogomides7
* @Date:   2017-06-12 09:47:31
* @Last Modified by:   Gezzy Ramos
* @Last Modified time: 2017-10-05 16:42:35
*/

// (function() {
// 	'use strict';

// 	failureNavBar.$inject = ['$uibModal', 'categorySetupAPIService', 'operationDataService', 'dialogService'];

import { IModalService } from 'angular-ui-bootstrap';
import { DialogService } from '../xpd.dialog/xpd.dialog.factory';
import { OperationDataService } from '../xpd.operation-data/operation-data.service';
import { CategorySetupAPIService } from '../xpd.setupapi/category-setupapi.service';
import './failure-nav-bar.style.scss';
import template from './failure-nav-bar.template.html';
import failureLessoModal from './tabs-failure-lesson.modal.html';

export class FailureNavBarDirective implements ng.IDirective {
	public static $inject: string[] = [
		'$uibModal',
		'categorySetupAPIService',
		'operationDataService',
		'dialogService'];

	public static Factory(): ng.IDirectiveFactory {
		return (
			$uibModal: IModalService,
			categorySetupAPIService: CategorySetupAPIService,
			operationDataService: OperationDataService,
			dialogService: DialogService) => new FailureNavBarDirective(
				$uibModal,
				categorySetupAPIService,
				operationDataService,
				dialogService);
	}

	public restrict = 'E';
	public template = template;
	public operationDataFactory: any;

	constructor(
		private $uibModal: IModalService,
		private categorySetupAPIService: CategorySetupAPIService,
		private operationDataService: OperationDataService,
		private dialogService: DialogService) { }

	public link: ng.IDirectiveLinkFn = (
		scope: any,
		element: ng.IAugmentedJQuery,
		attrs: ng.IAttributes,
		ctrl: any,
	) => {

		const loadOnGoingFailure = () => {
			const failureContext = this.operationDataFactory.operationData.failureContext;

			if (failureContext.onGoingFailure && failureContext.onGoingFailure != null) {

				scope.onGoingFailure = this.operationDataFactory.operationData.failureContext.onGoingFailure;

				if (scope.onGoingFailure.npt) {
					scope.failureClass = 'failure-npt';
					scope.categoryClass = 'failure-npt-category';
				} else {
					scope.failureClass = 'failure-normal';
					scope.categoryClass = 'failure-normal-category';
				}

				scope.enableFinishFailure = true;

				this.categorySetupAPIService.getCategoryName(scope.onGoingFailure.category.id).then((arg) => { getCategoryNameSuccessCallback(arg); });

			} else {
				scope.failureClass = '';
				scope.failureTitle = 'No Failure on Going';
				scope.enableFinishFailure = false;
			}
		};

		const getCategoryNameSuccessCallback = (data) => {
			scope.failureTitle = 'Failure on Going';
			scope.failureCategory = data.name;
		};

		const actionButtonOpenFailureLessonModal = () => {
			this.$uibModal.open({
				animation: true,
				keyboard: false,
				backdrop: 'static',
				size: 'modal-sm',
				windowClass: 'xpd-operation-modal',
				template: failureLessoModal,
				controller: 'TabsFailureLLCtrl as tbsController',
			});
		};

		const actionButtonFinishFailureOnGoing = () => {
			this.dialogService.showCriticalDialog('Are you sure you want to finish Failure?', () => { finishFailureOnGoing(); });
		};

		const finishFailureOnGoing = () => {
			scope.failureClass = '';
			scope.failureTitle = 'No Failure on Going';
			scope.enableFinishFailure = false;

			scope.onGoingFailure.onGoing = false;

			this.operationDataFactory.emitFinishFailureOnGoing();
		};

		this.operationDataService.openConnection(['failure']).then(() => {
			this.operationDataFactory = this.operationDataService.operationDataFactory;

			this.operationDataService.on(scope, 'setOnGoingFailureListener', () => {
				loadOnGoingFailure();
			});

			scope.actionButtonOpenFailureLessonModal = actionButtonOpenFailureLessonModal;
			scope.actionButtonFinishFailureOnGoing = actionButtonFinishFailureOnGoing;

			// loadOnGoingFailure();

		});

	}
}

// })();
