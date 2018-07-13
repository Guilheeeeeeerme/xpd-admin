// (function() {
// 	'use strict';

// 	const app = angular.module('xpd.accessfactory', []);

// })();

import * as angular from 'angular';
import { AccessFactoryDirective } from './accessfactory.directive';
import { XPDAccessFactory } from './accessfactory.factory';
import { SecurityConfig } from './security-interceptor.config';
import { SecurityInteceptorFactory } from './security-interceptor.factory';

const XPDAccessModule: angular.IModule  = angular.module('xpd.accessfactory', []);
export default XPDAccessModule;

XPDAccessModule.factory('securityInteceptor', SecurityInteceptorFactory);
XPDAccessModule.config(SecurityConfig);
XPDAccessModule.factory('xpdAccessFactory', XPDAccessFactory);
XPDAccessModule.directive('accessFactoryDirective', AccessFactoryDirective.Factory());
