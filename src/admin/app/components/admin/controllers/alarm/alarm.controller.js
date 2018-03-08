/*
* @Author: Gezzy Ramos
* @Date:   2017-05-26 11:51:07
* @Last Modified by:   Gezzy Ramos
* @Last Modified time: 2017-08-28 10:54:42
*/
(function() {
	'use strict';

	angular.module('xpd.admin').controller('AlarmController', alarmController);

	alarmController.$inject = ['$scope', '$uibModal', 'operationDataFactory', 'operationSetupAPIService', 'alarmService'];

	function alarmController($scope, $uibModal, operationDataFactory, operationSetupAPIService, alarmService) {
		var vm = this;

		$scope.alarmData = {
			operation: null,
		};

		$scope.alarms = {
			timeAlarms: [],
			depthAlarms: [],
		};

		$scope.operationData = operationDataFactory.operationData;

		vm.actionButtonAddTimeAlarm = actionButtonAddTimeAlarm;
		vm.actionButtonAddDepthAlarm = actionButtonAddDepthAlarm;
		vm.actionButtonEditAlarm = actionButtonEditAlarm;
		vm.actionButtonRemoveAlarm = actionButtonRemoveAlarm;

		operationDataFactory.addEventListener('alarmController', 'setOnOperationChangeListener', loadOperation);
		operationDataFactory.addEventListener('alarmController', 'setOnCurrentOperationListener', loadOperation);
		operationDataFactory.addEventListener('alarmController', 'setOnRunningOperationListener', loadOperation);

		operationDataFactory.addEventListener('alarmController', 'setOnAlarmsChangeListener', reloadAlarms);
		operationDataFactory.addEventListener('alarmController', 'setOnDurationAlarmListener', reloadAlarms);
		operationDataFactory.addEventListener('alarmController', 'setOnSpeedRestrictionAlarmListener', reloadAlarms);


		loadOperation(operationDataFactory.operationData.operationContext);


		function loadOperation(context) {
			$scope.alarmData.operation = angular.copy(context.currentOperation);
			reloadAlarms();
		}

		function reloadAlarms() {
			if ($scope.alarmData.operation == null) return;

			loadOperationAlarms();
		}

		function loadOperationAlarms() {

			operationSetupAPIService.getOperationAlarms(
				$scope.alarmData.operation.id,
				loadOperationAlarmsSuccessCallback
			);
		}

		function loadOperationAlarmsSuccessCallback(alarms) {
			$scope.alarms.timeAlarms = [];
			$scope.alarms.depthAlarms = [];

			for(var i in alarms){
				if(alarms[i].enabled != false){
					if (alarms[i].alarmType == 'time')
						$scope.alarms.timeAlarms.push(alarms[i]);
					else
						$scope.alarms.depthAlarms.push(alarms[i]);
				}
			}
		}

		function actionButtonAddTimeAlarm() {

			var alarm = {
				alarmType: 'time'
			};

			alarmService.addAlarm(
				alarm,
				'',
				'app/components/admin/views/modal/time-alarm-upsert.modal.html',
				actionButtonSaveCallback,
				actionButtonCloseCallback,
				$scope.alarmData.operation
			);

		}

		function actionButtonAddDepthAlarm() {

			var alarm = {
				alarmType: 'depth'
			};

			alarmService.addAlarm(
				alarm,
				'xpd-modal-xxlg',
				'app/components/admin/views/modal/depth-alarm-upsert.modal.html',
				actionButtonSaveCallback,
				actionButtonCloseCallback,
				$scope.alarmData.operation
			);

		}

		function actionButtonSaveCallback(alarm) {

			alarm.enabled = true;

			if (alarm.type == 'time') {
				$scope.alarms.timeAlarms.push(alarm);
			} else {
				$scope.alarms.depthAlarms.push(alarm);
			}
			
			operationDataFactory.emitInsertAlarm(alarm);

		}

		function actionButtonCloseCallback() {

		}

		function actionButtonEditAlarm(alarm) {

			var template;
			var windowClass = '';
			if (alarm.alarmType == 'time') {
				template = 'app/components/admin/views/modal/time-alarm-upsert.modal.html';
			}
			else {
				windowClass = 'xpd-modal-xxlg';
				template = 'app/components/admin/views/modal/depth-alarm-upsert.modal.html';
			}

			alarmService.editAlarm(
				alarm,
				windowClass,
				template,
				function (alarm) {
					operationDataFactory.emitEditAlarm(alarm);
				},
				actionButtonCloseCallback,
				$scope.alarmData.operation
			);
		}

		function actionButtonRemoveAlarm(alarm) {
			// alarm.operation = {};

			// alarm.operation = {
			// 	id: $scope.alarmData.operation.id
			// };

			alarmService.removeAlarm(
				alarm,
				function (alarm) {
					if(alarm)
						operationDataFactory.emitRemoveAlarm(alarm);
				}
			);
		}

	}

})();
