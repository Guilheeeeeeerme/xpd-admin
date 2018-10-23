import * as angular from 'angular';

import { XPDSharedModule } from '../shared/shared.module';
import { AdminConfig } from './admin.config';
import { AdminRunScope } from './admin.run';
import { AlarmController } from './components/alarm/alarm.controller';
import { DataAcquisitionController } from './components/data-acquisition/data-acquisition.controller';
import { FailureDelayCategoryController } from './components/failure-lesson/failure-delay-category.controller';
import { LessonLearnedCategoryController } from './components/failure-lesson/lesson-learned-category.controller';
import { MenuController } from './components/menu/menu.controller';
import { OperationDashboardController } from './components/operation-dashboard/operation-dashboard.controller';
import { XPDOperationDashboardModule } from './components/operation-dashboard/operation-dashboard.module';
import { VREListTableDirective } from './components/other/vre-list-table/vre-list-table.directive';
import { PlannerController } from './components/planner/planner.controller';
import { RPDController } from './components/rpd/shift-report.controller';
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

console.log('Importando css admin');
import './../../assets/css/dhtmlxgantt.scss';
import './../../assets/css/dhtmlxgantt_broadway.scss';

import './../../assets/css/admin.scss';
import './../../assets/css/xpd.scss';

// <!-- endbuild -->

export { XPDAdminModule };

/**
 * Reviewed
 */

XPDAdminModule.config(AdminConfig);

XPDAdminModule.controller('OperationDashboardController', OperationDashboardController);
XPDAdminModule.controller('TrackingController', TrackingController);
XPDAdminModule.controller('AlarmController', AlarmController);
XPDAdminModule.controller('MemberSchedulerController', MemberSchedulerController);
XPDAdminModule.controller('UpsertFunctionController', UpsertFunctionController);
XPDAdminModule.controller('UpsertMemberController', UpsertMemberController);
XPDAdminModule.controller('UpsertScheduleController', UpsertScheduleController);
XPDAdminModule.controller('DataAcquisitionController', DataAcquisitionController);
XPDAdminModule.controller('FailureDelayCategoryController', FailureDelayCategoryController);
XPDAdminModule.controller('LessonLearnedCategoryController', LessonLearnedCategoryController);
XPDAdminModule.controller('MenuController', MenuController);
XPDAdminModule.controller('PlannerController', PlannerController);
XPDAdminModule.controller('RPDController', RPDController);
XPDAdminModule.controller('TeamController', TeamController);

XPDAdminModule.directive('xpdMemberScheduler', MemberSchedulerDirective.Factory());
XPDAdminModule.directive('xpdVreListTable', VREListTableDirective.Factory());

XPDAdminModule.run(AdminRunScope);

XPDAdminModule.service('schedulerActionsService', SchedulerActionsService);
