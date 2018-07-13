/*
* @Author: Gezzy Ramos
* @Date:   2017-05-26 11:51:07
* @Last Modified by:   Gezzy Ramos
* @Last Modified time: 2017-08-28 10:54:42
*/
// (function() {
// 	'use strict';

// 	angular.module('xpd.admin').controller('AlarmController', alarmController);

// 	alarmController.$inject = ['$scope', 'operationDataFactory', 'operationSetupAPIService', 'alarmCRUDService'];
import * as angular from 'angular';
import { OperationDataFactory } from '../../../../../../xpd-resources/ng/xpd.communication/operation-server-data.factory';
import { AlarmSetupAPIService } from '../../../../../../xpd-resources/ng/xpd.setupapi/alarm-setupapi.service';
import { OperationSetupAPIService } from '../../../../../../xpd-resources/ng/xpd.setupapi/operation-setupapi.service';

export class AlarmController {

	public static $inject: string[] = ['$scope', 'operationDataFactory', 'operationSetupAPIService', 'alarmCRUDService'];

	public actionButtonEditAlarm(alarm) {

		let template;
		let windowClass = '';
		if (alarm.alarmType === 'time') {
			template = 'app/components/admin/views/modal/time-alarm-upsert.modal.html';
		} else {
			windowClass = 'xpd-modal-xxlg';
			template = 'app/components/admin/views/modal/depth-alarm-upsert.modal.html';
		}

		this.alarmCRUDService.editAlarm(
			alarm,
			windowClass,
			template,
			function (alarm) {
				operationDataFactory.emitEditAlarm(alarm);
			},
			actionButtonCloseCallback,
			this.$scope.alarmData.operation,
		);
	}

	public actionButtonAddTimeAlarm() {

		const alarm = {
			alarmType: 'time',
		};

		this.alarmCRUDService.addAlarm(
			alarm,
			'',
			'app/components/admin/views/modal/time-alarm-upsert.modal.html',
			actionButtonSaveCallback,
			actionButtonCloseCallback,
			this.$scope.alarmData.operation,
		);

	}

	public actionButtonAddDepthAlarm() {

		const alarm = {
			alarmType: 'depth',
		};

		this.alarmCRUDService.addAlarm(
			alarm,
			'xpd-modal-xxlg',
			'app/components/admin/views/modal/depth-alarm-upsert.modal.html',
			actionButtonSaveCallback,
			actionButtonCloseCallback,
			this.$scope.alarmData.operation,
		);

	}

	public actionButtonRemoveAlarm(alarm) {
		// alarm.operation = {};

		// alarm.operation = {
		// 	id: $scope.alarmData.operation.id
		// };

		this.alarmCRUDService.removeAlarm(
			alarm,
			function (alarm) {
				if (alarm) {
					operationDataFactory.emitRemoveAlarm(alarm);
				}
			},
		);
	}

	constructor(
		private $scope: any,
		private operationDataFactory: OperationDataFactory,
		private operationSetupAPIService: OperationSetupAPIService,
		private alarmCRUDService: AlarmSetupAPIService) {

		$scope.alarmData = {
			operation: null,
		};

		$scope.alarms = {
			timeAlarms: [],
			depthAlarms: [],
		};

		operationDataFactory.openConnection([]).then(function (response) {
			operationDataFactory = response;
			$scope.operationData = operationDataFactory.operationData;

			loadOperation(operationDataFactory.operationData.operationContext);
		});

		operationDataFactory.addEventListener('alarmController', 'setOnOperationChangeListener', loadOperation);
		operationDataFactory.addEventListener('alarmController', 'setOnCurrentOperationListener', loadOperation);
		operationDataFactory.addEventListener('alarmController', 'setOnRunningOperationListener', loadOperation);

		operationDataFactory.addEventListener('alarmController', 'setOnAlarmsChangeListener', reloadAlarms);
		operationDataFactory.addEventListener('alarmController', 'setOnDurationAlarmListener', reloadAlarms);
		operationDataFactory.addEventListener('alarmController', 'setOnSpeedRestrictionAlarmListener', reloadAlarms);

		function loadOperation(operationContext) {
			if (!operationContext) { return; }

			$scope.alarmData.operation = angular.copy(operationContext.currentOperation);
			reloadAlarms();
		}

		function reloadAlarms() {
			if ($scope.alarmData.operation == null) { return; }

			loadOperationAlarms();
		}

		function loadOperationAlarms() {

			operationSetupAPIService.getOperationAlarms(
				$scope.alarmData.operation.id,
				loadOperationAlarmsSuccessCallback,
			);
		}

		function loadOperationAlarmsSuccessCallback(alarms) {
			$scope.alarms.timeAlarms = [];
			$scope.alarms.depthAlarms = [];

			for (const i in alarms) {
				if (alarms[i].enabled !== false) {
					if (alarms[i].alarmType === 'time') {
						$scope.alarms.timeAlarms.push(alarms[i]);
					} else {
						$scope.alarms.depthAlarms.push(alarms[i]);
					}
				}
			}
		}

		function actionButtonSaveCallback(alarm) {

			alarm.enabled = true;

			if (alarm.type === 'time') {
				$scope.alarms.timeAlarms.push(alarm);
			} else {
				$scope.alarms.depthAlarms.push(alarm);
			}

			operationDataFactory.emitInsertAlarm(alarm);

		}

		function actionButtonCloseCallback() {
			// faça nada
		}

	}
}

// })();
