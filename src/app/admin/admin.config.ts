import AlarmTemplate from './components/alarm/alarm.template.html';
import DataAcquisitionTemplate from './components/data-acquisition/data-acquisition.template.html';
import FailureDelayCategoryTemplate from './components/failure-lesson/failure-delay-category.template.html';
import LessonLearnedCategoryTemplate from './components/failure-lesson/lesson-learned-category.template.html';
import MenuTemplate from './components/menu/menu.template.html';
import OperationDashboardTemplate from './components/operation-dashboard/operation-dashboard.template.html';
import PlannerTemplate from './components/planner/planner.template.html';
import rpdTemplate from './components/rpd/shift-report.template.html';
import OperationTemplate from './components/setup/operation/operation.template.html';
import SectionTemplate from './components/setup/section/section.template.html';
import WellTemplate from './components/setup/well/well.template.html';
import MemberSchedulerTemplate from './components/team/member-scheduler.template.html';
import TeamTemplate from './components/team/team.template.html';
import TrackingTemplate from './components/tracking/tracking.template.html';

const AdminConfig = ($routeProvider) => {

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

};

AdminConfig.$inject = ['$routeProvider'];

export { AdminConfig };
