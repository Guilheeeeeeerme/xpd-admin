import * as angular from 'angular';

import { XPDSharedModule } from '../shared/shared.module';
import { DMECLogController } from './components/dmec-log/dmec-log.controller';

const XPDDMECLogModule: angular.IModule  = angular.module('xpd.dmeclog', [
	XPDSharedModule.name,
]);

export { XPDDMECLogModule };

XPDDMECLogModule.config(DMECLogController);
XPDDMECLogModule.controller('DMecLogController', DMECLogController);
