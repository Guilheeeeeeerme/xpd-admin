import * as angular from 'angular';
import { IModalService } from 'angular-ui-bootstrap';
import { DialogService } from '../../../../xpd-resources/ng/xpd.dialog/xpd.dialog.factory';
import { OperationDataService } from '../../../../xpd-resources/ng/xpd.operation-data/operation-data.service';
import { ScheduleSetupAPIService } from '../../../../xpd-resources/ng/xpd.setupapi/schedule-setupapi.service';
import removeScheduleTemplate from '../../views/modal/remove-schedule.modal.html';
import upsertFunctionTemplate from '../../views/modal/upsert-function.modal.html';
import upsertMemberTemplate from '../../views/modal/upsert-member.modal.html';
import upsertScheduleTemplate from '../../views/modal/upsert-schedule.modal.html';

export class SchedulerActionsService {

	// 'use strict';

	// angular.module('xpd.admin')
	// 	.factory('schedulerActionsService', schedulerActionsService);

	// schedulerActionsService.$inject = ['$uibModal', 'operationDataService', 'scheduleSetupAPIService', 'dialogService'];
	public static $inject: string[] = ['$uibModal', 'operationDataService', 'scheduleSetupAPIService', 'dialogService'];

	public operationDataFactory: any;
	public onUpsertMember: any;
	public onUpsertFunction: any;
	public onUpsertSchedule: any;
	public onRemoveSchedules: any;
	public onMouseScheduleUpdate: any;
	public onScheduleUpdate: any;
	public onFunctionUpdate: any;
	public onMemberUpdate: any;
	public insertScheduleOnEmptyRow: any;
	public addToGantt: any;
	public removeFromGantt: any;
	public updateFromGantt: any;

	constructor(
		$modal: IModalService,
		operationDataService: OperationDataService,
		scheduleSetupAPIService: ScheduleSetupAPIService,
		dialogService: DialogService) {

		let upsertMemberModal;
		let upsertFunctionModal;
		let upsertScheduleModal;
		let removeSchedulesModal;

		const self = this;

		self.onUpsertMember = onUpsertMember;
		self.onUpsertFunction = onUpsertFunction;
		self.onUpsertSchedule = onUpsertSchedule;
		self.onRemoveSchedules = onRemoveSchedules;
		self.onMouseScheduleUpdate = onMouseScheduleUpdate;
		self.onScheduleUpdate = onScheduleUpdate;
		self.onFunctionUpdate = onFunctionUpdate;
		self.onMemberUpdate = onMemberUpdate;
		self.insertScheduleOnEmptyRow = insertScheduleOnEmptyRow;
		self.addToGantt = null;
		self.removeFromGantt = null;
		self.updateFromGantt = null;

		operationDataService.openConnection([]).then(function () {
			self.operationDataFactory = operationDataService.operationDataFactory;
		});

		// ##     ## ######## ##     ## ########  ######## ########
		// ###   ### ##       ###   ### ##     ## ##       ##     ##
		// #### #### ##       #### #### ##     ## ##       ##     ##
		// ## ### ## ######   ## ### ## ########  ######   ########
		// ##     ## ##       ##     ## ##     ## ##       ##   ##
		// ##     ## ##       ##     ## ##     ## ##       ##    ##
		// ##     ## ######## ##     ## ########  ######## ##     ##

		function onUpsertMember(func, member) {

			if (func !== null && func.id !== null) {
				member.function = angular.copy(func);
			}

			if (upsertMemberModal) {
				upsertMemberModal.close();
			}

			upsertMemberModal = {};

			upsertMemberModal = $modal.open({
				animation: true,
				keyboard: false,
				backdrop: 'static',
				size: 'modal-sm',
				template: upsertMemberTemplate,
				controller: 'UpsertMemberController as uwController',
				resolve: {
					insertMemberCallback() {
						return insertMemberCallback;
					},
					updateMemberCallback() {
						return updateMemberCallback;
					},
					removeMemberCallback() {
						return removeMemberCallback;
					},
					$member() {
						return member;
					},
				},
			});

		}

		function insertMemberCallback(member) {
			addToGantt('member', member);
		}

		function updateMemberCallback(member) {
			updateFromGantt('member', member);
		}

		function removeMemberCallback(member) {
			removeFromGantt('member', member);
		}

		// ######## ##     ## ##    ##  ######  ######## ####  #######  ##    ##
		// ##       ##     ## ###   ## ##    ##    ##     ##  ##     ## ###   ##
		// ##       ##     ## ####  ## ##          ##     ##  ##     ## ####  ##
		// ######   ##     ## ## ## ## ##          ##     ##  ##     ## ## ## ##
		// ##       ##     ## ##  #### ##          ##     ##  ##     ## ##  ####
		// ##       ##     ## ##   ### ##    ##    ##     ##  ##     ## ##   ###
		// ##        #######  ##    ##  ######     ##    ####  #######  ##    ##

		function onUpsertFunction(func) {

			if (upsertFunctionModal) {
				upsertFunctionModal.close();
			}

			upsertFunctionModal = {};

			upsertFunctionModal = $modal.open({
				animation: true,
				keyboard: false,
				backdrop: 'static',
				size: 'modal-sm',
				template: upsertFunctionTemplate,
				controller: 'UpsertFunctionController as ufController',
				resolve: {
					insertFunctionCallback() {
						return insertFunctionCallback;
					},
					updateFunctionCallback() {
						return updateFunctionCallback;
					},
					removeFunctionCallback() {
						return removeFunctionCallback;
					},
					$function() {
						return func;
					},
				},
			});

		}

		function removeFunctionCallback(func) {
			removeFromGantt('function', func);
		}

		function insertFunctionCallback(func) {
			addToGantt('function', func);
		}

		function updateFunctionCallback(func) {
			updateFromGantt('function', func);
		}

		//  ######   ######  ##     ## ######## ########  ##     ## ##       ########
		// ##    ## ##    ## ##     ## ##       ##     ## ##     ## ##       ##
		// ##       ##       ##     ## ##       ##     ## ##     ## ##       ##
		//  ######  ##       ######### ######   ##     ## ##     ## ##       ######
		// 	     ## ##       ##     ## ##       ##     ## ##     ## ##       ##
		// ##    ## ##    ## ##     ## ##       ##     ## ##     ## ##       ##
		//  ######   ######  ##     ## ######## ########   #######  ######## ########

		function onUpsertSchedule(sibling, schedule) {

			if (sibling !== null && sibling.memberId !== null) {
				schedule.member = { id: sibling.memberId };
			}

			if (upsertScheduleModal) {
				upsertScheduleModal.close();
			}

			upsertScheduleModal = {};

			upsertScheduleModal = $modal.open({
				animation: true,
				keyboard: false,
				backdrop: 'static',
				size: 'modal-sm',
				template: upsertScheduleTemplate,
				controller: 'UpsertScheduleController as ueController',
				resolve: {
					insertScheduleCallback() {
						return insertScheduleCallback;
					},
					updateScheduleCallback() {
						return updateScheduleCallback;
					},
					removeScheduleCallback() {
						return removeScheduleCallback;
					},
					$schedule() {
						return schedule;
					},
				},
			});
		}

		function removeScheduleCallback(schedule) {
			removeFromGantt('schedule', schedule);
		}

		function updateScheduleCallback(schedule) {
			updateFromGantt('schedule', schedule);
		}

		function insertScheduleCallback(schedule) {
			addToGantt('schedule', schedule);
		}

		// ########  ######## ##     ##  #######  ##     ## ########     ######   ######  ##     ## ######## ########  ##     ## ##       ########  ######
		// ##     ## ##       ###   ### ##     ## ##     ## ##          ##    ## ##    ## ##     ## ##       ##     ## ##     ## ##       ##       ##    ##
		// ##     ## ##       #### #### ##     ## ##     ## ##          ##       ##       ##     ## ##       ##     ## ##     ## ##       ##       ##
		// ########  ######   ## ### ## ##     ## ##     ## ######       ######  ##       ######### ######   ##     ## ##     ## ##       ######    ######
		// ##   ##   ##       ##     ## ##     ##  ##   ##  ##                ## ##       ##     ## ##       ##     ## ##     ## ##       ##             ##
		// ##    ##  ##       ##     ## ##     ##   ## ##   ##          ##    ## ##    ## ##     ## ##       ##     ## ##     ## ##       ##       ##    ##
		// ##     ## ######## ##     ##  #######     ###    ########     ######   ######  ##     ## ######## ########   #######  ######## ########  ######

		function onRemoveSchedules(sibling, schedule) {
			if (sibling !== null && sibling.memberId !== null) {
				schedule.member = { id: sibling.memberId };
			}

			if (removeSchedulesModal) {
				removeSchedulesModal.close();
			}

			removeSchedulesModal = {};

			removeSchedulesModal = $modal.open({
				animation: true,
				keyboard: false,
				backdrop: 'static',
				size: 'modal-sm',
				template: removeScheduleTemplate,
				controller: 'UpsertScheduleController as ueController',
				resolve: {
					insertScheduleCallback() {
						return insertScheduleCallback;
					},
					updateScheduleCallback() {
						return updateScheduleCallback;
					},
					removeScheduleCallback() {
						return removeScheduleCallback;
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

		function onMouseScheduleUpdate(schedule) {

			if (typeof (schedule.sib_id) !== 'undefined' && schedule.sib_id !== null) {

				schedule = {
					startDate: new Date(schedule.start_date),
					endDate: new Date(schedule.end_date),
					id: schedule.id,
					shiftHours: new Date(schedule.end_date).getTime() - new Date(schedule.start_date).getTime(),
				};

				scheduleSetupAPIService.getCleanListBySchedule(schedule, function (deletedScheduleS) {

					while (deletedScheduleS && deletedScheduleS.length > 0) {

						// tslint:disable-next-line:variable-name
						const _schedule = deletedScheduleS.pop();

						if (_schedule.id !== schedule.id) {
							removeFromGantt('schedule', _schedule);
						}
					}

					scheduleSetupAPIService.updateSchedule(schedule, notifyRealTime);

				});

			}

		}

		function insertScheduleOnEmptyRow(schedule) {

			schedule.startDate.setMinutes(0);
			schedule.startDate.setMilliseconds(0);
			schedule.endDate.setMinutes(0);
			schedule.endDate.setMilliseconds(0);

			scheduleSetupAPIService.insertSchedule(schedule, insertScheduleCallback);

		}

		/******************************************************************/
		/******************************************************************/
		/******************************************************************/

		function addToGantt(type, task) {

			if (!task.id) {
				task = task.data;
			}

			notifyRealTime(task);

			if (self.addToGantt) {
				self.addToGantt(type, task);
			} else {
				console.log('addToGantt not implemented!');
			}
		}

		function removeFromGantt(type, task) {

			notifyRealTime(task);

			if (self.removeFromGantt) {
				self.removeFromGantt(type, task);
			} else {
				console.log('removeFromGantt not implemented!');
			}
		}

		function updateFromGantt(type, task) {

			notifyRealTime(task);

			if (self.updateFromGantt) {
				self.updateFromGantt(type, task);
			} else {
				notifyRealTime('updateFromGantt not implemented!');
			}
		}

		/******************************************************************/
		/******************************************************************/
		/******************************************************************/

		function notifyRealTime(task) {

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
					self.operationDataFactory.emitOnShiftUpdate();
				} else if (endDate >= startOfDay && endDate <= endOfDay) {
					self.operationDataFactory.emitOnShiftUpdate();
				} else if (startDate <= startOfDay && endDate >= endOfDay) {
					self.operationDataFactory.emitOnShiftUpdate();
				}

			} else {
				self.operationDataFactory.emitOnShiftUpdate();
			}

		}

		/**************************************************************************/
		/**************************************************************************/
		/**************************************************************************/
		/**************************************************************************/
		/**************************************************************************/

		function generalError(error) {
			dialogService.showCriticalDialog(JSON.stringify(error));
		}

		function onMemberUpdate(member) {
			scheduleSetupAPIService.getMemberById(member.memberId, function (member) {
				onUpsertMember(null, member);
			}, generalError);
		}

		function onFunctionUpdate(func) {
			scheduleSetupAPIService.getFunctionById(func.functionId, function (func) {
				onUpsertFunction(func);
			}, generalError);
		}

		function onScheduleUpdate(schedule) {
			scheduleSetupAPIService.getScheduleById(schedule.id, function (schedule) {
				onUpsertSchedule(null, schedule);
			}, generalError);
		}

		/**************************************************************************/
		/**************************************************************************/
		/**************************************************************************/
		/**************************************************************************/
		/**************************************************************************/

	}

}
