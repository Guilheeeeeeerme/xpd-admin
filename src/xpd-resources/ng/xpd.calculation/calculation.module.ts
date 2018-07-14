import * as angular from 'angular';
import { VCruisingCalculatorService } from './calculation.service';

const XPDCalculationModule: angular.IModule = angular.module('xpd.calculation', []);
export { XPDCalculationModule };

XPDCalculationModule.service('vCruisingCalculator', VCruisingCalculatorService);
