import * as angular from 'angular';

import reportsTemplate from './reports.template.html';

import { XPDSharedModule } from '../shared/shared.module';
import { BitDepthTimeController } from './components/bit-depth-time.controller';
import { FailuresNptController } from './components/failures-npt.controller';
import { HistogramReportController } from './components/histogram-report.controller';
import { LessonsLearnedController } from './components/lessons-learned.controller';
import { NeedleReportController } from './components/needle-report.controller';
import { ReportsController } from './components/reports.controller';
import { VREReportController } from './components/vre-report.controller';
import { VREScoreController } from './components/vre-score.controller';
import { BitDepthTimeDirective } from './directives/bit-depth-time.directive';
import { DepthLineChartDirective } from './directives/depth-line-chart.directive';
import { EventDurationHistogram } from './directives/event-duration-histogram.directive';
import { ReportNeedleChart } from './directives/needle-report.directive';
import { ParetoChartDirective } from './directives/pareto-chart.directive';
import { PieChartDirective } from './directives/pie-chart.directive';
import { SlipsToSlipsBarChart } from './directives/slips-to-slips-bar-chart.directive';
import { TablePeriod } from './directives/table-period.directive';
import { VreBarChart } from './directives/vre-bar-chart.directive';
import { VreScoreBarChart } from './directives/vre-score-bar-chart.directive';
import { ReportConfig } from './reports.config';

const XPDReportsModule: angular.IModule = angular.module('xpd.reports', [
	XPDSharedModule.name,
]);

import './../../assets/css/reports.scss';
import './../../assets/css/xpd.scss';

export { XPDReportsModule };

XPDReportsModule.config(ReportConfig);

XPDReportsModule.controller('ReportsController', ReportsController);
XPDReportsModule.controller('BitDepthTimeController', BitDepthTimeController);
XPDReportsModule.controller('FailuresNptController', FailuresNptController);
XPDReportsModule.controller('HistogramReportController', HistogramReportController);
XPDReportsModule.controller('LessonsLearnedController', LessonsLearnedController);
XPDReportsModule.controller('NeedleReportController', NeedleReportController);
XPDReportsModule.controller('VREReportController', VREReportController);
XPDReportsModule.controller('VREScoreController', VREScoreController);

XPDReportsModule.directive('xpdBitDepthTime', BitDepthTimeDirective.Factory());
XPDReportsModule.directive('xpdDepthLineChart', DepthLineChartDirective.Factory());
XPDReportsModule.directive('xpdEventDurationHistogram', EventDurationHistogram.Factory());
XPDReportsModule.directive('xpdPieChart', PieChartDirective.Factory());
XPDReportsModule.directive('xpdParetoChart', ParetoChartDirective.Factory());
XPDReportsModule.directive('xpdReportNeedleChart', ReportNeedleChart.Factory());
XPDReportsModule.directive('xpdSlipsToSlipsBarChart', SlipsToSlipsBarChart.Factory());
XPDReportsModule.directive('xpdTablePeriod', TablePeriod.Factory());
XPDReportsModule.directive('xpdVreBarChart', VreBarChart.Factory());
XPDReportsModule.directive('xpdVreScoreBarChart', VreScoreBarChart.Factory());

XPDReportsModule.component('xpdReportsComponent', {
	template: reportsTemplate,
	controller: 'ReportsController as rController',
});
