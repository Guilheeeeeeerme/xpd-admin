import * as angular from 'angular';
import { UpcomingAlarmsDirective } from './upcoming-alarms.directive';

const XPDUpcomingAlarm: angular.IModule = angular.module('xpd.upcoming-alarms', []);
export default XPDUpcomingAlarm;

XPDUpcomingAlarm.directive('upcomingAlarms', UpcomingAlarmsDirective.Factory());
