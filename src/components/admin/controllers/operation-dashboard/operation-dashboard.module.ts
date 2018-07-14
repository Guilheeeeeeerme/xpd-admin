import * as angular from 'angular';
import XPDVisualizationModule from '../../../../xpd-resources/ng/xpd.visualization/xpd-visualization.module';
import { OperationDashboardController } from './operation-dashboard.controller';

const XPDOperationDashboardModule: angular.IModule = angular.module('xpd.operation-dashboard', [
	XPDVisualizationModule.name,
]);

export default XPDOperationDashboardModule;
XPDOperationDashboardModule.controller('OperationDashboardController', OperationDashboardController);
