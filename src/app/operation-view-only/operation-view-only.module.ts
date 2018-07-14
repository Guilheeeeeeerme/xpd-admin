import * as angular from 'angular';
import 'angular-animate';
import 'angular-toastr';
import 'angular-ui-bootstrap';
import { XPDContractParamModule } from '../../xpd-resources/ng/xpd.contract-param/contract-param.module';
import { XPDContractTimeInputModule } from '../../xpd-resources/ng/xpd.contract-time-input/contract-time-input.module';
import { XPDDialogModule } from '../../xpd-resources/ng/xpd.dialog/xpd.dialog.module';
import { XPDSetupFormInputDirective } from '../../xpd-resources/ng/xpd.setup-form-input/setup-form-input.directive';
import { XPDSetupAPIModule } from '../../xpd-resources/ng/xpd.setupapi/setupapi.module';
import { OperationViewOnlyController } from './components/operation-view-only/operation-view-only.controller';
import { OperationConfig } from './operation-view-only.config';

const XPDOperationViewOnlyModule: angular.IModule = angular.module('xpd.operationviewonly', [
	XPDDialogModule.name,
	XPDSetupAPIModule.name,
	'ui.bootstrap',
	XPDContractParamModule.name,
	XPDContractTimeInputModule.name,
	'toastr',
	'ngAnimate',
	XPDSetupFormInputDirective.name,
]);

export { XPDOperationViewOnlyModule };

XPDOperationViewOnlyModule.controller('OperationViewOnlyController', OperationViewOnlyController);
XPDOperationViewOnlyModule.config(OperationConfig);
