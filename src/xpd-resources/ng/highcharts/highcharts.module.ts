import * as angular from 'angular';
import { HighchartsService } from './highcharts.service';

const XPDHighchartsModule: angular.IModule  = angular.module('highcharts', []);
export default XPDHighchartsModule;

XPDHighchartsModule.factory('highchartsService', HighchartsService);
