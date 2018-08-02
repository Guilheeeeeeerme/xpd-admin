import * as angular from 'angular';
import { XPDFormValidationDirective } from './xpd.form.validation.directive';

const XPDFormValidationModule: angular.IModule = angular.module('xpd.form.validation', []);
export { XPDFormValidationModule };

XPDFormValidationModule.directive('xpdFormValidation', XPDFormValidationDirective.Factory());
