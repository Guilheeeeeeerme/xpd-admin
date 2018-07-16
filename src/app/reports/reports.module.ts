import * as angular from 'angular';

import { XPDSharedModule } from '../shared/shared.module';
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
	XPDSharedModule.name,
]);

export { XPDReportsModule };

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

XPDReportsModule.directive('xpdBitDepthTime', BitDepthTimeDirective.Factory());
XPDReportsModule.directive('xpdDepthLineChart', DepthLineChartDirective.Factory());
XPDReportsModule.directive('xpdEventDurationHistogram', EventDurationHistogram.Factory());
XPDReportsModule.directive('xpdFailuresNptChart', FailuresNptChartDirective.Factory());
XPDReportsModule.directive('xpdFailuresParetoChart', FailuresParetoChart.Factory());
XPDReportsModule.directive('xpdLessonsLearnedChart', LessonsLearnedChart.Factory());
XPDReportsModule.directive('xpdLessonsParetoChart', LessonsParetoChart.Factory());
XPDReportsModule.directive('xpdReportNeedleChart', ReportNeedleChart.Factory());
XPDReportsModule.directive('xpdSlipsToSlipsBarChart', SlipsToSlipsBarChart.Factory());
XPDReportsModule.directive('xpdTablePeriod', TablePeriod.Factory());
XPDReportsModule.directive('xpdVreBarChart', VreBarChart.Factory());
XPDReportsModule.directive('xpdVreScoreBarChart', VreScoreBarChart.Factory());
