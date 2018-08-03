import * as angular from 'angular';
import { ConnectionStatusConfig } from './connection-status.config';
import { ConnectionStatusDirective } from './connection-status.directive';

const XPDConnectionStatusModule: angular.IModule = angular.module('xpd-connection-status', []);
export  { XPDConnectionStatusModule };

XPDConnectionStatusModule.config(ConnectionStatusConfig);
XPDConnectionStatusModule.directive('xpdConnectionStatus', ConnectionStatusDirective.Factory());
