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
import { XPDCommunicationModule } from '../xpd.communication/communication.module';
import { XPDDialogModule } from '../xpd.dialog/xpd.dialog.module';
import { XPDFailureModule } from '../xpd.modal.failure/xpd-modal-failure.module';
import { XPDOperationManagerModule } from '../xpd.operationmanager/operationmanager.module';
import { XPDScoredEventModule } from '../xpd.scoredevent/scoredevent.module';
import { XPDSetupAPIModule } from '../xpd.setupapi/setupapi.module';
import { XPDTimersModule } from '../xpd.timers/xpd-timers.module';
import { XPDVisualizationModule } from '../xpd.visualization/xpd-visualization.module';
import { TrackingController } from './tracking.controller';

const XPDTrackingModule: angular.IModule = angular.module('xpd.tracking', [
	'ui.bootstrap',
	XPDCommunicationModule.name,
	XPDOperationManagerModule.name,
	XPDScoredEventModule.name,
	XPDDialogModule.name,
	XPDFailureModule.name,
	XPDTimersModule.name,
	XPDSetupAPIModule.name,
	XPDVisualizationModule.name,
]);
export  { XPDTrackingModule }
XPDTrackingModule.controller('TrackingController', TrackingController);
