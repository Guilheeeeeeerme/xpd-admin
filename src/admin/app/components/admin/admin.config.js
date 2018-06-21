(function() {

	'use strict',

	angular.module('xpd.admin').config(adminConfig).run(adminRootScope);

	adminConfig.$inject = ['$routeProvider'];

	adminRootScope.$inject = ['$rootScope'];

	function adminConfig($routeProvider) {

		$routeProvider.when('/', {
			templateUrl: './app/components/admin/views/tracking.template.html',
			controller: 'TrackingController as tController'
		});

		$routeProvider.when('/operation-dashboard', {
			templateUrl: './app/components/admin/views/operation-dashboard.template.html',
			controller: 'OperationDashboardController as odController'
		});

		$routeProvider.when('/menu', {
			templateUrl: './app/components/admin/views/menu.template.html',
			controller: 'MenuController as mController'
		});
		$routeProvider.when('/menu/data-acquisition', {
			templateUrl: './app/components/admin/views/data-acquisition.template.html',
			controller: 'DataAcquisitionController as daController'
		});
		$routeProvider.when('/menu/failure-delay-category', {
			templateUrl: './app/components/admin/views/failure-delay-category.template.html',
			controller: 'FailureDelayCategoryController as fdcController'
		});
		$routeProvider.when('/menu/lesson-learned-category', {
			templateUrl: './app/components/admin/views/lesson-learned-category.template.html',
			controller: 'LessonLearnedCategoryController as llcController'
		});


		$routeProvider.when('/setup', {
			templateUrl: './app/components/admin/views/well.template.html',
			controller: 'WellController as wellController'
		});
		$routeProvider.when('/setup/well', {
			templateUrl: './app/components/admin/views/well.template.html',
			controller: 'WellController as wellController'
		});
		$routeProvider.when('/setup/well/:wellId/section', {
			templateUrl: './app/components/admin/views/section.template.html',
			controller: 'SectionController as sectionController'
		});
		$routeProvider.when('/setup/well/:wellId/section/:sectionId/operation', {
			templateUrl: './app/components/admin/views/operation.template.html',
			controller: 'OperationController as operationController'
		});

		$routeProvider.when('/team/members', {
			templateUrl: './app/components/admin/views/team.template.html',
			controller: 'TeamController as tController'
		});
		$routeProvider.when('/team', {
			templateUrl: './app/components/admin/views/member-scheduler.template.html',
			controller: 'MemberSchedulerController as memberSchedulerController'
		});
		$routeProvider.when('/reports', {
			templateUrl: './app/components/admin/views/reports.template.html',
			controller: 'ReportsController as rController'
		});
		$routeProvider.when('/shift-report/:wellId', {
			templateUrl: './app/components/admin/views/shift-report.template.html',
			controller: 'RpdController as rpdController'
		});
		$routeProvider.when('/shift-report', {
			templateUrl: './app/components/admin/views/shift-report.template.html',
			controller: 'RpdController as rpdController'
		});
		$routeProvider.when('/planner', {
			templateUrl: './app/components/admin/views/planner.template.html',
			controller: 'PlannerController as pController'
		});
		$routeProvider.when('/alarm', {
			templateUrl: './app/components/admin/views/alarm.template.html',
			controller: 'AlarmController as aController'
		});

		$routeProvider.when('/dev', {
			templateUrl: './app/components/admin/views/dev.template.html',
			controller: 'PlannerController as pController'
		});

	}

	function adminRootScope($rootScope){
		$rootScope.XPDmodule = 'admin';
	}


})();
