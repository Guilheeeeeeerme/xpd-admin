/*
* @Author: Gezzy Ramos
* @Date:   2017-05-15 17:46:40
* @Last Modified by:   Gezzy Ramos
* @Last Modified time: 2017-10-05 14:18:42
*/

// (function() {
// 	'use strict',

// 	angular.module('xpd.communication', ['socketIO', 'xpd.accessfactory']);

// })();

import * as angular from 'angular';
import { XPDAdminNavBarDirective } from './admin-nav-bar.directive';

const XPDAdminNavBarModule: angular.IModule  = angular.module('xpd.admin-nav-bar', []);
export default XPDAdminNavBarModule;

XPDAdminNavBarModule.directive('xpdAdminNavBar', XPDAdminNavBarDirective.Factory());
