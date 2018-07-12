import * as angular from 'angular';
import { XPDSetupFormInputDirective } from './setup-form-input.directive';

const XPDSetupFormInputModule: angular.IModule = angular.module('xpd.setup-form-input', []);
export default XPDSetupFormInputModule;

XPDSetupFormInputModule.directive('xpdSetupFormInput', XPDSetupFormInputDirective.Factory());
