import * as angular from 'angular';
import { MenuConfirmationService } from './menu-confirmation.factory';

const XPDMenuConfirmationModule: angular.IModule = angular.module('xpd.menu-confirmation', []);
export { XPDMenuConfirmationModule };

XPDMenuConfirmationModule.service('menuConfirmationService', MenuConfirmationService);
