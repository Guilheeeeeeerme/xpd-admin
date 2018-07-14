import * as angular from 'angular';
import { GanttService } from './gantt.service';

const XPDGanttModule: angular.IModule  = angular.module('gantt', []);

export { XPDGanttModule };

XPDGanttModule.service('ganttService', GanttService);
