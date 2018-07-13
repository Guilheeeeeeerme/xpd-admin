import * as angular from 'angular';
import 'angular-route';
import AngularTreeviewModule from '../../../../xpd-resources/ng/angular.treeview/angular-treeview.module';
import XPDDMECModule from '../../../../xpd-resources/ng/xpd.dmec/dmec.module';
import XPDEventDetailsModule from '../../../../xpd-resources/ng/xpd.modal.event-details/xpd-modal-event-details.module';
import XPDFailureModule from '../../../../xpd-resources/ng/xpd.modal.failure/xpd-modal-failure.module';
import XPDLayDownConfirmationModule from '../../../../xpd-resources/ng/xpd.modal.laydown-confirmation/xpd.modal.laydown-confirmation.module';
import XPDLessonLearnedModule from '../../../../xpd-resources/ng/xpd.modal.lessonlearned/xpd-modal-lessonlearned.module';
import { XPDRPDFormDirective } from '../../../../xpd-resources/ng/xpd.rpd/rpd.directive';
import { XPDSectionListDirective } from '../../../../xpd-resources/ng/xpd.section-list/section-list.directive';
import XPDSetupFormInputModule from '../../../../xpd-resources/ng/xpd.setup-form-input/setup-form-input.module';
import XPDSwitchModule from '../../../../xpd-resources/ng/xpd.switch/xpd.switch.module';
import XPDTimeSliceModule from '../../../../xpd-resources/ng/xpd.time-slices-table/time-slices-table.module';
import XPDTimersModule from '../../../../xpd-resources/ng/xpd.timers/xpd-timers.module';
import XPDTrackingModule from '../../../../xpd-resources/ng/xpd.tracking/tracking.module';
import XPDZeroTimeZoneModule from '../../../../xpd-resources/ng/xpd.zerotimezone/xpd.zerotimezone.module';
import { AdminConfig } from './admin.config';
import { AdminRunScope } from './admin.run';
import { AdminTrackingController } from './controllers/admin-tracking.controller';
import { AlarmModalUpsertController } from './controllers/alarm/alarm-modal-upsert.controller';
import { AlarmController } from './controllers/alarm/alarm.controller';
import { AlarmCRUDService } from './controllers/alarm/alarm.service';
import { DataAcquisitionController } from './controllers/data-acquisition.controller';
import { FailureDelayCategoryController } from './controllers/failure-delay-category.controller';
import { LessonLearnedCategoryController } from './controllers/lesson-learned-category.controller';
import { LessonLearnedController } from './controllers/lesson-learned.controller';
import { MemberSchedulerController } from './controllers/member-scheduler/member-scheduler.controller';
import { MemberSchedulerDirective } from './controllers/member-scheduler/member-scheduler.directive';
import { SchedulerActionsService } from './controllers/member-scheduler/scheduler-actions.service';
import { UpsertFunctionController } from './controllers/member-scheduler/upsert-function.controller';
import { UpsertMemberController } from './controllers/member-scheduler/upsert-member.controller';
import { UpsertScheduleController } from './controllers/member-scheduler/upsert-schedule.controller';
import { MenuController } from './controllers/menu.controller';
import { AlarmInfoController } from './controllers/operation/alarm-info.controller';
import { OperationConfigurationService } from './controllers/operation/operation-configuration.service';
import { OperationCopyOptionsModalController } from './controllers/operation/operation-copy-options-modal.controller';
import { OperationController } from './controllers/operation/operation.controller';
import { PlannerController } from './controllers/planner.controller';
import { ReportsController } from './controllers/reports.controller';
import { SectionUpsertController } from './controllers/section/section-upsert.controller';
import { SectionController } from './controllers/section/section.controller';
import { RPDController } from './controllers/shift-report.controller';
import { TeamController } from './controllers/team.controller';
import { TrackingUpdateTimesController } from './controllers/tracking-update-times-modal.controller';
import { WellUpsertController } from './controllers/well/well-upsert.controller';
import { WellController } from './controllers/well/well.controller';
import { SavedAlarmsListDirectives } from './directives/saved-alarms-list.directive';
import { VREListTableDirective } from './directives/vre-list-table.directive';

const XPDAdminModule: angular.IModule = angular.module('xpd.admin', [
	'ngRoute',
	'xpd.setupapi',
	'xpd.operation-dashboard',
	XPDTrackingModule.name,
	XPDDMECModule.name,
	XPDZeroTimeZoneModule.name,
	'xpd.form.validation',
	'gantt',
	'xpd.calculation',
	'xpd.contract-param',
	'xpd.filters',
	XPDTimersModule.name,
	'xpd.contractTimeInput',
	AngularTreeviewModule.name,
	XPDEventDetailsModule.name,
	XPDFailureModule.name,
	XPDLessonLearnedModule.name,
	'highcharts',
	XPDLayDownConfirmationModule.name,
	'xpd.menu-confirmation',
	'xpd.admin-nav-bar',
	'xpd.failure-controller',
	'xpd.planner',
	XPDSwitchModule.name,
	XPDSetupFormInputModule.name,
	'xpd.register-alarm-modal',
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
