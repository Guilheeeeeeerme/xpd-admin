import * as angular from 'angular';
import { IModalServiceInstance } from 'angular-ui-bootstrap';
import { ScheduleSetupAPIService } from '../../../../shared/xpd.setupapi/schedule-setupapi.service';

export class UpsertScheduleController {
	// 'use strict';

	// 	.controller('UpsertScheduleController', upsertScheduleController);

	public static $inject = ['$scope', '$uibModalInstance', 'scheduleSetupAPIService', 'insertScheduleCallback', 'updateScheduleCallback', 'removeScheduleCallback', '$schedule'];

	constructor(
		private $scope: any,
		private $modalInstance: IModalServiceInstance,
		private scheduleSetupAPIService: ScheduleSetupAPIService,
		private insertScheduleCallback: any,
		private updateScheduleCallback: any,
		private removeScheduleCallback: any,
		private $schedule: any) {

		if (!(Window as any).UpsertScheduleController) {
			(Window as any).UpsertScheduleController = [];
		}

		(Window as any).UpsertScheduleController.push($modalInstance.close);

		$modalInstance.close = () => {
			while ((Window as any).UpsertScheduleController && (Window as any).UpsertScheduleController.length > 0) {
				(Window as any).UpsertScheduleController.pop()();
			}
		};

		$scope.modalData = angular.copy($schedule);

		this.initDate();

	}

	public actionButtonCancel() {
		this.$modalInstance.close();
	}

	public actionButtonRemove() {

		const schedule = {
			id: this.$scope.modalData.id || null,
			startDate: new Date(this.$scope.modalData.startDate),
			member: this.$scope.modalData.member,
			endDate: new Date(this.$scope.modalData.endDate),
			shiftHours: null,
		};

		schedule.shiftHours = schedule.endDate.getTime();
		schedule.shiftHours -= schedule.startDate.getTime();

		if (!schedule.id) {
			this.removeSchedulesFromForm(schedule).then(() => {
				this.$modalInstance.close();
			});
		} else {
			this.scheduleSetupAPIService.removeSchedule({ id: schedule.id }).then((schedule1: any) => {
				this.$modalInstance.close();
				this.removeScheduleCallback(schedule1);
			});
		}

	}

	public actionButtonAdd() {

		let schedule = {
			id: this.$scope.modalData.id || null,
			startDate: new Date(this.$scope.modalData.startDate),
			member: this.$scope.modalData.member,
			endDate: new Date(this.$scope.modalData.endDate),
			shiftHours: null,
		};

		schedule.shiftHours = schedule.endDate.getTime();
		schedule.shiftHours -= schedule.startDate.getTime();

		const schedules = [];

		if (this.$scope.modalData.repeat) {

			let tempSchedule = angular.copy(schedule);

			this.$scope.modalData.repeatUntil.setHours(23);
			this.$scope.modalData.repeatUntil.setMinutes(59);
			this.$scope.modalData.repeatUntil.setSeconds(59);

			while (tempSchedule.startDate.getTime() < this.$scope.modalData.repeatUntil.getTime()) {
				delete tempSchedule.id;

				schedules.push(tempSchedule);

				tempSchedule = angular.copy(tempSchedule);

				tempSchedule.startDate = new Date(schedule.startDate.getTime() + (schedules.length * 86400000));
				tempSchedule.endDate = new Date(schedule.endDate.getTime() + (schedules.length * 86400000));

			}

		} else {
			schedules.push(schedule);
		}

		while (schedules && schedules.length > 0) {
			schedule = schedules.pop();

			if (!schedule.id) {
				this.insertScheduleFromForm(schedule);
			} else {
				this.updateScheduleFromForm(schedule);
			}

		}

		this.$modalInstance.close();

	}

	private initDate() {

		if (!this.$scope.modalData.startDate) {
			this.$scope.modalData.startDate = new Date();
		}

		this.$scope.modalData.startDate = new Date(this.$scope.modalData.startDate);

		let seconds = Math.floor(this.$scope.modalData.startDate.getMinutes() / 30);

		this.$scope.modalData.startDate.setMinutes(seconds * 30);
		this.$scope.modalData.startDate.setSeconds(0);
		this.$scope.modalData.startDate.setMilliseconds(0);

		if (!this.$scope.modalData.endDate) {
			this.$scope.modalData.endDate = this.$scope.modalData.startDate.getTime() + 1800000;
		}

		this.$scope.modalData.endDate = new Date(this.$scope.modalData.endDate);

		seconds = this.$scope.modalData.endDate.getMinutes() / 30;

		this.$scope.modalData.endDate.setMinutes(seconds * 30);
		this.$scope.modalData.endDate.setSeconds(0);
		this.$scope.modalData.endDate.setMilliseconds(0);

	}

	private removeSchedulesFromForm(schedule) {

		return new Promise((resolve, reject) => {

			this.scheduleSetupAPIService.getCleanListBySchedule(schedule).then((scheduleIds: any) => {

				console.log('Limpando %s Schedules', scheduleIds.length);

				while (scheduleIds.length > 0) {
					this.removeScheduleCallback(scheduleIds.pop());
				}

				resolve();

			});

		});

	}

	private updateScheduleFromForm(schedule) {

		return new Promise((resolve, reject) => {

			this.scheduleSetupAPIService.getCleanListBySchedule(schedule).then((scheduleIds: any) => {

				console.log('Limpando %s Schedules', scheduleIds.length);

				while (scheduleIds.length > 0) {
					const tschedule = scheduleIds.pop();

					if (tschedule.id !== schedule.id) {
						this.removeScheduleCallback(tschedule);
					}
				}

				console.log('Atualizando Schedule ' + schedule);

				this.scheduleSetupAPIService.updateSchedule(schedule).then((schedule1: any) => {
					this.updateScheduleCallback(schedule1);
					resolve(schedule1);
				}, reject);

			});

		});

	}

	private insertScheduleFromForm(schedule) {

		return new Promise( (resolve, reject) => {

			this.scheduleSetupAPIService.getCleanListBySchedule(schedule).then( (scheduleIds: any) => {

				console.log('Limpando %s Schedules', scheduleIds.length);

				while (scheduleIds.length > 0) {
					this.removeScheduleCallback(scheduleIds.pop());
				}

				console.log('Inserindo Schedule ' + schedule);

				this.scheduleSetupAPIService.insertSchedule(schedule).then( (schedule1) => {
					this.insertScheduleCallback(schedule1);
					resolve(schedule);
				}, reject);

			});

		});
	}

}
