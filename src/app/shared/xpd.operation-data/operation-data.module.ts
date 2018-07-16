// (function() {
// 	'use strict',

// 	angular.module('xpd.communication', ['socketIO', 'xpd.accessfactory']);

// })();

import * as angular from 'angular';
import { OperationDataService } from './operation-data.service';

const XPDOperationDataModule: angular.IModule = angular.module('xpd.communication', []);
export { XPDOperationDataModule };

XPDOperationDataModule.service('operationDataService', OperationDataService);
