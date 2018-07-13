import * as angular from 'angular';
import { DMECLogController } from './dmec-log.controller';

const XPDDMECLogModule: angular.IModule  = angular.module('xpd.dmeclog', [
	'ui.bootstrap',
	'xpd.setupapi',
	'xpd.dmec',
	'xpd.filters',
	'xpd.timers',
	'highcharts',
	'xpd.visualization',
	'xpd.calculation',
	'xpd.communication']);
export default XPDDMECLogModule;

XPDDMECLogModule.controller('DMecLogController', DMECLogController);
