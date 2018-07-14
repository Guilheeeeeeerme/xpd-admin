
import * as angular from 'angular';

// import * as uiBootstrap from 'angular-ui-bootstrap';
import { XPDCalculationModule } from '../xpd.calculation/calculation.module';
import { ngIntersection } from '../xpd.intersection/xpd-intersection.module';
import { ConnRulerDirective } from './conn-ruler.directive';
import { ConsistencyInformationPanelDirective } from './consistency-information-panel.directive';
import { D3DMECChartModalController } from './d3-dmec-chart-modal.controller';
import { D3DMECChartDirective } from './d3-dmec-chart.directive';
import { DisplacementAreaFactory } from './displacement-area.directive';
import { DMECTrackingEventsDirective } from './dmec-tracking-events.directive';
import { DMECTrackingDirective } from './dmec-tracking.directive';
import { ForecastLineDirective } from './forecast-line.directive';
import { ForecastWaterfallDirective } from './forecast-waterfall.directive';
import { InSlipsDirective } from './in-slips.directive';
import { MemberPerformanceDirective } from './member-performance.directive';
import { NextActivitiesInformationPanelDirective } from './next-activities-information-panel.directive';
import { OldTrackingDirective } from './old-tracking.directive';
import { OperationInformationPanelDirective } from './operation-information-panel.directive';
import { OperationProgressChartDirective } from './operation-progress-chart.directive';
import { OperationProgressPanelDirective } from './operation-progress-panel.directive';
import { PerformanceParameterBarDirective } from './performance-parameter-bar.directive';
import { PerformanceProgressBarDirective } from './performance-progress-bar.directive';
import { ScoreGaugeDirective } from './score-gauge.directive';
import { SpeedGaugeDirective } from './speed-gauge.directive';
import { TimeZoomToolDirective } from './time-zoom-tool.directive';
import { EventTimesDirective } from './times.directive';
import { TripRulerDirective } from './trip-ruler.directive';
import { UpcomingAlarmsPanelDirective } from './upcoming-alarms-panel.directive';
import { WellInformationPanelDirective } from './well-information-panel.directive';
import { XPDViewBoxDirective } from './xpd-view-box.directive';

const XPDVisualizationModule: angular.IModule = angular.module('xpd.visualization', [
	ngIntersection.name,
	XPDCalculationModule.name,
]);

export  { XPDVisualizationModule }

XPDVisualizationModule.directive('tripRuler', TripRulerDirective.Factory());
XPDVisualizationModule.directive('upcomingAlarmsPanel', UpcomingAlarmsPanelDirective.Factory());
XPDVisualizationModule.directive('wellInformationPanel', WellInformationPanelDirective.Factory());
XPDVisualizationModule.directive('xpdViewBox', XPDViewBoxDirective.Factory());
XPDVisualizationModule.directive('times', EventTimesDirective.Factory());
XPDVisualizationModule.directive('timeZoomTool', TimeZoomToolDirective.Factory());
XPDVisualizationModule.directive('speedGauge', SpeedGaugeDirective.Factory());
XPDVisualizationModule.directive('scoreGauge', ScoreGaugeDirective.Factory());
XPDVisualizationModule.directive('performanceProgressBar', PerformanceProgressBarDirective.Factory());
XPDVisualizationModule.directive('performanceParameterBar', PerformanceParameterBarDirective.Factory());
XPDVisualizationModule.directive('operationProgressPanel', OperationProgressPanelDirective.Factory());
XPDVisualizationModule.directive('operationProgressChart', OperationProgressChartDirective.Factory());
XPDVisualizationModule.directive('operationInformationPanel', OperationInformationPanelDirective.Factory());
XPDVisualizationModule.directive('oldTracking', OldTrackingDirective.Factory());
XPDVisualizationModule.directive('nextActivitiesInformationPanel', NextActivitiesInformationPanelDirective.Factory());
XPDVisualizationModule.directive('memberPerformance', MemberPerformanceDirective.Factory());
XPDVisualizationModule.directive('inSlips', InSlipsDirective.Factory());
XPDVisualizationModule.directive('forecastLine', ForecastLineDirective.Factory());
XPDVisualizationModule.directive('dmecTracking', DMECTrackingDirective.Factory());
XPDVisualizationModule.directive('dmecTrackingEvents', DMECTrackingEventsDirective.Factory());
XPDVisualizationModule.directive('displacementArea', DisplacementAreaFactory.Factory());
XPDVisualizationModule.directive('d3DmecChart', D3DMECChartDirective.Factory());
XPDVisualizationModule.controller('D3DMECChartModalController', D3DMECChartModalController);
XPDVisualizationModule.directive('consistencyInformationPanel', ConsistencyInformationPanelDirective.Factory());
XPDVisualizationModule.directive('connRuler', ConnRulerDirective.Factory());
XPDVisualizationModule.directive('forecastWaterfall', ForecastWaterfallDirective.Factory());
