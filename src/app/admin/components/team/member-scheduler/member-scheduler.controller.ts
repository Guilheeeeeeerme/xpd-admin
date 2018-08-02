import { ScheduleSetupAPIService } from '../../../../shared/xpd.setupapi/schedule-setupapi.service';
import { SchedulerActionsService } from './scheduler-actions.service';

export class MemberSchedulerController {
	// 'use strict';

	public static $inject: string[] = ['$scope', 'scheduleSetupAPIService', 'schedulerActionsService'];

	constructor(
		private $scope: any,
		private scheduleSetupAPIService: ScheduleSetupAPIService,
		private schedulerActionsService: SchedulerActionsService) {

		const vm = this;

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

		$scope.schedulerSetup.dateRange = new Array(this.getDateRange($scope.schedulerSetup.referenceDate.getMonth()));

		this.loadScheduleData();
	}

	/**
	 * FUNCTION IMPLEMENTATIONS
	 **/

	public actionButtonSchedulerSetupYear(addYear) {
		this.$scope.schedulerSetup.selectedYear += addYear;

		if (this.$scope.schedulerSetup.selectedMonth === 1) {
			this.$scope.schedulerSetup.dateRange = new Array(this.getDateRange(this.$scope.schedulerSetup.selectedMonth));
		}

		this.updateReferenceDate();
	}

	public actionButtonSchedulerSetupMonth(month) {
		console.log('Scheduler!');
		this.$scope.schedulerSetup.selectedMonth = month;
		this.$scope.schedulerSetup.dateRange = new Array(this.getDateRange(month));

		this.updateReferenceDate();
		this.loadScheduleData();
	}

	public actionButtonSchedulerSetupDay(date) {
		this.$scope.schedulerSetup.selectedDate = date;

		this.updateReferenceDate();
		this.loadScheduleData();
	}

	public actionButtonDayMode() {
		this.$scope.schedulerSetup.monthlyView = false;
		this.loadScheduleData();
	}

	public actionButtonMonthMode() {
		this.$scope.schedulerSetup.monthlyView = true;
		this.loadScheduleData();
	}

	public actionButtonOnlyScheduled() {
		this.$scope.schedulerSetup.showOnlyScheduledMembers = !this.$scope.schedulerSetup.showOnlyScheduledMembers;

		this.loadScheduleData();
	}

	private loadScheduleData() {
		let fromDate;
		let toDate;

		/**
		 * SETTING UP DATE LIMITS
		 **/
		const referenceDate = this.$scope.schedulerSetup.referenceDate;

		if (this.$scope.schedulerSetup.monthlyView) {
			fromDate = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1).getTime();
			toDate = new Date(referenceDate.getFullYear(), referenceDate.getMonth() + 1, 1).getTime();
		} else {
			fromDate = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate() - 1).getTime();
			toDate = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate() + 1, 23, 59, 59).getTime();
		}

		if (this.$scope.schedulerSetup.showOnlyScheduledMembers) {
			this.scheduleSetupAPIService.getOnlyScheduled(fromDate, toDate).then( (scheduleList) => {
				this.$scope.dados.scheduleList = scheduleList;
			});
		} else {
			this.scheduleSetupAPIService.fullScheduleByRangeDate(fromDate, toDate).then( (scheduleList) => {
				this.$scope.dados.scheduleList = scheduleList;
			});
		}
	}

	private getDateRange(month) {
		return new Date(this.$scope.schedulerSetup.selectedYear, (month + 1), 0).getDate();
	}

	private updateReferenceDate() {
		if (this.$scope.schedulerSetup.selectedDate > this.getDateRange(this.$scope.schedulerSetup.selectedMonth)) {
			this.$scope.schedulerSetup.referenceDate = new Date(this.$scope.schedulerSetup.selectedYear, this.$scope.schedulerSetup.selectedMonth, this.getDateRange(this.$scope.schedulerSetup.selectedMonth));
		} else {
			this.$scope.schedulerSetup.referenceDate = new Date(this.$scope.schedulerSetup.selectedYear, this.$scope.schedulerSetup.selectedMonth, this.$scope.schedulerSetup.selectedDate);
		}
	}
}
