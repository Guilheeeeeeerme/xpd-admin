import * as angular from 'angular';
import XPDDialogModule from '../../../../xpd-resources/ng/xpd.dialog/xpd.dialog.module';
import { OperationviewonlyController } from './operation-view-only.controller';

const XPDOperationViewOnlyModule: angular.IModule  = angular.module('xpd.operationviewonly', [
	XPDDialogModule.name,
	'xpd.setupapi',
	'ui.bootstrap',
	'xpd.contract-param',
	'xpd.contractTimeInput',
	'toastr',
	'ngAnimate',
	'xpd.setup-form-input',
]);
export default XPDOperationViewOnlyModule;
XPDOperationViewOnlyModule.controller('operationviewonlyController', OperationviewonlyController);
