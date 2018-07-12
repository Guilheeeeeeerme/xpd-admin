// (function() {
// 	'use strict',

// 	angular.module('xpd.communication', ['socketIO', 'xpd.accessfactory']);

// })();

import * as angular from 'angular';
import { OperationDataFactory } from './operation-server-data.factory';

const XPDCommunicationModule: angular.IModule  = angular.module('xpd.communication', ['socketIO', 'xpd.accessfactory']);
export default XPDCommunicationModule;

XPDCommunicationModule.factory('operationDataFactory', OperationDataFactory);
