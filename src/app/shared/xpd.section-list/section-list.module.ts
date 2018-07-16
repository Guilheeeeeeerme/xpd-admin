import * as angular from 'angular';
import { XPDSectionListDirective } from './section-list.directive';

const XPDSectionListModule: angular.IModule  = angular.module('xpd.section-list', []);

export { XPDSectionListModule };

XPDSectionListModule.directive('xpdSectionList', XPDSectionListDirective.Factory());
