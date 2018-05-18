(function () {

	'use strict';

	angular.module('xpd.admin')
		.factory('schedulerActionsService', schedulerActionsService);

	schedulerActionsService.$inject = ['$uibModal', 'operationDataFactory', 'scheduleSetupAPIService', 'dialogFactory'];

	function schedulerActionsService($modal, operationDataFactory, scheduleSetupAPIService, dialogFactory) {

		var upsertMemberModal;
		var upsertFunctionModal;
		var upsertScheduleModal;
		var removeSchedulesModal;

		var schedulerActions = {
			
			onUpsertMember: onUpsertMember,
			onUpsertFunction: onUpsertFunction,
			onUpsertSchedule: onUpsertSchedule,
			onRemoveSchedules: onRemoveSchedules,

			onMouseScheduleUpdate: onMouseScheduleUpdate,

			onScheduleUpdate: onScheduleUpdate,
			onFunctionUpdate: onFunctionUpdate,
			onMemberUpdate: onMemberUpdate,

			insertScheduleOnEmptyRow: insertScheduleOnEmptyRow,

			addToGantt: null,
			removeFromGantt: null,
			updateFromGantt: null
		};
		
		operationDataFactory.operationData = [];

		return schedulerActions;

		// ##     ## ######## ##     ## ########  ######## ########  
		// ###   ### ##       ###   ### ##     ## ##       ##     ## 
		// #### #### ##       #### #### ##     ## ##       ##     ## 
		// ## ### ## ######   ## ### ## ########  ######   ########  
		// ##     ## ##       ##     ## ##     ## ##       ##   ##   
		// ##     ## ##       ##     ## ##     ## ##       ##    ##  
		// ##     ## ######## ##     ## ########  ######## ##     ## 

		function onUpsertMember(func, member) {

			if (func !== null && func.id !== null)
				member.function = angular.copy(func);

			if(upsertMemberModal)
				upsertMemberModal.close();

			upsertMemberModal = {};

			upsertMemberModal = $modal.open({
				animation: true,
				keyboard: false,
				backdrop: 'static',
				size: 'modal-sm',
				templateUrl: 'app/components/admin/views/modal/upsert-member.modal.html',
				controller: 'UpsertMemberController as uwController',
				resolve: {
					insertMemberCallback: function () {
						return insertMemberCallback;
					},
					updateMemberCallback: function () {
						return updateMemberCallback;
					},
					removeMemberCallback: function () {
						return removeMemberCallback;
					},
					$member: function () {
						return member;
					}
				}
			});

		}
		
		function insertMemberCallback(member){
			addToGantt('member', member);
		}
		
		function updateMemberCallback(member){
			updateFromGantt('member', member);
		}
		
		function removeMemberCallback(member){
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

			if(upsertFunctionModal)
				upsertFunctionModal.close();

			upsertFunctionModal = {};

			upsertFunctionModal = $modal.open({
				animation: true,
				keyboard: false,
				backdrop: 'static',
				size: 'modal-sm',
				templateUrl: 'app/components/admin/views/modal/upsert-function.modal.html',
				controller: 'UpsertFunctionController as ufController',
				resolve: {
					insertFunctionCallback: function () {
						return insertFunctionCallback;
					},
					updateFunctionCallback: function () {
						return updateFunctionCallback;
					},
					removeFunctionCallback: function () {
						return removeFunctionCallback;
					},
					$function: function () {
						return func;
					}
				}
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

			if (sibling !== null && sibling.memberId !== null)
				schedule.member = {id: sibling.memberId};

			if(upsertScheduleModal)
				upsertScheduleModal.close();
	
			upsertScheduleModal = {};

			upsertScheduleModal = $modal.open({
				animation: true,
				keyboard: false,
				backdrop: 'static',
				size: 'modal-sm',
				templateUrl: 'app/components/admin/views/modal/upsert-schedule.modal.html',
				controller: 'UpsertScheduleController as ueController',
				resolve: {
					insertScheduleCallback: function () {
						return insertScheduleCallback;
					},
					updateScheduleCallback: function () {
						return updateScheduleCallback;
					},
					removeScheduleCallback: function () {
						return removeScheduleCallback;
					},
					$schedule: function () {
						return schedule;
					}
				}
			});
		}
		
		function removeScheduleCallback(schedule) {
			removeFromGantt('schedule', schedule);
		}
		
		function updateScheduleCallback(schedule){
			updateFromGantt('schedule', schedule);
		}
				
		function insertScheduleCallback(schedule){
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
			if (sibling !== null && sibling.memberId !== null)
				schedule.member = {id: sibling.memberId};

			if(removeSchedulesModal)
				removeSchedulesModal.close();

			removeSchedulesModal = {};

			removeSchedulesModal = $modal.open({
				animation: true,
				keyboard: false,
				backdrop: 'static',
				size: 'modal-sm',
				templateUrl: 'app/components/admin/views/modal/remove-schedule.modal.html',
				controller: 'UpsertScheduleController as ueController',
				resolve: {
					insertScheduleCallback: function () {
						return insertScheduleCallback;
					},
					updateScheduleCallback: function () {
						return updateScheduleCallback;
					},
					removeScheduleCallback: function () {
						return removeScheduleCallback;
					},
					$schedule: function () {
						return schedule;
					}
				}
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

			if (typeof(schedule.sib_id) !== 'undefined' && schedule.sib_id !== null) {

				schedule = {
					startDate: new Date(schedule.start_date),
					endDate: new Date(schedule.end_date),
					id: schedule.id,
					shiftHours: new Date(schedule.end_date).getTime() - new Date(schedule.start_date).getTime()
				};

				scheduleSetupAPIService.getCleanListBySchedule(schedule, function (deletedScheduleS) {

					while( deletedScheduleS && deletedScheduleS.length > 0 ){

						var _schedule = deletedScheduleS.pop();

						if ( _schedule.id != schedule.id ) {
							removeFromGantt('schedule', _schedule );
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

			if(!task.id){
				task = task.data;
			}

			notifyRealTime(task);

			if (schedulerActions.addToGantt)
				schedulerActions.addToGantt(type, task);
			else
				console.log('addToGantt not implemented!');
		}

		function removeFromGantt(type, task) {

			notifyRealTime(task);

			if (schedulerActions.removeFromGantt)
				schedulerActions.removeFromGantt(type, task);
			else
				console.log('removeFromGantt not implemented!');
		}

		function updateFromGantt(type, task) {

			notifyRealTime(task);

			if (schedulerActions.updateFromGantt)
				schedulerActions.updateFromGantt(type, task);
			else
				notifyRealTime('updateFromGantt not implemented!');
		}

		/******************************************************************/
		/******************************************************************/
		/******************************************************************/

		function notifyRealTime(task) {

			if (task.member) {
				
				var startOfDay = new Date();
				startOfDay.setHours(0);
				startOfDay.setMinutes(0);
				startOfDay.setMilliseconds(0);
				startOfDay = startOfDay.getTime();

				var endOfDay = new Date( startOfDay + 86400000 ).getTime();
					
				var startDate = new Date(task.startDate).getTime();
				var endDate = new Date(task.endDate).getTime();
				
				if (startDate >= startOfDay && startDate <= endOfDay) {
					operationDataFactory.emitOnShiftUpdate();
				} else if (endDate >= startOfDay && endDate <= endOfDay) {
					operationDataFactory.emitOnShiftUpdate();
				} else if (startDate <= startOfDay && endDate >= endOfDay) {
					operationDataFactory.emitOnShiftUpdate();
				}

			}else{
				operationDataFactory.emitOnShiftUpdate();
			}
			
		}		

		/**************************************************************************/
		/**************************************************************************/
		/**************************************************************************/
		/**************************************************************************/
		/**************************************************************************/
		
		function generalError(error){
			dialogFactory.showCriticalDialog(JSON.stringify(error));
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

})();
