import * as angular from 'angular';
import { XPDZeroTimeZoneDirective } from './xpd.zerotimezone.directive';

const XPDZeroTimeZoneModule: angular.IModule = angular.module('xpd.zerotimezone', []);
export  { XPDZeroTimeZoneModule };

XPDZeroTimeZoneModule.directive('xpdZeroTimeZone', XPDZeroTimeZoneDirective.Factory());
