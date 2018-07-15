import * as angular from 'angular';
import 'angular-ui-bootstrap';
import { XPDCalculationModule } from '../xpd.calculation/calculation.module';
import { OperationContractInfoTableDirective } from './operation-contract-info-table.directive';

const XPDContractParamModule: angular.IModule = angular.module('xpd.contract-param', [
	'ui.bootstrap',
	XPDCalculationModule.name,
]);

export { XPDContractParamModule };

XPDContractParamModule.directive('operationContractInfoTable', OperationContractInfoTableDirective.Factory());
