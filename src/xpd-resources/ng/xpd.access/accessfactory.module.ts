// (function() {
// 	'use strict';

// 	const app = angular.module('xpd.accessfactory', []);

// })();

import * as angular from 'angular';
import { XPDAccessService } from './access.service';
import { AccessFactoryDirective } from './accessfactory.directive';
import { SecurityConfig } from './security-interceptor.config';
import { SecurityInteceptorFactory } from './security-interceptor.factory';

const XPDAccessModule: angular.IModule  = angular.module('xpd.accessfactory', []);
export { XPDAccessModule };

XPDAccessModule.factory('securityInteceptor', SecurityInteceptorFactory);
XPDAccessModule.config(SecurityConfig);
XPDAccessModule.service('xpdAccessService', XPDAccessService);
XPDAccessModule.directive('accessFactoryDirective', AccessFactoryDirective.Factory());
