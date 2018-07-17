import * as angular from 'angular';

import { XPDSharedModule } from '../shared/shared.module';
import { BitDepthTimeController } from './components/bit-depth-time.controller';
import { DepthController } from './components/depth.controller';
import { FailuresNptController } from './components/failures-npt.controller';
import { HistogramReportController } from './components/histogram-report.controller';
import { LessonsLearnedController } from './components/lessons-learned.controller';
import { NeedleReportController } from './components/needle-report.controller';
import { ReportsController } from './components/reports.controller';
import { SlipsToSlipsController } from './components/slips-to-slips.controller';
import { VREReportController } from './components/vre-report.controller';
import { VREScoreController } from './components/vre-score.controller';
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

const XPDReportsModule: angular.IModule = angular.module('xpd.reports', [
	XPDSharedModule.name,
]);

export { XPDReportsModule };

XPDReportsModule.config(ReportConfig);

XPDReportsModule.controller('ReportsController', ReportsController);
XPDReportsModule.controller('BitDepthTimeController', BitDepthTimeController);
XPDReportsModule.controller('depthController', DepthController);
XPDReportsModule.controller('FailuresNptController', FailuresNptController);
XPDReportsModule.controller('HistogramReportController', HistogramReportController);
XPDReportsModule.controller('LessonsLearnedController', LessonsLearnedController);
XPDReportsModule.controller('NeedleReportController', NeedleReportController);
XPDReportsModule.controller('SlipsToSlipsController', SlipsToSlipsController);
XPDReportsModule.controller('VREReportController', VREReportController);
XPDReportsModule.controller('VREScoreController', VREScoreController);

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
