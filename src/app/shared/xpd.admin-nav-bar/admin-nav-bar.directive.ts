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
import { AuthService } from '../xpd.setupapi/auth.service';
import './admin-nav-bar.style.scss';
import template from './admin-nav-bar.template.html';

export class XPDAdminNavBarDirective implements ng.IDirective {

	public static $inject: string[] = [
		'$location',
		'menuConfirmationService',
		'operationDataService',
		'dialogService'];

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

		const onclickItemMenuAdmin = (path, newTab) => {
			const blockMenu = this.menuConfirmationService.getBlockMenu();

			if (!blockMenu) {
				redirectToPath(path, newTab);
			} else {
				const message = 'Your changes will be lost. Proceed?';

				this.dialogService.showCriticalDialog(message, () => {
					this.menuConfirmationService.setBlockMenu(false);
					redirectToPath(path, newTab);
				});
			}
		};

		const redirectToPath = (path, newTab) => {
			AuthService.redirectToPath(path, newTab);

		};

		const checkIfHasRunningOperation = () => {
			const context = this.operationDataFactory.operationData.operationContext;
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

		this.operationDataService.openConnection(['operation']).then(() => {

			this.operationDataFactory = this.operationDataService.operationDataFactory;

			checkIfHasRunningOperation();

			this.operationDataService.on(scope, 'setOnRunningOperationListener', () => { checkIfHasRunningOperation(); });
			this.operationDataService.on(scope, 'setOnOperationChangeListener', () => { checkIfHasRunningOperation(); });
			this.operationDataService.on(scope, 'setOnNoCurrentOperationListener', () => { checkIfHasRunningOperation(); });

		});

	}
}
