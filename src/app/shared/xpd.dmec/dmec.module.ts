import * as angular from 'angular';

import { DMECChartModalController } from './dmec-chart-modal.controller';
import { DMECService } from './dmec.service';

const XPDDMECModule: angular.IModule = angular.module('xpd.dmec', []);

export { XPDDMECModule };

XPDDMECModule.service('dmecService', DMECService);
XPDDMECModule.controller('DMECChartModalController', DMECChartModalController);
