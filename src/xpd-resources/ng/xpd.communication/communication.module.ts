// (function() {
// 	'use strict',

// 	angular.module('xpd.communication', ['socketIO', 'xpd.accessfactory']);

// })();

import * as angular from 'angular';
import { XPDSocketIOModule } from '../socket.io/socketio.module';
import { XPDAccessModule } from '../xpd.access/accessfactory.module';
import { OperationServerService } from './operation-server.service';

const XPDCommunicationModule: angular.IModule = angular.module('xpd.communication', [
	XPDSocketIOModule.name,
	XPDAccessModule.name]);
export { XPDCommunicationModule };

XPDCommunicationModule.service('operationDataService', OperationServerService);
