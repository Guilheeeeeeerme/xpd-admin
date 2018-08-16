import * as angular from 'angular';

import { XPDSharedModule } from '../shared/shared.module';
import { DMECLogController } from './components/dmec-log/dmec-log.controller';
import { DMECConfig } from './dmec-log.config';

const XPDDMECLogModule: angular.IModule  = angular.module('xpd.dmeclog', [
	XPDSharedModule.name,
]);

import './../../assets/css/dmec-log.scss';

export { XPDDMECLogModule };

XPDDMECLogModule.config(DMECConfig);
XPDDMECLogModule.controller('DMecLogController', DMECLogController);
