// (function() {
// 	'use strict',

// })();

import * as angular from 'angular';
import { WitsDataService } from './wits-data.service';

const XPDWitsDataModule: angular.IModule = angular.module('xpd.wits.communication', []);
export { XPDWitsDataModule };

XPDWitsDataModule.service('witsDataService', WitsDataService);
