/*
* @Author: Gezzy Ramos
* @Date:   2017-05-15 17:46:40
* @Last Modified by:   Gezzy Ramos
* @Last Modified time: 2017-10-05 14:18:42
*/
// (function() {
// 	'use strict';

// 	xpdAdminNavBar.$inject = ['$location', 'menuConfirmationService', 'operationDataService', 'dialogService'];
import { DialogService } from '../xpd.dialog/xpd.dialog.factory';
import { MenuConfirmationService } from '../xpd.menu-confirmation/menu-confirmation.factory';
import { OperationDataService } from '../xpd.operation-data/operation-data.service';
import template from './admin-nav-bar.template.html';

export class XPDAdminNavBarDirective implements ng.IDirective {

	public static $inject: string[] = [
		'$location',
		'menuConfirmationService',
		'operationDataService',
		'dialogService'];

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

		this.operationDataService.openConnection([]).then(() => {

			self.operationDataFactory = self.operationDataService.operationDataFactory;

			const onclickItemMenuAdmin = (path, newTab) => {
				const blockMenu = self.menuConfirmationService.getBlockMenu();

				if (!blockMenu) {
					redirectToPath(path, newTab);
				} else {
					const message = 'Your changes will be lost. Proceed?';

					self.dialogService.showCriticalDialog(message, () => {
						self.menuConfirmationService.setBlockMenu(false);
						redirectToPath(path, newTab);
					});
				}
			};

			const redirectToPath = (path, newTab) => {

				if (self.$location.port()) {
					path = 'https://' + self.$location.host() + ':' + self.$location.port() + path;
				}

				debugger;

				console.log(window.location);

				if (newTab === true) {
					window.open(path);
				} else {
					window.location.href = path;
				}

				// this.$location.path( path );

				// console.log(path, newTab);

				// if (self.$location.port()) {

				// 	if (path === 'dmeclog.html#/') {
				// 		window.open('https://' + self.$location.host() + ':' + self.$location.port() + '/admin/dmeclog.html#');
				// 	} else if (path === 'reports.html#/') {
				// 		window.location.href = 'https://' + self.$location.host() + ':' + self.$location.port() + '/' + path;
				// 	} else {
				// 		if (!window.location.href.endsWith(path)) {
				// 			if (newTab) {
				// 				window.open('admin.html#' + path);
				// 			} else {
				// 				self.$location.url(path);
				// 			}
				// 		}
				// 	}

				// } else {

				// 	const url = window.location.href.split('pages')[0];

				// 	if (path === 'dmeclog.html#/') {
				// 		window.open(url + '/pages/' + path);
				// 	} else if (path === 'reports.html#/') {
				// 		window.location.href = url + '/pages/' + path;
				// 	} else {
				// 		if (!window.location.href.endsWith(path)) {
				// 			self.$location.url(path);
				// 		}
				// 	}

				// }

			};

			const checkIfHasRunningOperation = () => {
				const context = self.operationDataFactory.operationData.operationContext;
				if (context && context.currentOperation && context.currentOperation.running && context.currentOperation.type !== 'time') {
					scope.hasRunningOperation = true;
				} else {
					scope.hasRunningOperation = false;
				}
			};

			if (attrs.navOrigin === 'report') {
				scope.onclickItemMenu = redirectToPath;
			} else {
				scope.onclickItemMenu = onclickItemMenuAdmin;
			}

			checkIfHasRunningOperation();

			self.operationDataService.on('setOnRunningOperationListener', () => { checkIfHasRunningOperation(); });
			self.operationDataService.on('setOnOperationChangeListener', () => { checkIfHasRunningOperation(); });
			self.operationDataService.on('setOnNoCurrentOperationListener', () => { checkIfHasRunningOperation(); });

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
