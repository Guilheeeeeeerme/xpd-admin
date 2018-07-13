// (function() {

// 	'use strict',

// 	angular.module('xpd.admin').config(adminConfig);

import AlarmTemplate from './app/components/admin/views/alarm.template.html';
import DataAcquisitionTemplate from './app/components/admin/views/data-acquisition.template.html';
import DevTemplate from './app/components/admin/views/dev.template.html';
import FailureDelayCategoryTemplate from './app/components/admin/views/failure-delay-category.template.html';
import LessonLearnedCategoryTemplate from './app/components/admin/views/lesson-learned-category.template.html';
import MemberSchedulerTemplate from './app/components/admin/views/member-scheduler.template.html';
import MenuTemplate from './app/components/admin/views/menu.template.html';
import OperationDashboardTemplate from './app/components/admin/views/operation-dashboard.template.html';
import OperationTemplate from './app/components/admin/views/operation.template.html';
import PlannerTemplate from './app/components/admin/views/planner.template.html';
import ReportsTemplate from './app/components/admin/views/reports.template.html';
import SectionTemplate from './app/components/admin/views/section.template.html';
import rpdTemplate from './app/components/admin/views/shift-report.template.html';
import TeamTemplate from './app/components/admin/views/team.template.html';
import TrackingTemplate from './app/components/admin/views/tracking.template.html';
import WellTemplate from './app/components/admin/views/well.template.html';

export class AdminConfig {
	public static $inject = ['$routeProvider'];

	constructor($routeProvider) {

		$routeProvider.when('/', {
			template: TrackingTemplate,
			controller: 'TrackingController as tController',
		});

		$routeProvider.when('/operation-dashboard', {
			template: OperationDashboardTemplate,
			controller: 'OperationDashboardController as odController',
		});

		$routeProvider.when('/menu', {
			template: MenuTemplate,
			controller: 'MenuController as mController',
		});

		$routeProvider.when('/menu/data-acquisition', {
			template: DataAcquisitionTemplate,
			controller: 'DataAcquisitionController as daController',
		});
		$routeProvider.when('/menu/failure-delay-category', {
			template: FailureDelayCategoryTemplate,
			controller: 'FailureDelayCategoryController as fdcController',
		});
		$routeProvider.when('/menu/lesson-learned-category', {
			template: LessonLearnedCategoryTemplate,
			controller: 'LessonLearnedCategoryController as llcController',
		});

		$routeProvider.when('/setup', {
			template: WellTemplate,
			controller: 'WellController as wellController',
		});
		$routeProvider.when('/setup/well', {
			template: WellTemplate,
			controller: 'WellController as wellController',
		});
		$routeProvider.when('/setup/well/:wellId/section', {
			template: SectionTemplate,
			controller: 'SectionController as sectionController',
		});

		$routeProvider.when('/setup/well/:wellId/section/:sectionId/operation', {
			template: OperationTemplate,
			controller: 'OperationController as operationController',
		});

		$routeProvider.when('/team/members', {
			template: TeamTemplate,
			controller: 'TeamController as tController',
		});
		$routeProvider.when('/team', {
			template: MemberSchedulerTemplate,
			controller: 'MemberSchedulerController as memberSchedulerController',
		});
		$routeProvider.when('/reports', {
			templateUrl: ReportsTemplate,
			controller: 'ReportsController as rController',
		});
		$routeProvider.when('/shift-report/:wellId', {
			template: rpdTemplate,
			controller: 'RPDController',
		});
		$routeProvider.when('/shift-report', {
			template: rpdTemplate,
			controller: 'RPDController',
		});
		$routeProvider.when('/planner', {
			templateUrl: PlannerTemplate,
			controller: 'PlannerController as pController',
		});
		$routeProvider.when('/alarm', {
			template: AlarmTemplate,
			controller: 'AlarmController as aController',
		});
		$routeProvider.when('/dev', {
			template: DevTemplate,
			controller: 'PlannerController as pController',
		});

	}

}

// })();
