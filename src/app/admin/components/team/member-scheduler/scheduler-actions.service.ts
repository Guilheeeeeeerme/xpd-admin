import * as angular from 'angular';
import { IModalService } from 'angular-ui-bootstrap';
import { DialogService } from '../../../../shared/xpd.dialog/xpd.dialog.factory';
import { OperationDataService } from '../../../../shared/xpd.operation-data/operation-data.service';
import { ScheduleSetupAPIService } from '../../../../shared/xpd.setupapi/schedule-setupapi.service';
import removeScheduleTemplate from './remove-schedule.modal.html';
import upsertFunctionTemplate from './upsert-function.modal.html';
import upsertMemberTemplate from './upsert-member.modal.html';
import upsertScheduleTemplate from './upsert-schedule.modal.html';

export class SchedulerActionsService {

	// 'use strict';

	// 	.factory('schedulerActionsService', schedulerActionsService);

	// schedulerActionsService.$inject = ['$uibModal', 'operationDataService', 'scheduleSetupAPIService', 'dialogService'];
	public static $inject: string[] = ['$uibModal', 'operationDataService', 'scheduleSetupAPIService', 'dialogService'];

	public operationDataFactory: any;

	public addToGantt: any;
	public removeFromGantt: any;
	public updateFromGantt: any;
	public upsertMemberModal: any;
	public upsertFunctionModal: any;
	public upsertScheduleModal: any;
	public removeSchedulesModal: any;

	constructor(
		private $modal: IModalService,
		private operationDataService: OperationDataService,
		private scheduleSetupAPIService: ScheduleSetupAPIService,
		private dialogService: DialogService) {
		const self = this;

		self.addToGantt = null;
		self.removeFromGantt = null;
		self.updateFromGantt = null;

		operationDataService.openConnection(['shift']).then(() => {
			self.operationDataFactory = operationDataService.operationDataFactory;
		});
	}

	// ##     ## ######## ##     ## ########  ######## ########
	// ###   ### ##       ###   ### ##     ## ##       ##     ##
	// #### #### ##       #### #### ##     ## ##       ##     ##
	// ## ### ## ######   ## ### ## ########  ######   ########
	// ##     ## ##       ##     ## ##     ## ##       ##   ##
	// ##     ## ##       ##     ## ##     ## ##       ##    ##
	// ##     ## ######## ##     ## ########  ######## ##     ##

	public onUpsertMember(func, member) {
		const self = this;

		if (func !== null && func.id !== null) {
			member.function = angular.copy(func);
		}

		if (this.upsertMemberModal) {
			this.upsertMemberModal.close();
		}

		this.upsertMemberModal = {};

		this.upsertMemberModal = this.$modal.open({
			animation: true,
			keyboard: false,
			backdrop: 'static',
			size: 'modal-sm',
			template: upsertMemberTemplate,
			controller: 'UpsertMemberController as upsertMemberController',
			resolve: {
				insertMemberCallback() {
					return (arg) => { self.insertMemberCallback(arg); };
				},
				updateMemberCallback() {
					return (arg) => { self.updateMemberCallback(arg); };
				},
				removeMemberCallback() {
					return (arg) => { self.removeMemberCallback(arg); };
				},
				$member() {
					return member;
				},
			},
		});

	}

	// ######## ##     ## ##    ##  ######  ######## ####  #######  ##    ##
	// ##       ##     ## ###   ## ##    ##    ##     ##  ##     ## ###   ##
	// ##       ##     ## ####  ## ##          ##     ##  ##     ## ####  ##
	// ######   ##     ## ## ## ## ##          ##     ##  ##     ## ## ## ##
	// ##       ##     ## ##  #### ##          ##     ##  ##     ## ##  ####
	// ##       ##     ## ##   ### ##    ##    ##     ##  ##     ## ##   ###
	// ##        #######  ##    ##  ######     ##    ####  #######  ##    ##

	public onUpsertFunction(func) {
		const self = this;

		if (this.upsertFunctionModal) {
			this.upsertFunctionModal.close();
		}

		this.upsertFunctionModal = {};

		this.upsertFunctionModal = this.$modal.open({
			animation: true,
			keyboard: false,
			backdrop: 'static',
			size: 'modal-sm',
			template: upsertFunctionTemplate,
			controller: 'UpsertFunctionController as ufController',
			resolve: {
				insertFunctionCallback() {
					return (arg) => { self.insertFunctionCallback(arg); };
				},
				updateFunctionCallback() {
					return (arg) => { self.updateFunctionCallback(arg); };
				},
				removeFunctionCallback() {
					return (arg) => { self.removeFunctionCallback(arg); };
				},
				$function() {
					return func;
				},
			},
		});

	}

	//  ######   ######  ##     ## ######## ########  ##     ## ##       ########
	// ##    ## ##    ## ##     ## ##       ##     ## ##     ## ##       ##
	// ##       ##       ##     ## ##       ##     ## ##     ## ##       ##
	//  ######  ##       ######### ######   ##     ## ##     ## ##       ######
	// 	     ## ##       ##     ## ##       ##     ## ##     ## ##       ##
	// ##    ## ##    ## ##     ## ##       ##     ## ##     ## ##       ##
	//  ######   ######  ##     ## ######## ########   #######  ######## ########

	public onUpsertSchedule(sibling, schedule) {
		const self = this;

		if (sibling !== null && sibling.memberId !== null) {
			schedule.member = { id: sibling.memberId };
		}

		if (this.upsertScheduleModal) {
			this.upsertScheduleModal.close();
		}

		this.upsertScheduleModal = {};

		this.upsertScheduleModal = this.$modal.open({
			animation: true,
			keyboard: false,
			backdrop: 'static',
			size: 'modal-sm',
			template: upsertScheduleTemplate,
			controller: 'UpsertScheduleController as ueController',
			resolve: {
				insertScheduleCallback() {
					return (arg) => { self.insertScheduleCallback(arg); };
				},
				updateScheduleCallback() {
					return (arg) => { self.updateScheduleCallback(arg); };
				},
				removeScheduleCallback() {
					return (arg) => { self.removeScheduleCallback(arg); };
				},
				$schedule() {
					return schedule;
				},
			},
		});
	}

	// ########  ######## ##     ##  #######  ##     ## ########     ######   ######  ##     ## ######## ########  ##     ## ##       ########  ######
	// ##     ## ##       ###   ### ##     ## ##     ## ##          ##    ## ##    ## ##     ## ##       ##     ## ##     ## ##       ##       ##    ##
	// ##     ## ##       #### #### ##     ## ##     ## ##          ##       ##       ##     ## ##       ##     ## ##     ## ##       ##       ##
	// ########  ######   ## ### ## ##     ## ##     ## ######       ######  ##       ######### ######   ##     ## ##     ## ##       ######    ######
	// ##   ##   ##       ##     ## ##     ##  ##   ##  ##                ## ##       ##     ## ##       ##     ## ##     ## ##       ##             ##
	// ##    ##  ##       ##     ## ##     ##   ## ##   ##          ##    ## ##    ## ##     ## ##       ##     ## ##     ## ##       ##       ##    ##
	// ##     ## ######## ##     ##  #######     ###    ########     ######   ######  ##     ## ######## ########   #######  ######## ########  ######

	public onRemoveSchedules(sibling, schedule) {
		const self = this;

		if (sibling !== null && sibling.memberId !== null) {
			schedule.member = { id: sibling.memberId };
		}

		if (this.removeSchedulesModal) {
			this.removeSchedulesModal.close();
		}

		this.removeSchedulesModal = {};

		this.removeSchedulesModal = this.$modal.open({
			animation: true,
			keyboard: false,
			backdrop: 'static',
			size: 'modal-sm',
			template: removeScheduleTemplate,
			controller: 'UpsertScheduleController as ueController',
			resolve: {
				insertScheduleCallback() {
					return (arg) => { self.insertScheduleCallback(arg); };
				},
				updateScheduleCallback() {
					return (arg) => { self.updateScheduleCallback(arg); };
				},
				removeScheduleCallback() {
					return (arg) => { self.removeScheduleCallback(arg); };
				},
				$schedule() {
					return schedule;
				},
			},
		});

	}

	// ########  ########     ###     ######   #### ##    ##    ########  ########   #######  ########
	// ##     ## ##     ##   ## ##   ##    ##  #### ###   ##    ##     ## ##     ## ##     ## ##     ##
	// ##     ## ##     ##  ##   ##  ##         ##  ####  ##    ##     ## ##     ## ##     ## ##     ##
	// ##     ## ########  ##     ## ##   #### ##   ## ## ##    ##     ## ########  ##     ## ########
	// ##     ## ##   ##   ######### ##    ##       ##  ####    ##     ## ##   ##   ##     ## ##
	// ##     ## ##    ##  ##     ## ##    ##       ##   ###    ##     ## ##    ##  ##     ## ##
	// ########  ##     ## ##     ##  ######        ##    ##    ########  ##     ##  #######  ##

	public onMouseScheduleUpdate(schedule) {

		if (typeof (schedule.sib_id) !== 'undefined' && schedule.sib_id !== null) {

			schedule = {
				startDate: new Date(schedule.start_date),
				endDate: new Date(schedule.end_date),
				id: schedule.id,
				shiftHours: new Date(schedule.end_date).getTime() - new Date(schedule.start_date).getTime(),
			};

			this.scheduleSetupAPIService.getCleanListBySchedule(schedule).then((deletedScheduleS: any) => {

				while (deletedScheduleS && deletedScheduleS.length > 0) {

					const tschedule = deletedScheduleS.pop();

					if (tschedule.id !== schedule.id) {
						this.innerRemoveFromGantt('schedule', tschedule);
					}
				}

				this.scheduleSetupAPIService.updateSchedule(schedule).then((arg) => { this.notifyRealTime(arg); });

			});

		}

	}

	public insertScheduleOnEmptyRow(schedule) {

		schedule.startDate.setMinutes(0);
		schedule.startDate.setMilliseconds(0);
		schedule.endDate.setMinutes(0);
		schedule.endDate.setMilliseconds(0);

		this.scheduleSetupAPIService.insertSchedule(schedule).then((arg) => {
			this.insertScheduleCallback(arg);
		});

	}

	public onMemberUpdate(member) {
		this.scheduleSetupAPIService.getMemberById(member.memberId).then((member1) => {
			this.onUpsertMember(null, member1);
		}, (arg) => { this.generalError(arg); });
	}

	public onFunctionUpdate(func) {
		this.scheduleSetupAPIService.getFunctionById(func.functionId).then((func1) => {
			this.onUpsertFunction(func1);
		}, (arg) => { this.generalError(arg); });
	}

	public onScheduleUpdate(schedule) {
		this.scheduleSetupAPIService.getScheduleById(schedule.id).then((schedule1: any) => {
			this.onUpsertSchedule(null, schedule1);
		}, (arg) => { this.generalError(arg); });
	}

	private insertMemberCallback(member) {
		this.innerAddToGantt('member', member);
	}

	private updateMemberCallback(member) {
		this.innerUpdateFromGantt('member', member);
	}

	private removeMemberCallback(member) {
		this.innerRemoveFromGantt('member', member);
	}

	private removeFunctionCallback(func) {
		this.innerRemoveFromGantt('function', func);
	}

	private insertFunctionCallback(func) {
		this.innerAddToGantt('function', func);
	}

	private updateFunctionCallback(func) {
		this.innerUpdateFromGantt('function', func);
	}

	private removeScheduleCallback(schedule) {
		this.innerRemoveFromGantt('schedule', schedule);
	}

	private updateScheduleCallback(schedule) {
		this.innerUpdateFromGantt('schedule', schedule);
	}

	private insertScheduleCallback(schedule) {
		this.innerAddToGantt('schedule', schedule);
	}

	/******************************************************************/
	/******************************************************************/
	/******************************************************************/

	private innerAddToGantt(type, task) {
		const self = this;

		if (!task.id) {
			task = task.data;
		}

		this.notifyRealTime(task);

		if (self.addToGantt) {
			self.addToGantt(type, task);
		} else {
			console.log('addToGantt not implemented!');
		}
	}

	private innerRemoveFromGantt(type, task) {
		const self = this;

		this.notifyRealTime(task);

		if (self.removeFromGantt) {
			self.removeFromGantt(type, task);
		} else {
			console.log('removeFromGantt not implemented!');
		}
	}

	private innerUpdateFromGantt(type, task) {

		this.notifyRealTime(task);

		if (this.updateFromGantt) {
			this.updateFromGantt(type, task);
		} else {
			this.notifyRealTime('updateFromGantt not implemented!');
		}
	}

	/******************************************************************/
	/******************************************************************/
	/******************************************************************/

	private notifyRealTime(task) {

		if (task.member) {

			let startOfDay: any = new Date();
			startOfDay.setHours(0);
			startOfDay.setMinutes(0);
			startOfDay.setMilliseconds(0);
			startOfDay = startOfDay.getTime();

			const endOfDay = new Date(startOfDay + 86400000).getTime();

			const startDate = new Date(task.startDate).getTime();
			const endDate = new Date(task.endDate).getTime();

			if (startDate >= startOfDay && startDate <= endOfDay) {
				this.operationDataFactory.emitOnShiftUpdate();
			} else if (endDate >= startOfDay && endDate <= endOfDay) {
				this.operationDataFactory.emitOnShiftUpdate();
			} else if (startDate <= startOfDay && endDate >= endOfDay) {
				this.operationDataFactory.emitOnShiftUpdate();
			}

		} else {
			this.operationDataFactory.emitOnShiftUpdate();
		}

	}

	/**************************************************************************/
	/**************************************************************************/
	/**************************************************************************/
	/**************************************************************************/
	/**************************************************************************/

	private generalError(error) {
		this.dialogService.showCriticalDialog(JSON.stringify(error));
	}

	/**************************************************************************/
	/**************************************************************************/
	/**************************************************************************/
	/**************************************************************************/
	/**************************************************************************/

}
