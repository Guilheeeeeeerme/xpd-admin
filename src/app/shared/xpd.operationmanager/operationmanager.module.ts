import * as angular from 'angular';
import { XPDOperationManagerDirective } from './operationmanager.directive';

const XPDOperationManagerModule: angular.IModule = angular.module('xpd.operationmanager', []);
export  { XPDOperationManagerModule };

XPDOperationManagerModule.directive('xpdOperationManager', XPDOperationManagerDirective.Factory());
