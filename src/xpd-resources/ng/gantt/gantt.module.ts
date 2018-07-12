import * as angular from 'angular';
import { GanttService } from './gantt.service';

const XPDGanttModule: angular.IModule  = angular.module('gantt', []);
export default XPDGanttModule;

XPDGanttModule.service('ganttService', GanttService);
