/*
* @Author: Gezzy Ramos
* @Date:   2017-05-15 17:01:59
* @Last Modified by:   Gezzy Ramos
* @Last Modified time: 2017-05-15 17:17:24
*/

// 	angular.module('xpd.menu-confirmation')
// 		.factory('menuConfirmationFactory', menuConfirmationFactory);

import * as angular from 'angular';
import { MenuConfirmationFactory } from './menu-confirmation.factory';

const XPDMenuConfirmationModule: angular.IModule = angular.module('xpd.menu-confirmation', []);
export default XPDMenuConfirmationModule;

XPDMenuConfirmationModule.factory('menuConfirmationFactory', MenuConfirmationFactory);
