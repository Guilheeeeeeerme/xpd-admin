
import * as angular from 'angular';
import 'angular-animate';
import 'angular-route';
import 'angular-spinner';
import 'angular-toastr';
import 'angular-ui-bootstrap';
import { AngularTreeviewModule } from './angular.treeview/angular-treeview.module';
import { XPDGanttModule } from './gantt/gantt.module';
import { XPDHighchartsModule } from './highcharts/highcharts.module';
import { XPDAccessModule } from './xpd.access/accessfactory.module';
import { XPDAdminNavBarModule } from './xpd.admin-nav-bar/admin-nav-bar.module';
import { XPDCalculationModule } from './xpd.calculation/calculation.module';
import { XPDContractParamModule } from './xpd.contract-param/contract-param.module';
import { XPDContractTimeInputModule } from './xpd.contract-time-input/contract-time-input.module';
import { XPDDialogModule } from './xpd.dialog/xpd.dialog.module';
import { XPDDMECModule } from './xpd.dmec/dmec.module';
import { XPDFailureNavBarController } from './xpd.failure-controller/failure-nv-bar.module';
import { XPDFiltersModule } from './xpd.filters/xpd-filter.module';
import { XPDFormValidationModule } from './xpd.form.validation/xpd.form.validation.module';
import { ngIntersection } from './xpd.intersection/xpd-intersection.module';
import { XPDMenuConfirmationModule } from './xpd.menu-confirmation/menu-confirmation.module';
import { XPDEventDetailsModule } from './xpd.modal.event-details/xpd-modal-event-details.module';
import { XPDFailureModule } from './xpd.modal.failure/xpd-modal-failure.module';
import { XPDLayDownConfirmationModule } from './xpd.modal.laydown-confirmation/xpd.modal.laydown-confirmation.module';
import { XPDLessonLearnedModule } from './xpd.modal.lessonlearned/xpd-modal-lessonlearned.module';
import { XPDOperationDataModule } from './xpd.operation-data/operation-data.module';
import { XPDOperationManagerModule } from './xpd.operationmanager/operationmanager.module';
import { XPDPlannerModule } from './xpd.planner/planner.module';
import { XPDRegisterAlarmModule } from './xpd.register-alarm-modal/register-alarm-modal.module';
import { XPDScoredEventModule } from './xpd.scoredevent/scoredevent.module';
import { XPDSectionListModule } from './xpd.section-list/section-list.module';
import { XPDSetupFormInputModule } from './xpd.setup-form-input/setup-form-input.module';
import { XPDSetupAPIModule } from './xpd.setupapi/setupapi.module';
import { XPDSpinnerModule } from './xpd.spinner/xpd-spinner.module';
import { XPDSwitchModule } from './xpd.switch/xpd.switch.module';
import { XPDTimeSliceModule } from './xpd.time-slices-table/time-slices-table.module';
import { XPDTimersModule } from './xpd.timers/xpd-timers.module';
import { XPDUpcomingAlarm } from './xpd.upcoming-alarms/upcoming-alarms.module';
import { XPDVisualizationModule } from './xpd.visualization/xpd-visualization.module';
import { XPDZeroTimeZoneModule } from './xpd.zerotimezone/xpd.zerotimezone.module';

const XPDSharedModule: angular.IModule = angular.module('xpd.shared', [
	'ngRoute',
	'ui.bootstrap',
	'toastr',
	'ngAnimate',
	'angularSpinner',
	XPDDialogModule.name,
	XPDAccessModule.name,
	XPDCalculationModule.name,
	XPDContractParamModule.name,
	XPDContractTimeInputModule.name,
	XPDFiltersModule.name,
	ngIntersection.name,
	XPDMenuConfirmationModule.name,
	AngularTreeviewModule.name,
	XPDGanttModule.name,
	XPDHighchartsModule.name,
	XPDOperationDataModule.name,
	XPDAdminNavBarModule.name,
	XPDFormValidationModule.name,
	XPDEventDetailsModule.name,
	XPDSpinnerModule.name,
	XPDTimersModule.name,
	XPDDMECModule.name,
	XPDSetupAPIModule.name,
	XPDFailureNavBarController.name,
	XPDFailureModule.name,
	XPDLayDownConfirmationModule.name,
	XPDLessonLearnedModule.name,
	XPDOperationManagerModule.name,
	XPDPlannerModule.name,
	XPDRegisterAlarmModule.name,
	XPDScoredEventModule.name,
	XPDSetupFormInputModule.name,
	XPDSwitchModule.name,
	XPDTimeSliceModule.name,
	XPDUpcomingAlarm.name,
	XPDVisualizationModule.name,
	XPDZeroTimeZoneModule.name,
	XPDSectionListModule.name,
]);

export { XPDSharedModule };
