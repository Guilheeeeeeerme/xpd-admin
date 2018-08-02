import * as angular from 'angular';

import { XPDSharedModule } from '../shared/shared.module';
import { OperationViewOnlyController } from './components/operation-view-only/operation-view-only.controller';
import { OperationConfig } from './operation-view-only.config';

const XPDOperationViewOnlyModule: angular.IModule = angular.module('xpd.operationviewonly', [
	XPDSharedModule.name,
]);

export { XPDOperationViewOnlyModule };

XPDOperationViewOnlyModule.config(OperationConfig);

XPDOperationViewOnlyModule.controller('OperationViewOnlyController', OperationViewOnlyController);
