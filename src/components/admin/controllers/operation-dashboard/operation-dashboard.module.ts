import * as angular from 'angular';
import { OperationDashboardController } from './operation-dashboard.controller';
import XPDVisualizationModule from '../../../../xpd-resources/ng/xpd.visualization/xpd-visualization.module';

const XPDOperationDashboardModule: angular.IModule = angular.module('xpd.operation-dashboard', [
	XPDVisualizationModule.name,
]);

export default XPDOperationDashboardModule;
XPDOperationDashboardModule.controller('OperationDashboardController', OperationDashboardController);
