// (function() {
// 	'use strict';

import { IWindowService } from 'angular';
import { IModalService } from 'angular-ui-bootstrap';
import template from '../xpd.access/accessfactory.template.html';
import { DialogService } from '../xpd.dialog/xpd.dialog.factory';
import { AuthService } from '../xpd.setupapi/auth.service';
import { XPDAccessService } from './access.service';
import { AccessFactoryService } from './accessfactory.service';

export class AccessFactoryDirective implements ng.IDirective {

	public static $inject: string[] = ['$uibModal', '$window', 'dialogService', 'authService', 'xpdAccessService'];

	public static Factory(): ng.IDirectiveFactory {
		return (
			$uibModal: IModalService,
			$window: IWindowService,
			dialogService: DialogService,
			authService: AuthService,
			accessFactoryService: AccessFactoryService,
			xpdAccessService: XPDAccessService) => new AccessFactoryDirective($uibModal, $window, dialogService, authService, accessFactoryService, xpdAccessService);
	}

	public restrict = 'E';
	public scope = {
		hideReports: '@',
		hideSetup: '@',
	};
	public template = template;

	constructor(
		private $uibModal: IModalService,
		private $window: ng.IWindowService,
		private dialogService: DialogService,
		private authService: AuthService,
		private accessFactoryService: AccessFactoryService,
		private xpdAccessService: XPDAccessService) {
	}

	public link: ng.IDirectiveLinkFn = (
		scope: any,
		element: ng.IAugmentedJQuery,
		attrs: ng.IAttributes,
		ctrl: any,
	) => {

		const actionButtonEditAccessData = () => {
			this.accessFactoryService.actionButtonEditAccessData();
		};

		scope.actionButtonEditAccessData = actionButtonEditAccessData;
	}

}

// })();
