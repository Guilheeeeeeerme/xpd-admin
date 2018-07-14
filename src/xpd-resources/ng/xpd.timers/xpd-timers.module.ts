import * as angular from 'angular';
import { XPDIntervalService, XPDTimeoutService } from './xpd-timers.service';

const XPDTimersModule: angular.IModule = angular.module('xpd.timers', []);
export  { XPDTimersModule };

XPDTimersModule.service('$xpdInterval', XPDIntervalService);
XPDTimersModule.service('$xpdTimeout', XPDTimeoutService);
