import * as angular from 'angular';
import XPDDialogModule from '../../../../xpd-resources/ng/xpd.dialog/xpd.dialog.module';
import { BitDepthTimeController } from './controllers/bit-depth-time.controller';
import { DepthController } from './controllers/depth.controller';
import { FailuresNptController } from './controllers/failures-npt.controller';
import { HistogramReportController } from './controllers/histogram-report.controller';
import { LessonsLearnedController } from './controllers/lessons-learned.controller';
import { NeedleReportController } from './controllers/needle-report.controller';
import { SlipsToSlipsController } from './controllers/slips-to-slips.controller';
import { VreReportController } from './controllers/vre-report.controller';
import { VreScoreController } from './controllers/vre-score.controller';
import { BitDepthTimeDirective } from './directives/bit-depth-time.directive';
import { ReportConfig } from './reports.config';
import { ReportsController } from './reports.controller';

const XPDReportsModule: angular.IModule = angular.module('xpd.reports', [
	'ngRoute',
	XPDDialogModule.name,
	'xpd.setupapi',
	'xpd.filters',
	'xpd.timers',
	'd3',
	'highcharts',
	'xpd.communication',
	'xpd.modal.laydown-confirmation',
	'xpd.menu-confirmation',
	'xpd.admin-nav-bar',
	'angularTreeview',
	'xpd.modal-failure',
	'xpd.modal-lessonlearned',
	'xpd.failure-controller',
	'toastr',
	'ngAnimate',
]);

export default XPDReportsModule;

XPDReportsModule.config(ReportConfig);
XPDReportsModule.controller('reportsController', ReportsController);
XPDReportsModule.controller('bitDepthTimeController', BitDepthTimeController);
XPDReportsModule.controller('depthController', DepthController);
XPDReportsModule.controller('failuresNptController', FailuresNptController);
XPDReportsModule.controller('histogramReportController', HistogramReportController);
XPDReportsModule.controller('lessonsLearnedController', LessonsLearnedController);
XPDReportsModule.controller('needleReportController', NeedleReportController);
XPDReportsModule.controller('slipsToSlipsController', SlipsToSlipsController);
XPDReportsModule.controller('vreReportController', VreReportController);
XPDReportsModule.controller('vreScoreController', VreScoreController);
XPDReportsModule.directive('bitDepthTimeDirective', BitDepthTimeDirective.Factory());
