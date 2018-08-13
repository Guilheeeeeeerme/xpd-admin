import * as angular from 'angular';
import { XPDOperationListDirective } from './operation-list.directive';

const XPDOperationListModule: angular.IModule  = angular.module('xpd.operation-list', []);

export { XPDOperationListModule };

XPDOperationListModule.directive('xpdOperationList', XPDOperationListDirective.Factory());
