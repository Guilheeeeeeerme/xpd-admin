import * as angular from 'angular';
import 'angular-route';
import { XPDSetupAPIModule } from '../xpd.setupapi/setupapi.module';
import { XPDTimersModule } from '../xpd.timers/xpd-timers.module';
import { DMECService } from './dmec.service';

const XPDDMECModule: angular.IModule = angular.module('xpd.dmec', [
	'ngRoute',
	XPDTimersModule.name,
	XPDSetupAPIModule.name,
]);
export { XPDDMECModule };

XPDDMECModule.service('dmecService', DMECService);
