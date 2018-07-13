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

// 	xpdAdminNavBar.$inject = ['$location', 'menuConfirmationFactory', 'operationDataFactory', 'dialogFactory'];
import template from '../xpd-resources/ng/xpd.admin-nav-bar/admin-nav-bar.template.html';
import { OperationDataFactory } from '../xpd.communication/operation-server-data.factory';
import { DialogFactory } from '../xpd.dialog/xpd.dialog.factory';
import { MenuConfirmationFactory } from '../xpd.menu-confirmation/menu-confirmation.factory';

export class XPDAdminNavBarDirective implements ng.IDirective {

	public static $inject: string[] = ['$location', 'menuConfirmationFactory', 'operationDataFactory', 'dialogFactory'];

	public scope = {

	};
	public restrict = 'E';
	public template = template;

	constructor(
		private $location: ng.ILocationService,
		private menuConfirmationFactory: MenuConfirmationFactory,
		private operationDataFactory: OperationDataFactory,
		private dialogFactory: DialogFactory) { }

	public link: ng.IDirectiveLinkFn = (
		scope: any,
		element: ng.IAugmentedJQuery,
		attrs: ng.IAttributes,
		ctrl: any,
	) => {

		const self = this;

		this.operationDataFactory.openConnection([]).then(function (operationDataFactory: any) {

			if (attrs.navOrigin === 'report') {
				scope.onclickItemMenu = onclickItemMenuReport;
			} else {
				scope.onclickItemMenu = onclickItemMenuAdmin;
			}

			checkIfHasRunningOperation();

			self.operationDataFactory.addEventListener('menuConfirmationFactory', 'setOnRunningOperationListener', checkIfHasRunningOperation);
			self.operationDataFactory.addEventListener('menuConfirmationFactory', 'setOnOperationChangeListener', checkIfHasRunningOperation);
			self.operationDataFactory.addEventListener('menuConfirmationFactory', 'setOnNoCurrentOperationListener', checkIfHasRunningOperation);

			function onclickItemMenuAdmin(path, newTab) {
				const blockMenu = self.menuConfirmationFactory.getBlockMenu();

				if (!blockMenu) {

					redirectToPath(path, !!newTab);

				} else {
					const message = 'Your changes will be lost. Proceed?';

					self.dialogFactory.showCriticalDialog(message, function () {
						self.menuConfirmationFactory.setBlockMenu(false);
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
			menuConfirmationFactory: MenuConfirmationFactory,
			operationDataFactory: OperationDataFactory,
			dialogFactory: DialogFactory) => new XPDAdminNavBarDirective(
				$location,
				menuConfirmationFactory,
				operationDataFactory,
				dialogFactory,
			);
	}
}

// })();
