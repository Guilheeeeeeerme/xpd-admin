// (function() {
// 	'use strict';

// 	angular.module('xpd.accessfactory')
// 		.directive('accessFactoryDirective', accessFactoryDirective);

// 	accessFactoryDirective.$inject = ['$uibModal', 'dialogService'];
import { IModalService } from 'angular-ui-bootstrap';
import template from '../xpd.access/accessfactory.template.html';
import { DialogService } from '../xpd.dialog/xpd.dialog.factory';

export class AccessFactoryDirective implements ng.IDirective {

	public static $inject: string[] = ['$uibModal', 'dialogService'];

	public restrict = 'E';
		public scope = {
			hideReports: '@',
			hideSetup: '@',
		};
		public template = template;

	constructor(private $uibModal: IModalService, private dialogService: DialogService) {

	}

	public link: ng.IDirectiveLinkFn = (
		scope: any,
		element: ng.IAugmentedJQuery,
		attrs: ng.IAttributes,
		ctrl: any,
	) => {
		const self = this;

		let modalInstance;

		scope.actionButtonEditAccessData = actionButtonEditAccessData;
		scope.actionButtonSave = actionButtonSave;
		scope.actionButtonCancel = actionButtonCancel;

		function actionButtonSave() {
			self.dialogService.showConfirmDialog('This action will reload your aplication screen. Proceed?', actionProceed);
		}

		function actionProceed() {
			localStorage.setItem('xpd.admin.XPDAccessData', JSON.stringify(scope.dados.XPDAccessData));
			location.reload();
		}

		function actionButtonCancel() {
			modalInstance.close();
			modalInstance = null;
		}

		function actionButtonEditAccessData() {
			scope.dados = {
				XPDAccessData: JSON.parse(localStorage.getItem('xpd.admin.XPDAccessData')),
			};

			if (!modalInstance) {
				modalInstance = self.$uibModal.open({
					animation: true,
					size: 'sm',
					backdrop: false,
					templateUrl: 'accessFactoryDirectiveModal.html',
					scope,
				});
			}
		}
	}

	public static Factory(): ng.IDirectiveFactory {
		return ($uibModal: IModalService, dialogService: DialogService) => new AccessFactoryDirective($uibModal, dialogService);
	}

}

// })();
