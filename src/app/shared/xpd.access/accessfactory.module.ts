// (function() {
// 	'use strict';

// })();

import * as angular from 'angular';

import { XPDAccessService } from './access.service';
import { AccessFactoryModalController } from './accessfactory-modal.controller';
import { AccessFactoryController } from './accessfactory.controller';
import { AccessFactoryDirective } from './accessfactory.directive';
import { AccessFactoryService } from './accessfactory.service';
import { SecurityInterceptorConfig } from './security-interceptor.config';
import { SecurityInteceptorFactory } from './security-interceptor.factory';

const XPDAccessModule: angular.IModule = angular.module('xpd.accessfactory', []);

export { XPDAccessModule };

XPDAccessModule.factory('securityInteceptor', SecurityInteceptorFactory);

XPDAccessModule.config(SecurityInterceptorConfig);

XPDAccessModule.service('xpdAccessService', XPDAccessService);

XPDAccessModule.directive('xpdAccessFactoryDirective', AccessFactoryDirective.Factory());
XPDAccessModule.service('accessFactoryService', AccessFactoryService);
XPDAccessModule.controller('AccessFactoryController', AccessFactoryController);
XPDAccessModule.controller('AccessFactoryModalController', AccessFactoryModalController);
