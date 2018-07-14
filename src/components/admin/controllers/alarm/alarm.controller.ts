/*
* @Author: Gezzy Ramos
* @Date:   2017-05-26 11:51:07
* @Last Modified by:   Gezzy Ramos
* @Last Modified time: 2017-08-28 10:54:42
*/
// (function() {
// 	'use strict';

// 	angular.module('xpd.admin').controller('AlarmController', alarmController);

// 	alarmController.$inject = ['$scope', 'operationDataService', 'operationSetupAPIService', 'alarmCRUDService'];
import * as angular from 'angular';
import { OperationDataService } from '../../../../xpd-resources/ng/xpd.operation-data/operation-data.service';
import { OperationSetupAPIService } from '../../../../xpd-resources/ng/xpd.setupapi/operation-setupapi.service';
import { AlarmCRUDService } from './alarm.service';

export class AlarmController {

	public static $inject: string[] = ['$scope', 'operationDataService', 'operationSetupAPIService', 'alarmCRUDService'];
	public operationDataFactory: any;

	public actionButtonEditAlarm(alarm) {
		const self = this;

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
			// tslint:disable-next-line:no-shadowed-variable
			function (alarm) {
				self.operationDataFactory.emitEditAlarm(alarm);
			},
			this.actionButtonCloseCallback,
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
			this.actionButtonSaveCallback,
			this.actionButtonCloseCallback,
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
			this.actionButtonSaveCallback,
			this.actionButtonCloseCallback,
			this.$scope.alarmData.operation,
		);

	}

	public actionButtonRemoveAlarm(alarm) {
		const self = this;
		// alarm.operation = {};

		// alarm.operation = {
		// 	id: $scope.alarmData.operation.id
		// };

		this.alarmCRUDService.removeAlarm(
			alarm,
			// tslint:disable-next-line:no-shadowed-variable
			function (alarm) {
				if (alarm) {
					self.operationDataFactory.emitRemoveAlarm(alarm);
				}
			},
		);
	}

	constructor(
		private $scope: any,
		operationDataService: OperationDataService,
		operationSetupAPIService: OperationSetupAPIService,
		private alarmCRUDService: AlarmCRUDService) {

		const vm = this;

		$scope.alarmData = {
			operation: null,
		};

		$scope.alarms = {
			timeAlarms: [],
			depthAlarms: [],
		};

		operationDataService.openConnection([]).then(function () {
			vm.operationDataFactory = operationDataService.operationDataFactory;
			$scope.operationData = vm.operationDataFactory.operationData;

			loadOperation(vm.operationDataFactory.operationData.operationContext);
		});

		operationDataService.on('setOnOperationChangeListener', loadOperation);
		operationDataService.on('setOnCurrentOperationListener', loadOperation);
		operationDataService.on('setOnRunningOperationListener', loadOperation);

		operationDataService.on('setOnAlarmsChangeListener', reloadAlarms);
		operationDataService.on('setOnDurationAlarmListener', reloadAlarms);
		operationDataService.on('setOnSpeedRestrictionAlarmListener', reloadAlarms);

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

	}

	private actionButtonCloseCallback() {
		// faça nada
	}

	private actionButtonSaveCallback(alarm) {

		alarm.enabled = true;

		if (alarm.type === 'time') {
			this.$scope.alarms.timeAlarms.push(alarm);
		} else {
			this.$scope.alarms.depthAlarms.push(alarm);
		}

		this.operationDataFactory.emitInsertAlarm(alarm);

	}
}

// })();
