// (function() {
// 	'use strict',

// })();

import * as angular from 'angular';
import { OperationDataService } from './operation-data.service';

const XPDOperationDataModule: angular.IModule = angular.module('xpd.communication', []);
export { XPDOperationDataModule };

XPDOperationDataModule.service('operationDataService', OperationDataService);
