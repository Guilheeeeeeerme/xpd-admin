import * as angular from 'angular';
import 'angular-route';
import { AdminTrackingController } from '../../components/admin/controllers/admin-tracking.controller';
import { AlarmModalUpsertController } from '../../components/admin/controllers/alarm/alarm-modal-upsert.controller';
import { AlarmController } from '../../components/admin/controllers/alarm/alarm.controller';
import { AlarmCRUDService } from '../../components/admin/controllers/alarm/alarm.service';
import { DataAcquisitionController } from '../../components/admin/controllers/data-acquisition.controller';
import { FailureDelayCategoryController } from '../../components/admin/controllers/failure-delay-category.controller';
import { LessonLearnedCategoryController } from '../../components/admin/controllers/lesson-learned-category.controller';
import { MemberSchedulerController } from '../../components/admin/controllers/member-scheduler/member-scheduler.controller';
import { MemberSchedulerDirective } from '../../components/admin/controllers/member-scheduler/member-scheduler.directive';
import { SchedulerActionsService } from '../../components/admin/controllers/member-scheduler/scheduler-actions.service';
import { UpsertFunctionController } from '../../components/admin/controllers/member-scheduler/upsert-function.controller';
import { UpsertMemberController } from '../../components/admin/controllers/member-scheduler/upsert-member.controller';
import { UpsertScheduleController } from '../../components/admin/controllers/member-scheduler/upsert-schedule.controller';
import { MenuController } from '../../components/admin/controllers/menu.controller';
import XPDOperationDashboardModule from '../../components/admin/controllers/operation-dashboard/operation-dashboard.module';
import { AlarmInfoController } from '../../components/admin/controllers/operation/alarm-info.controller';
import { OperationConfigurationService } from '../../components/admin/controllers/operation/operation-configuration.service';
import { OperationCopyOptionsModalController } from '../../components/admin/controllers/operation/operation-copy-options-modal.controller';
import { OperationController } from '../../components/admin/controllers/operation/operation.controller';
import { PlannerController } from '../../components/admin/controllers/planner.controller';
import { SectionUpsertController } from '../../components/admin/controllers/section/section-upsert.controller';
import { SectionController } from '../../components/admin/controllers/section/section.controller';
import { RPDController } from '../../components/admin/controllers/shift-report.controller';
import { TeamController } from '../../components/admin/controllers/team.controller';
import { TrackingUpdateTimesController } from '../../components/admin/controllers/tracking-update-times-modal.controller';
import { WellUpsertController } from '../../components/admin/controllers/well/well-upsert.controller';
import { WellController } from '../../components/admin/controllers/well/well.controller';
import { SavedAlarmsListDirectives } from '../../components/admin/directives/saved-alarms-list.directive';
import { VREListTableDirective } from '../../components/admin/directives/vre-list-table.directive';
import AngularTreeviewModule from '../../xpd-resources/ng/angular.treeview/angular-treeview.module';
import XPDGanttModule from '../../xpd-resources/ng/gantt/gantt.module';
import XPDHighchartsModule from '../../xpd-resources/ng/highcharts/highcharts.module';
import XPDAdminNavBarModule from '../../xpd-resources/ng/xpd.admin-nav-bar/admin-nav-bar.module';
import XPDCalculationModule from '../../xpd-resources/ng/xpd.calculation/calculation.module';
import XPDContractParamModule from '../../xpd-resources/ng/xpd.contract-param/contract-param.module';
import XPDContractTimeInputModule from '../../xpd-resources/ng/xpd.contract-time-input/contract-time-input.module';
import XPDDMECModule from '../../xpd-resources/ng/xpd.dmec/dmec.module';
import XPDFilterModule from '../../xpd-resources/ng/xpd.filters/xpd-filter.module';
import XPDFormValidationModule from '../../xpd-resources/ng/xpd.form.validation/xpd.form.validation.module';
import XPDMenuConfirmationModule from '../../xpd-resources/ng/xpd.menu-confirmation/menu-confirmation.module';
import XPDEventDetailsModule from '../../xpd-resources/ng/xpd.modal.event-details/xpd-modal-event-details.module';
import XPDFailureModule from '../../xpd-resources/ng/xpd.modal.failure/xpd-modal-failure.module';
import XPDLayDownConfirmationModule from '../../xpd-resources/ng/xpd.modal.laydown-confirmation/xpd.modal.laydown-confirmation.module';
import XPDLessonLearnedModule from '../../xpd-resources/ng/xpd.modal.lessonlearned/xpd-modal-lessonlearned.module';
import XPDPlannerModule from '../../xpd-resources/ng/xpd.planner/planner.module';
import XPDRegisterAlarmModule from '../../xpd-resources/ng/xpd.register-alarm-modal/register-alarm-modal.module';
import { XPDRPDFormDirective } from '../../xpd-resources/ng/xpd.rpd/rpd.directive';
import { XPDSectionListDirective } from '../../xpd-resources/ng/xpd.section-list/section-list.directive';
import XPDSetupFormInputModule from '../../xpd-resources/ng/xpd.setup-form-input/setup-form-input.module';
import XPDSetupAPIModule from '../../xpd-resources/ng/xpd.setupapi/setupapi.module';
import XPDSwitchModule from '../../xpd-resources/ng/xpd.switch/xpd.switch.module';
import XPDTimeSliceModule from '../../xpd-resources/ng/xpd.time-slices-table/time-slices-table.module';
import XPDTimersModule from '../../xpd-resources/ng/xpd.timers/xpd-timers.module';
import XPDTrackingModule from '../../xpd-resources/ng/xpd.tracking/tracking.module';
import XPDZeroTimeZoneModule from '../../xpd-resources/ng/xpd.zerotimezone/xpd.zerotimezone.module';
import { ReportsController } from '../reports/reports.controller';
import { AdminConfig } from './admin.config';
import { AdminRunScope } from './admin.run';

const XPDAdminModule: angular.IModule = angular.module('xpd.admin', [
	'ngRoute',
	XPDSetupAPIModule.name,
	XPDOperationDashboardModule.name,
	XPDTrackingModule.name,
	XPDDMECModule.name,
	XPDZeroTimeZoneModule.name,
	XPDFormValidationModule.name,
	XPDGanttModule.name,
	XPDCalculationModule.name,
	XPDContractParamModule.name,
	XPDFilterModule.name,
	XPDTimersModule.name,
	XPDContractTimeInputModule.name,
	AngularTreeviewModule.name,
	XPDEventDetailsModule.name,
	XPDFailureModule.name,
	XPDLessonLearnedModule.name,
	XPDHighchartsModule.name,
	XPDLayDownConfirmationModule.name,
	XPDMenuConfirmationModule.name,
	XPDAdminNavBarModule.name,
	XPDFailureModule.name,
	XPDPlannerModule.name,
	XPDSwitchModule.name,
	XPDSetupFormInputModule.name,
	XPDRegisterAlarmModule.name,
	XPDTimeSliceModule.name,
]);

export default XPDAdminModule;

XPDAdminModule.directive('xpdSectionList', XPDSectionListDirective.Factory());
XPDAdminModule.directive('rpdForm', XPDRPDFormDirective.Factory());
XPDAdminModule.controller('AlarmModalUpsertController', AlarmModalUpsertController);
XPDAdminModule.controller('AlarmController', AlarmController);
XPDAdminModule.service('alarmCRUDService', AlarmCRUDService);
XPDAdminModule.controller('MemberSchedulerController', MemberSchedulerController);
XPDAdminModule.directive('memberScheduler', MemberSchedulerDirective.Factory());
XPDAdminModule.service('schedulerActionsService', SchedulerActionsService);
XPDAdminModule.controller('UpsertFunctionController', UpsertFunctionController);
XPDAdminModule.controller('UpsertMemberController', UpsertMemberController);
XPDAdminModule.controller('UpsertScheduleController', UpsertScheduleController);
XPDAdminModule.controller('AlarmInfoController', AlarmInfoController);
XPDAdminModule.run(AdminRunScope);
XPDAdminModule.config(AdminConfig);
XPDAdminModule.service('OperationConfigurationService', OperationConfigurationService);
XPDAdminModule.controller('OperationCopyOptionsModalController', OperationCopyOptionsModalController);
XPDAdminModule.controller('OperationController', OperationController);
XPDAdminModule.controller('SectionUpsertController', SectionUpsertController);
XPDAdminModule.controller('SectionController', SectionController);
XPDAdminModule.controller('WellUpsertController', WellUpsertController);
XPDAdminModule.controller('WellController', WellController);
XPDAdminModule.controller('AdminTrackingController', AdminTrackingController);
XPDAdminModule.controller('DataAcquisitionController', DataAcquisitionController);
XPDAdminModule.controller('FailureDelayCategoryController', FailureDelayCategoryController);
XPDAdminModule.controller('LessonLearnedCategoryController', LessonLearnedCategoryController);
XPDAdminModule.controller('MenuController', MenuController);
XPDAdminModule.controller('PlannerController', PlannerController);
XPDAdminModule.controller('ReportsController', ReportsController);
XPDAdminModule.controller('RpdController', RPDController);
XPDAdminModule.controller('TeamController', TeamController);
XPDAdminModule.controller('TrackingUpdateTimesController', TrackingUpdateTimesController);
XPDAdminModule.directive('savedAlarmsList', SavedAlarmsListDirectives.Factory());
XPDAdminModule.directive('vreListTable', VREListTableDirective.Factory());
