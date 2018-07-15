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
import 'angular-route';
import { XPDDialogModule } from '../xpd.dialog/xpd.dialog.module';
import { XPDMenuConfirmationModule } from '../xpd.menu-confirmation/menu-confirmation.module';
import { XPDOperationDataModule } from '../xpd.operation-data/operation-data.module';
import { XPDAdminNavBarDirective } from './admin-nav-bar.directive';

const XPDAdminNavBarModule: angular.IModule  = angular.module('xpd.admin-nav-bar', [
	'ngRoute',
	XPDMenuConfirmationModule.name,
	XPDDialogModule.name,
	XPDOperationDataModule.name,

]);
export { XPDAdminNavBarModule };

XPDAdminNavBarModule.directive('xpdAdminNavBar', XPDAdminNavBarDirective.Factory());
