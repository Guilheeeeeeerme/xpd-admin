// (function() {
// 	'use strict',

// 	angular.module('xpd.tracking', [
// 		'ui.bootstrap',
// 		'xpd.communication',
// 		'xpd.operationmanager',
// 		'xpd.scoredevent',
// 		'xpd.dialog',
// 		'xpd.filters',
// 		'xpd.timers',
// 		'xpd.setupapi',
// 		'xpd.visualization',
// 	]);

// })();

// TODO: QUANDO ACABAR TUDO, REVER ESSE MODULO
import * as angular from 'angular';
import 'angular-ui-bootstrap';
import XPDDialogModule from '../xpd.dialog/xpd.dialog.module';
import XPDTimersModule from '../xpd.timers/xpd-timers.module';
import XPDVisualizationModule from '../xpd.visualization/xpd-visualization.module';
import { TrackingController } from './tracking.controller';

const XPDTrackingModule: angular.IModule = angular.module('xpd.tracking', [
	'ui.bootstrap',
	'xpd.communication',
	'xpd.operationmanager',
	'xpd.scoredevent',
	XPDDialogModule.name,
	'xpd.filters',
	XPDTimersModule.name,
	'xpd.setupapi',
	XPDVisualizationModule.name,

]);
export default XPDTrackingModule;
XPDTrackingModule.controller('TrackingController', TrackingController);

