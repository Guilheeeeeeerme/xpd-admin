import * as angular from 'angular';
import { SpinnerConfig } from './xpd-spinner.config';

const XPDSpinnerModule: angular.IModule = angular.module('xpd-spinner', []);
export  { XPDSpinnerModule };

XPDSpinnerModule.config(SpinnerConfig);
