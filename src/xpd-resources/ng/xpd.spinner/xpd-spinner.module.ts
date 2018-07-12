import * as angular from 'angular';
import 'angular-spinner';
import { SpinnerConfig } from './xpd-spinner.config';

const XPDSpinnerModule: angular.IModule = angular.module('xpd-spinner', ['angularSpinner']);
export default XPDSpinnerModule;

XPDSpinnerModule.config(SpinnerConfig);
