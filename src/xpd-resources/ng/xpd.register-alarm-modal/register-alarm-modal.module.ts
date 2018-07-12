import * as angular from 'angular';
import { RegisterAlarmModalDirective } from './register-alarm-modal.directive';

const XPDRegisterAlarmModule: angular.IModule = angular.module('xpd.register-alarm-form', []);
export default XPDRegisterAlarmModule;

XPDRegisterAlarmModule.directive('registerAlarmModal', RegisterAlarmModalDirective.Factory());