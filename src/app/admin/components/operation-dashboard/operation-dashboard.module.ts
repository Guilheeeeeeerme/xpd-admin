import * as angular from 'angular';
import { OperationActivitiesEstimatorService } from './operation-activities-estimator/operation-activities-estimator.service';
import { XPDOperationQueueForecastDirective } from './operation-queue-forecast/operation-queue-forecast.directive';

const XPDOperationDashboardModule: angular.IModule = angular.module('xpd.operation-dashboard', []);

XPDOperationDashboardModule.directive('xpdOperationQueueForecast', XPDOperationQueueForecastDirective.Factory());
XPDOperationDashboardModule.service('operationActivitiesEstimatorService', OperationActivitiesEstimatorService);

export { XPDOperationDashboardModule };
