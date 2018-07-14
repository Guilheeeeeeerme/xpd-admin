// (function() {
// 	'use strict',

// 	angular.module('xpd.communication', ['socketIO', 'xpd.accessfactory']);

// })();

import * as angular from 'angular';
import { XPDAccessModule } from '../xpd.access/accessfactory.module';
import { OperationDataService } from './operation-data.service';

const XPDOperationDataModule: angular.IModule = angular.module('xpd.communication', [
	XPDAccessModule.name]);
export { XPDOperationDataModule };

XPDOperationDataModule.service('operationDataService', OperationDataService);
