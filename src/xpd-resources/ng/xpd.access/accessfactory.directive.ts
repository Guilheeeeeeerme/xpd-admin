// (function() {
// 	'use strict';

// 	angular.module('xpd.accessfactory')
// 		.directive('accessFactoryDirective', accessFactoryDirective);

// 	accessFactoryDirective.$inject = ['$uibModal', 'dialogFactory'];
import { IModalService } from 'angular-ui-bootstrap';
import template from '../xpd-resources/ng/xpd.access/accessfactory.template.html';
import { DialogFactory } from '../xpd.dialog/xpd.dialog.factory';

export class AccessFactoryDirective implements ng.IDirective {

	public static $inject: string[] = ['$uibModal', 'dialogFactory'];

	public restrict = 'E';
		public scope = {
			hideReports: '@',
			hideSetup: '@',
		};
		public template = template;

	constructor(private $uibModal: IModalService, private dialogFactory: DialogFactory) {

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
			self.dialogFactory.showConfirmDialog('This action will reload your aplication screen. Proceed?', actionProceed);
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
		return ($uibModal: IModalService, dialogFactory: DialogFactory) => new AccessFactoryDirective($uibModal, dialogFactory);
	}

}

// })();
