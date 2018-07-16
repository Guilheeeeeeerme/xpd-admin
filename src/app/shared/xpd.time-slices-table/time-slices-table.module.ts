// (function() {
// 	'use strict';

// 	angular.module('xpd.time-slices-table', []);
// })();

import * as angular from 'angular';
import { TimeSlicesTableDirective } from './time-slices-table.directive';

const XPDTimeSliceModule: angular.IModule = angular.module('xpd.time-slices-table', []);
export  { XPDTimeSliceModule };

XPDTimeSliceModule.directive('timeSlicesTable', TimeSlicesTableDirective.Factory());
