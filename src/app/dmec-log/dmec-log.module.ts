import * as angular from 'angular';
import 'angular-ui-bootstrap';

import { XPDHighchartsModule } from '../../xpd-resources/ng/highcharts/highcharts.module';
import { XPDCalculationModule } from '../../xpd-resources/ng/xpd.calculation/calculation.module';
import { XPDDMECModule } from '../../xpd-resources/ng/xpd.dmec/dmec.module';
import { XPDFiltersModule } from '../../xpd-resources/ng/xpd.filters/xpd-filter.module';
import { XPDOperationDataModule } from '../../xpd-resources/ng/xpd.operation-data/operation-data.module';
import { XPDSetupAPIModule } from '../../xpd-resources/ng/xpd.setupapi/setupapi.module';
import { XPDTimersModule } from '../../xpd-resources/ng/xpd.timers/xpd-timers.module';
import { XPDVisualizationModule } from '../../xpd-resources/ng/xpd.visualization/xpd-visualization.module';
import { DMECLogController } from './components/dmec-log/dmec-log.controller';

const XPDDMECLogModule: angular.IModule  = angular.module('xpd.dmeclog', [
	'ui.bootstrap',
	XPDSetupAPIModule.name,
	XPDDMECModule.name,
	XPDFiltersModule.name,
	XPDTimersModule.name,
	XPDHighchartsModule.name,
	XPDVisualizationModule.name,
	XPDCalculationModule.name,
	XPDOperationDataModule.name]);

export { XPDDMECLogModule };

XPDDMECLogModule.config(DMECLogController);
XPDDMECLogModule.controller('DMecLogController', DMECLogController);
