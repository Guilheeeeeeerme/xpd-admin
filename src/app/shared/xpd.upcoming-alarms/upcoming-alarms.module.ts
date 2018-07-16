import * as angular from 'angular';
import { UpcomingAlarmsDirective } from './upcoming-alarms.directive';

const XPDUpcomingAlarm: angular.IModule = angular.module('xpd.upcoming-alarms', []);
export  { XPDUpcomingAlarm };

XPDUpcomingAlarm.directive('xpdUpcomingAlarms', UpcomingAlarmsDirective.Factory());
