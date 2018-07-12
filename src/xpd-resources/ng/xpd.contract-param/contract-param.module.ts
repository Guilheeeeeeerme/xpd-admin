import * as angular from 'angular';
import XPDCalculationModule from '../xpd.calculation/calculation.module';
import { OperationContractInfoTableDirective } from './operation-contract-info-table.directive';

const XPDContractParamModule: angular.IModule  = angular.module('xpd.contract-param', [XPDCalculationModule.name]);
export default XPDContractParamModule;

XPDContractParamModule.directive('operationContractInfoTable', OperationContractInfoTableDirective.Factory());

