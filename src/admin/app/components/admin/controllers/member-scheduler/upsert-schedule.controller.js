(function () {
	'use strict';

	angular.module('xpd.admin')
		.controller('UpsertScheduleController', upsertScheduleController);

	upsertScheduleController.$inject = ['$scope', '$uibModalInstance', 'setupAPIService', 'scheduleSetupAPIService', 'insertScheduleCallback', 'updateScheduleCallback', 'removeScheduleCallback', '$schedule'];

	function upsertScheduleController($scope, $modalInstance, setupAPIService, scheduleSetupAPIService, insertScheduleCallback, updateScheduleCallback, removeScheduleCallback, $schedule) {

		if(!Window.UpsertScheduleController)
			Window.UpsertScheduleController = [];

		Window.UpsertScheduleController.push($modalInstance.close);

		$modalInstance.close = function(){
			while(Window.UpsertScheduleController && Window.UpsertScheduleController.length > 0){
				Window.UpsertScheduleController.pop()();
			}
		};

		$scope.actionButtonAdd = actionButtonAdd;
		$scope.actionButtonCancel = actionButtonCancel;
		$scope.actionButtonRemove = actionButtonRemove;
		
		$scope.modalData = angular.copy($schedule);

		initDate();

		function initDate(){

			if(!$scope.modalData.startDate)
				$scope.modalData.startDate = new Date();
			
			$scope.modalData.startDate = new Date($scope.modalData.startDate);

			var seconds = Math.floor($scope.modalData.startDate.getMinutes()/30);

			$scope.modalData.startDate.setMinutes(seconds * 30);
			$scope.modalData.startDate.setSeconds(0);
			$scope.modalData.startDate.setMilliseconds(0);
			
			if(!$scope.modalData.endDate)
				$scope.modalData.endDate = $scope.modalData.startDate.getTime() + 1800000;
				
			$scope.modalData.endDate = new Date($scope.modalData.endDate);

			seconds = $scope.modalData.endDate.getMinutes()/30;
				
			$scope.modalData.endDate.setMinutes(seconds * 30);
			$scope.modalData.endDate.setSeconds(0);
			$scope.modalData.endDate.setMilliseconds(0);

		}		

		function actionButtonAdd(){
			
			var schedule = {
				id: $scope.modalData.id || null,
				startDate: new Date($scope.modalData.startDate),
				member: $scope.modalData.member,
				endDate: new Date($scope.modalData.endDate)
			};
			
			schedule.shiftHours = schedule.endDate.getTime();
			schedule.shiftHours -= schedule.startDate.getTime();

			var schedules = [];
			
			if ($scope.modalData.repeat) {
			
				var tempSchedule = angular.copy(schedule);
			
				$scope.modalData.repeatUntil.setHours(23);
				$scope.modalData.repeatUntil.setMinutes(59);
				$scope.modalData.repeatUntil.setSeconds(59);
			
				while (tempSchedule.startDate.getTime() < $scope.modalData.repeatUntil.getTime()) {
					delete tempSchedule.id;
			
					schedules.push(tempSchedule);
			
					tempSchedule = angular.copy(tempSchedule);
			
					tempSchedule.startDate = new Date(schedule.startDate.getTime() + (schedules.length * 86400000));
					tempSchedule.endDate = new Date(schedule.endDate.getTime() + (schedules.length * 86400000));
			
				}
			
			} else {
				schedules.push(schedule);
			}
			
			while(schedules && schedules.length > 0){
				schedule = schedules.pop();

				if (!schedule.id) {
					insertScheduleFromForm(schedule);
				} else {
					updateScheduleFromForm(schedule);
				}

			}
			
			$modalInstance.close();

		}

		function removeSchedulesFromForm(schedule){
			
			return new Promise(function(resolve, reject){
			
				scheduleSetupAPIService.getCleanListBySchedule(schedule, function (scheduleIds) {
								
					console.log('Limpando %s Schedules', scheduleIds.length);
			
					while (scheduleIds.length > 0) {
						removeScheduleCallback( scheduleIds.pop() );
					}

					resolve();
			
				});
						
			});

		}

		function updateScheduleFromForm(schedule) {

			return new Promise(function(resolve, reject){

				scheduleSetupAPIService.getCleanListBySchedule(schedule, function (scheduleIds) {
					
					console.log('Limpando %s Schedules', scheduleIds.length);

					while (scheduleIds.length > 0) {
						var _schedule = scheduleIds.pop();

						if (_schedule.id != schedule.id) {
							removeScheduleCallback(_schedule);
						}
					}

					console.log('Atualizando Schedule ' + schedule);

					setupAPIService.updateObject('setup/schedule', schedule, function(response){
						updateScheduleCallback(response.data);
						resolve(response.data);
					}, reject);

				});
			
			});

		}
		
		function insertScheduleFromForm(schedule) {
			
			return new Promise(function(resolve, reject){

				scheduleSetupAPIService.getCleanListBySchedule(schedule, function (scheduleIds) {

					console.log('Limpando %s Schedules', scheduleIds.length);

					while (scheduleIds.length > 0) {
						removeScheduleCallback(scheduleIds.pop());
					}

					console.log('Inserindo Schedule ' + schedule);

					setupAPIService.insertObject('setup/schedule', schedule, function(response){
						insertScheduleCallback(response.data);
						resolve(response.data);
					}, reject);
			
				});
			
			});
		}

		function actionButtonCancel(){
			$modalInstance.close();
		}

		function actionButtonRemove(){

			var schedule = {
				id: $scope.modalData.id || null,
				startDate: new Date($scope.modalData.startDate),
				member: $scope.modalData.member,
				endDate: new Date($scope.modalData.endDate)
			};
			
			schedule.shiftHours = schedule.endDate.getTime();
			schedule.shiftHours -= schedule.startDate.getTime();

			if(!schedule.id){
				removeSchedulesFromForm(schedule).then(function(){
					$modalInstance.close();
				});
			}else{
				setupAPIService.removeObject('setup/schedule', { id: schedule.id }, function(response){
					schedule = response.data;
					$modalInstance.close();
					removeScheduleCallback(schedule);
				});
			}

			
		}

	}

})();
