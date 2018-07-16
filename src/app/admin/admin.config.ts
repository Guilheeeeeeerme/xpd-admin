import AlarmTemplate from './../../components/admin/views/alarm.template.html';
import DataAcquisitionTemplate from './../../components/admin/views/data-acquisition.template.html';
import DevTemplate from './../../components/admin/views/dev.template.html';
import FailureDelayCategoryTemplate from './../../components/admin/views/failure-delay-category.template.html';
import LessonLearnedCategoryTemplate from './../../components/admin/views/lesson-learned-category.template.html';
import MemberSchedulerTemplate from './../../components/admin/views/member-scheduler.template.html';
import MenuTemplate from './../../components/admin/views/menu.template.html';
import OperationDashboardTemplate from './../../components/admin/views/operation-dashboard.template.html';
import OperationTemplate from './../../components/admin/views/operation.template.html';
import PlannerTemplate from './../../components/admin/views/planner.template.html';
import SectionTemplate from './../../components/admin/views/section.template.html';
import rpdTemplate from './../../components/admin/views/shift-report.template.html';
import TeamTemplate from './../../components/admin/views/team.template.html';
import TrackingTemplate from './../../components/admin/views/tracking.template.html';
import WellTemplate from './../../components/admin/views/well.template.html';

AdminConfig.$inject = ['$routeProvider'];

function AdminConfig($routeProvider) {

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

	$routeProvider.when('/shift-report/:wellId', {
		template: rpdTemplate,
		controller: 'RPDController',
	});
	$routeProvider.when('/shift-report', {
		template: rpdTemplate,
		controller: 'RPDController',
	});
	$routeProvider.when('/planner', {
		template: PlannerTemplate,
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

export { AdminConfig };

