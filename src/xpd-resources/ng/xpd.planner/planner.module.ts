import * as angular from 'angular';
import { XPDConnectionPlannerDirective } from './connection-planner.directive';
import { XPDTripPlannerDirective } from './trip-planner.directive';

const XPDPlannerModule: angular.IModule = angular.module('xpd.planner', []);
export  { XPDPlannerModule };

XPDPlannerModule.directive('xpdConnectionPlanner', XPDConnectionPlannerDirective.Factory());
XPDPlannerModule.directive('xpdTripPlanner', XPDTripPlannerDirective.Factory());
