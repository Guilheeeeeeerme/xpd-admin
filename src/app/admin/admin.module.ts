import * as angular from 'angular';

import { XPDSharedModule } from '../shared/shared.module';
import { AdminConfig } from './admin.config';
import { AdminRunScope } from './admin.run';
import { AlarmModalUpsertController } from './components/alarm/alarm-modal-upsert.controller';
import { AlarmController } from './components/alarm/alarm.controller';
import { AlarmCRUDService } from './components/alarm/alarm.service';
import { DataAcquisitionController } from './components/data-acquisition/data-acquisition.controller';
import { FailureDelayCategoryController } from './components/failure-lesson/failure-delay-category.controller';
import { LessonLearnedCategoryController } from './components/failure-lesson/lesson-learned-category.controller';
import { MenuController } from './components/menu/menu.controller';
import { OperationDashboardController } from './components/operation-dashboard/operation-dashboard.controller';
import { XPDOperationDashboardModule } from './components/operation-dashboard/operation-dashboard.module';
import { AdminTrackingController } from './components/other/admin-tracking.controller';
import { SavedAlarmsListDirectives } from './components/other/saved-alarms-list/saved-alarms-list.directive';
import { VREListTableDirective } from './components/other/vre-list-table/vre-list-table.directive';
import { PlannerController } from './components/planner/planner.controller';
import { RPDController } from './components/rpd/shift-report.controller';
import { AlarmInfoController } from './components/setup/operation/alarm-info.controller';
import { OperationConfigurationService } from './components/setup/operation/operation-configuration.service';
import { OperationCopyOptionsModalController } from './components/setup/operation/operation-copy-options-modal.controller';
import { OperationController } from './components/setup/operation/operation.controller';
import { SectionUpsertController } from './components/setup/section/section-upsert.controller';
import { SectionController } from './components/setup/section/section.controller';
import { WellUpsertController } from './components/setup/well/well-upsert.controller';
import { WellController } from './components/setup/well/well.controller';
import { MemberSchedulerController } from './components/team/member-scheduler/member-scheduler.controller';
import { MemberSchedulerDirective } from './components/team/member-scheduler/member-scheduler.directive';
import { SchedulerActionsService } from './components/team/member-scheduler/scheduler-actions.service';
import { UpsertFunctionController } from './components/team/member-scheduler/upsert-function.controller';
import { UpsertMemberController } from './components/team/member-scheduler/upsert-member.controller';
import { UpsertScheduleController } from './components/team/member-scheduler/upsert-schedule.controller';
import { TeamController } from './components/team/team.controller';
import { TrackingController } from './components/tracking/tracking.controller';

const XPDAdminModule: angular.IModule = angular.module('xpd.admin', [
	XPDSharedModule.name,
	XPDOperationDashboardModule.name,
]);

export { XPDAdminModule };

/**
 * Reviewed
 */

XPDAdminModule.config(AdminConfig);

XPDAdminModule.controller('OperationDashboardController', OperationDashboardController);
XPDAdminModule.controller('TrackingController', TrackingController);
XPDAdminModule.controller('AlarmModalUpsertController', AlarmModalUpsertController);
XPDAdminModule.controller('AlarmController', AlarmController);
XPDAdminModule.controller('MemberSchedulerController', MemberSchedulerController);
XPDAdminModule.controller('UpsertFunctionController', UpsertFunctionController);
XPDAdminModule.controller('UpsertMemberController', UpsertMemberController);
XPDAdminModule.controller('UpsertScheduleController', UpsertScheduleController);
XPDAdminModule.controller('AlarmInfoController', AlarmInfoController);
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
XPDAdminModule.controller('RPDController', RPDController);
XPDAdminModule.controller('TeamController', TeamController);

XPDAdminModule.directive('xpdMemberScheduler', MemberSchedulerDirective.Factory());
XPDAdminModule.directive('xpdSavedAlarmsList', SavedAlarmsListDirectives.Factory());
XPDAdminModule.directive('xpdVreListTable', VREListTableDirective.Factory());

XPDAdminModule.run(AdminRunScope);

XPDAdminModule.service('alarmCRUDService', AlarmCRUDService);
XPDAdminModule.service('schedulerActionsService', SchedulerActionsService);
XPDAdminModule.service('OperationConfigurationService', OperationConfigurationService);
