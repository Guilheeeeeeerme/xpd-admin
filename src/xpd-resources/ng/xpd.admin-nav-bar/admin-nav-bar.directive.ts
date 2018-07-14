/*
* @Author: Gezzy Ramos
* @Date:   2017-05-15 17:46:40
* @Last Modified by:   Gezzy Ramos
* @Last Modified time: 2017-10-05 14:18:42
*/
// (function() {
// 	'use strict';

// 	angular.module('xpd.admin-nav-bar', [])
// 		.directive('xpdAdminNavBar', xpdAdminNavBar);

// 	xpdAdminNavBar.$inject = ['$location', 'menuConfirmationService', 'operationDataService', 'dialogService'];
import { OperationDataService } from '../xpd.communication/operation-server-data.factory';
import { DialogService } from '../xpd.dialog/xpd.dialog.factory';
import { MenuConfirmationService } from '../xpd.menu-confirmation/menu-confirmation.factory';
import template from './admin-nav-bar.template.html';

export class XPDAdminNavBarDirective implements ng.IDirective {

	public static $inject: string[] = ['$location', 'menuConfirmationService', 'operationDataService', 'dialogService'];

	public scope = {

	};
	public restrict = 'E';
	public template = template;
	public operationDataFactory: any;

	constructor(
		private $location: ng.ILocationService,
		private menuConfirmationService: MenuConfirmationService,
		private operationDataService: OperationDataService,
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

			if (attrs.navOrigin === 'report') {
				scope.onclickItemMenu = onclickItemMenuReport;
			} else {
				scope.onclickItemMenu = onclickItemMenuAdmin;
			}

			checkIfHasRunningOperation();

			self.operationDataService.addEventListener('menuConfirmationService', 'setOnRunningOperationListener', checkIfHasRunningOperation);
			self.operationDataService.addEventListener('menuConfirmationService', 'setOnOperationChangeListener', checkIfHasRunningOperation);
			self.operationDataService.addEventListener('menuConfirmationService', 'setOnNoCurrentOperationListener', checkIfHasRunningOperation);

			function onclickItemMenuAdmin(path, newTab) {
				const blockMenu = self.menuConfirmationService.getBlockMenu();

				if (!blockMenu) {

					redirectToPath(path, !!newTab);

				} else {
					const message = 'Your changes will be lost. Proceed?';

					self.dialogService.showCriticalDialog(message, function () {
						self.menuConfirmationService.setBlockMenu(false);
						redirectToPath(path, !!newTab);
					});
				}
			}

			function onclickItemMenuReport(path, newTab) {

				if (self.$location.port()) {

					if (path === 'dmeclog.html#/') {
						window.open('https://' + self.$location.host() + ':' + self.$location.port() + '/admin/dmeclog.html#');
					} else {
						if (newTab) {
							window.open('https://' + self.$location.host() + ':' + self.$location.port() + '/admin/admin.html#' + path);
						} else {
							window.location.href = 'https://' + self.$location.host() + ':' + self.$location.port() + '/admin/admin.html#' + path;
						}
					}

				} else {

					const url = window.location.href.split('/pages')[0];

					if (path === 'dmeclog.html#/') {
						window.open(url + 'pages/dmeclog.html#');
					} else {
						if (newTab) {
							window.open('https://' + url + 'pages/admin.html#' + path);
						} else {
							window.location.href = url + 'pages/admin.html#' + path;
						}
					}

				}
			}

			function redirectToPath(path, newTab) {

				if (self.$location.port()) {

					if (path === 'dmeclog.html#/') {
						window.open('https://' + self.$location.host() + ':' + self.$location.port() + '/admin/dmeclog.html#');
					} else if (path === 'reports.html#/') {
						window.location.href = 'https://' + self.$location.host() + ':' + self.$location.port() + '/admin/' + path;
					} else {
						if (!window.location.href.endsWith(path)) {
							if (newTab) {
								window.open('admin.html#' + path);
							} else {
								self.$location.url(path);
							}
						}
					}

				} else {

					const url = window.location.href.split('pages')[0];

					if (path === 'dmeclog.html#/') {
						window.open(url + '/pages/' + path);
					} else if (path === 'reports.html#/') {
						window.location.href = url + '/pages/' + path;
					} else {
						if (!window.location.href.endsWith(path)) {
							if (newTab) {
								window.open('admin.html#' + path);
							} else {
								self.$location.url(path);
							}
						}
					}

				}
			}

			function checkIfHasRunningOperation() {
				const context = operationDataFactory.operationData.operationContext;
				if (context && context.currentOperation && context.currentOperation.running && context.currentOperation.type !== 'time') {
					scope.hasRunningOperation = true;
				} else {
					scope.hasRunningOperation = false;
				}
			}
		});

	}

	public static Factory(): ng.IDirectiveFactory {
		return (
			$location: ng.ILocationService,
			menuConfirmationService: MenuConfirmationService,
			operationDataService: OperationDataService,
			dialogService: DialogService) => new XPDAdminNavBarDirective(
				$location,
				menuConfirmationService,
				operationDataService,
				dialogService,
			);
	}
}

// })();
