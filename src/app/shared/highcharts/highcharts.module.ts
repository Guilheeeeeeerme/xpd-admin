import * as angular from 'angular';
import { HighchartsService } from './highcharts.service';

const XPDHighchartsModule: angular.IModule  = angular.module('highcharts', []);

export { XPDHighchartsModule };

XPDHighchartsModule.service('highchartsService', HighchartsService);
