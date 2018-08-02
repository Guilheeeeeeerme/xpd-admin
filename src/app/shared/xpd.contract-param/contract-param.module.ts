import * as angular from 'angular';

import { OperationContractInfoTableDirective } from './operation-contract-info-table.directive';

const XPDContractParamModule: angular.IModule = angular.module('xpd.contract-param', []);

export { XPDContractParamModule };

XPDContractParamModule.directive('xpdOperationContractInfoTable', OperationContractInfoTableDirective.Factory());
