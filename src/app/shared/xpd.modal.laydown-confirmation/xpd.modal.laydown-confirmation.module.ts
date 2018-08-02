import * as angular from 'angular';
import { LayDownConfirmationDirective } from './xpd.modal.laydown-confirmation.directive';

const XPDLayDownConfirmationModule: angular.IModule = angular.module('xpd.modal.laydown-confirmation', []);
export  { XPDLayDownConfirmationModule };

XPDLayDownConfirmationModule.directive('xpdLaydownConfirmation', LayDownConfirmationDirective.Factory());
