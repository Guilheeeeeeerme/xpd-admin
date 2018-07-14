import * as angular from 'angular';
import 'angular-animate';
import 'angular-toastr';

import AngularTreeviewModule from '../../xpd-resources/ng/angular.treeview/angular-treeview.module';
import XPDHighchartsModule from '../../xpd-resources/ng/highcharts/highcharts.module';
import XPDAdminNavBarModule from '../../xpd-resources/ng/xpd.admin-nav-bar/admin-nav-bar.module';
import XPDCommunicationModule from '../../xpd-resources/ng/xpd.communication/communication.module';
import XPDDialogModule from '../../xpd-resources/ng/xpd.dialog/xpd.dialog.module';
import XPDFailureNavBarController from '../../xpd-resources/ng/xpd.failure-controller/failure-nv-bar.module';
import XPDFiltersModule from '../../xpd-resources/ng/xpd.filters/xpd-filter.module';
import XPDMenuConfirmationModule from '../../xpd-resources/ng/xpd.menu-confirmation/menu-confirmation.module';
import XPDFailureModule from '../../xpd-resources/ng/xpd.modal.failure/xpd-modal-failure.module';
import XPDLayDownConfirmationModule from '../../xpd-resources/ng/xpd.modal.laydown-confirmation/xpd.modal.laydown-confirmation.module';
import XPDLessonLearnedModule from '../../xpd-resources/ng/xpd.modal.lessonlearned/xpd-modal-lessonlearned.module';
import XPDSetupAPIModule from '../../xpd-resources/ng/xpd.setupapi/setupapi.module';
import XPDTimersModule from '../../xpd-resources/ng/xpd.timers/xpd-timers.module';
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
import { DepthLineChartDirective } from './directives/depth-line-chart.directive';
import { EventDurationHistogram } from './directives/event-duration-histogram.directive';
import { FailuresNptChartDirective } from './directives/failures-npt-chart.directive';
import { FailuresParetoChart } from './directives/failures-pareto-chart.directive';
import { LessonsLearnedChart } from './directives/lessons-learned-chart.directive';
import { LessonsParetoChart } from './directives/lessons-pareto-chart.directive';
import { ReportNeedleChart } from './directives/needle-report.directive';
import { SlipsToSlipsBarChart } from './directives/slips-to-slips-bar-chart.directive';
import { TablePeriod } from './directives/table-period.directive';
import { VreBarChart } from './directives/vre-bar-chart.directive';
import { VreScoreBarChart } from './directives/vre-score-bar-chart.directive';
import { ReportConfig } from './reports.config';
import { ReportsController } from './reports.controller';

const XPDReportsModule: angular.IModule = angular.module('xpd.reports', [
	'ngRoute',
	XPDDialogModule.name,
	XPDSetupAPIModule.name,
	XPDFiltersModule.name,
	XPDTimersModule.name,
	XPDHighchartsModule.name,
	XPDCommunicationModule.name,
	XPDLayDownConfirmationModule.name,
	XPDMenuConfirmationModule.name,
	XPDAdminNavBarModule.name,
	AngularTreeviewModule.name,
	XPDFailureModule.name,
	XPDLessonLearnedModule.name,
	XPDFailureNavBarController.name,
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
XPDReportsModule.directive('depthLineChartDirective', DepthLineChartDirective.Factory());
XPDReportsModule.directive('eventDurationHistogram', EventDurationHistogram.Factory());
XPDReportsModule.directive('failuresNptChartDirective', FailuresNptChartDirective.Factory());
XPDReportsModule.directive('failuresParetoChart', FailuresParetoChart.Factory());
XPDReportsModule.directive('lessonsLearnedChart', LessonsLearnedChart.Factory());
XPDReportsModule.directive('lessonsParetoChart', LessonsParetoChart.Factory());
XPDReportsModule.directive('reportNeedleChart', ReportNeedleChart.Factory());
XPDReportsModule.directive('slipsToSlipsBarChart', SlipsToSlipsBarChart.Factory());
XPDReportsModule.directive('tablePeriod', TablePeriod.Factory());
XPDReportsModule.directive('vreBarChart', VreBarChart.Factory());
XPDReportsModule.directive('vreScoreBarChart', VreScoreBarChart.Factory());
