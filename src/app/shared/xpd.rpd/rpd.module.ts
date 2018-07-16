import * as angular from 'angular';
import { XPDRPDFormDirective } from './rpd.directive';

const XPDRPDModule: angular.IModule  = angular.module('xpd.rpd-form', []);

export { XPDRPDModule };

XPDRPDModule.directive('xpdRpdForm', XPDRPDFormDirective.Factory());
