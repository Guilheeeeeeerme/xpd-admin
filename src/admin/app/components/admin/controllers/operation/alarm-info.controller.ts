(function() {
	'use strict';

	angular.module('xpd.admin').controller('AlarmInfoController', alarmInfoController);

	alarmInfoController.$inject = ['$scope', '$uibModal', 'alarmSetupAPIService', 'alarmService'];

	function alarmInfoController($scope, $uibModal, alarmSetupAPIService, alarmService) {
		const vm = this;

		vm.actionButtonAddAlarm = actionButtonAddAlarm;
		vm.actionButtonEditAlarm = actionButtonEditAlarm;
		vm.actionButtonRemoveAlarm = actionButtonRemoveAlarm;

		vm.actionButtonArchive = actionButtonArchive;
		vm.actionButtonUnarchive = actionButtonUnarchive;
		// vm.setAlarmToImport = setAlarmToImport;

		vm.actionButtonImport = actionButtonImport;

		$scope.alarms = {
			defaultAlarms: [],
			historyAlarms: [],
			archivedAlarms: [],
			// alarmToImport: {}
		};

		loadLegacy();

		function loadLegacy() {
			// $scope.alarms.alarmToImport = null;

			$scope.alarms.defaultAlarms = [];
			$scope.alarms.historyAlarms = [];
			$scope.alarms.archivedAlarms = [];

			alarmSetupAPIService.getByOperationType($scope.dados.operation.type, $scope.dados.operation.id, listByTypeCallback);

		}

		function listByTypeCallback(alarms) {
			for (const i in alarms) {
				const alarm = alarms[i];

				if (alarm.enabled == false) {
					alarm.enabled = false;
				} else {
					alarm.enabled = true;
				}

				if (alarm.archivedAlarm == true) {
					$scope.alarms.archivedAlarms.push(alarm);
				} else if (alarm.defaultAlarm == true) {
					$scope.alarms.defaultAlarms.push(alarm);
				} else {
					$scope.alarms.historyAlarms.push(alarm);
				}
			}
		}

		function actionButtonArchive(alarm) {
			// $scope.alarms.alarmToImport = null;
			alarm.archivedAlarm = true;
			alarmSetupAPIService.updateArchive(alarm.id, true, loadLegacy);
		}

		function actionButtonUnarchive(alarm) {
			// $scope.alarms.alarmToImport = null;
			alarm.archivedAlarm = false;
			alarmSetupAPIService.updateArchive(alarm.id, false, loadLegacy);
		}

		// function setAlarmToImport(alarm) {
		// 	$scope.alarms.alarmToImport = alarm;
		// }

		function actionButtonImport(alarm) {

			const newAlarm = angular.copy(alarm);

			// $scope.alarms.alarmToImport = null;

			newAlarm.operation = {
				id: $scope.dados.operation.id,
			};

			delete newAlarm.id;

			for (const i in newAlarm.timeSlices) {
				delete newAlarm.timeSlices[i].id;
				delete newAlarm.timeSlices[i].alarm;
			}

			actionButtonAddAlarm(newAlarm);

		}

		function actionButtonAddAlarm(_alarm) {
			const alarm = (!_alarm) ? null : _alarm;

			alarmService.addAlarm(
				alarm,
				'xpd-modal-xxlg',
				'app/components/admin/views/forms/alarm-info-upsert.modal.html',
				actionButtonSaveCallback,
				actionButtonCloseCallback,
				$scope.dados.operation,
			);
		}

		function actionButtonSaveCallback(alarm) {

			alarm.enabled = true;

			if ($scope.dados.operation.alarms && $scope.dados.operation.alarms.length) {
				$scope.dados.operation.alarms.push(alarm);
			} else {
				$scope.dados.operation.alarms = [alarm];
			}

		}

		function actionButtonCloseCallback() {

		}

		function actionButtonEditAlarm(alarm) {

			$scope.alarmToUpdate = alarm;

			alarmService.editAlarm(
				alarm,
				'xpd-modal-xxlg',
				'app/components/admin/views/forms/alarm-info-upsert.modal.html',
				function(updatedAlarm) {
					for (const field in updatedAlarm) {
						$scope.alarmToUpdate[field] = updatedAlarm[field];
					}
				},
				actionButtonCloseCallback,
				$scope.dados.operation,
			);

		}

		function actionButtonRemoveAlarm(alarm) {
			alarmService.removeAlarm(alarm);
		}

	}

})();
