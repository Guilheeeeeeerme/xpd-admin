(function() {
	'use strict';

	angular.module('xpd.admin').controller('MemberSchedulerController', MemberSchedulerController);

	MemberSchedulerController.$inject = ['$scope', 'scheduleSetupAPIService', 'schedulerActionsService'];

	function MemberSchedulerController($scope, scheduleSetupAPIService, schedulerActionsService) {
		let vm = this;

		/**
         * SCHEDULER SETUP
         **/
		$scope.schedulerSetup = {
			referenceDate: new Date(),
			monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
			monthlyView: null,
			showOnlyScheduledMembers: false,
		};

		$scope.dados = {
			scheduleList: [],
		};

		$scope.schedulerActions = schedulerActionsService;

		$scope.schedulerSetup.selectedDate = new Date().getDate();
		$scope.schedulerSetup.selectedMonth = new Date().getMonth();
		$scope.schedulerSetup.selectedYear = new Date().getFullYear();

		$scope.schedulerSetup.dateRange = new Array(getDateRange($scope.schedulerSetup.referenceDate.getMonth()));

		vm.actionButtonSchedulerSetupYear = actionButtonSchedulerSetupYear;
		vm.actionButtonSchedulerSetupMonth = actionButtonSchedulerSetupMonth;
		vm.actionButtonSchedulerSetupDay = actionButtonSchedulerSetupDay;
		vm.actionButtonMonthMode = actionButtonMonthMode;
		vm.actionButtonDayMode = actionButtonDayMode;
		vm.actionButtonOnlyScheduled = actionButtonOnlyScheduled;

		loadScheduleData();

		/**
         * FUNCTION IMPLEMENTATIONS
         **/

		function actionButtonSchedulerSetupYear(addYear) {
			$scope.schedulerSetup.selectedYear += addYear;

			if ($scope.schedulerSetup.selectedMonth === 1) {
				$scope.schedulerSetup.dateRange = new Array(getDateRange($scope.schedulerSetup.selectedMonth));
			}

			updateReferenceDate();
		}

		function actionButtonSchedulerSetupMonth(month) {
			console.log('Scheduler!');
			$scope.schedulerSetup.selectedMonth = month;
			$scope.schedulerSetup.dateRange = new Array(getDateRange(month));

			updateReferenceDate();
			loadScheduleData();
		}

		function actionButtonSchedulerSetupDay(date) {
			$scope.schedulerSetup.selectedDate = date;

			updateReferenceDate();
			loadScheduleData();
		}

		function actionButtonDayMode() {
			$scope.schedulerSetup.monthlyView = false;
			loadScheduleData();
		}

		function actionButtonMonthMode() {
			$scope.schedulerSetup.monthlyView = true;
			loadScheduleData();
		}

		function actionButtonOnlyScheduled() {
			$scope.schedulerSetup.showOnlyScheduledMembers = !$scope.schedulerSetup.showOnlyScheduledMembers;

			loadScheduleData();
		}

		function loadScheduleData() {
			let fromDate, toDate;

			/**
             * SETTING UP DATE LIMITS
             **/
			let referenceDate = $scope.schedulerSetup.referenceDate;

			if ($scope.schedulerSetup.monthlyView) {
				fromDate = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1).getTime();
				toDate = new Date(referenceDate.getFullYear(), referenceDate.getMonth() + 1, 1).getTime();
			} else {
				fromDate = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate() - 1).getTime();
				toDate = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate() + 1, 23, 59, 59).getTime();
			}

			if ($scope.schedulerSetup.showOnlyScheduledMembers) {
				scheduleSetupAPIService.getOnlyScheduled(fromDate, toDate, function(scheduleList) {
					$scope.dados.scheduleList = scheduleList;
				});
			} else {
				scheduleSetupAPIService.fullScheduleByRangeDate(fromDate, toDate, function(scheduleList) {
					$scope.dados.scheduleList = scheduleList;
				});
			}
		}

		function getDateRange(month) {
			return new Date($scope.schedulerSetup.selectedYear, (month + 1), 0).getDate();
		}

		function updateReferenceDate() {
			if ($scope.schedulerSetup.selectedDate > getDateRange($scope.schedulerSetup.selectedMonth)) {
				$scope.schedulerSetup.referenceDate = new Date($scope.schedulerSetup.selectedYear, $scope.schedulerSetup.selectedMonth, getDateRange($scope.schedulerSetup.selectedMonth));
			}
			else {
				$scope.schedulerSetup.referenceDate = new Date($scope.schedulerSetup.selectedYear, $scope.schedulerSetup.selectedMonth, $scope.schedulerSetup.selectedDate);
			}
		}
	}
})();
