/*
* @Author: Gezzy Ramos
* @Date:   2017-05-26 11:51:07
* @Last Modified by:   Gezzy Ramos
* @Last Modified time: 2017-08-28 10:54:42
*/
// (function() {
// 	'use strict';

import * as angular from 'angular';
import { AlarmCRUDService } from '../../../shared/xpd.alarm/alarm.service';
import { OperationDataService } from '../../../shared/xpd.operation-data/operation-data.service';
import { OperationSetupAPIService } from '../../../shared/xpd.setupapi/operation-setupapi.service';
import depthAlarmTemplate from './depth-alarm-upsert.modal.html';
import timeAlarmTemplate from './time-alarm-upsert.modal.html';

export class AlarmController {

	public static $inject: string[] = ['$scope', 'operationDataService', 'operationSetupAPIService', 'alarmCRUDService'];
	public operationDataFactory: any;

	constructor(
		private $scope: any,
		private operationDataService: OperationDataService,
		private operationSetupAPIService: OperationSetupAPIService,
		private alarmCRUDService: AlarmCRUDService) {

		const vm = this;

		$scope.alarmData = {
			operation: null,
		};

		$scope.alarms = {
			timeAlarms: [],
			depthAlarms: [],
		};

		operationDataService.openConnection(['operation', 'alarm']).then(() => {
			vm.operationDataFactory = operationDataService.operationDataFactory;
			$scope.operationData = vm.operationDataFactory.operationData;

			this.loadOperation(vm.operationDataFactory.operationData.operationContext);
		});

		operationDataService.on($scope, 'setOnOperationChangeListener', (arg) => { vm.loadOperation(arg); });
		operationDataService.on($scope, 'setOnCurrentOperationListener', (arg) => { vm.loadOperation(arg); });
		operationDataService.on($scope, 'setOnRunningOperationListener', (arg) => { vm.loadOperation(arg); });

		operationDataService.on($scope, 'setOnAlarmsChangeListener', (arg) => { vm.reloadAlarms(); });
		operationDataService.on($scope, 'setOnDurationAlarmListener', (arg) => { vm.reloadAlarms(); });
		operationDataService.on($scope, 'setOnSpeedRestrictionAlarmListener', (arg) => { vm.reloadAlarms(); });

	}

	public actionButtonEditAlarm(alarm) {
		const self = this;

		let template;
		let windowClass = '';
		if (alarm.alarmType === 'time') {
			template = timeAlarmTemplate;
		} else {
			windowClass = 'xpd-modal-xxlg';
			template = depthAlarmTemplate;
		}

		this.alarmCRUDService.editAlarm(
			alarm,
			windowClass,
			template,
			this.$scope.alarmData.operation,
		).then(
			(alarm1: any) => {
				self.operationDataFactory.emitEditAlarm(alarm1);
			},
			(arg) => {
				this.actionButtonCloseCallback();
			});
	}

	public actionButtonAddTimeAlarm() {

		const alarm = {
			alarmType: 'time',
		};

		this.alarmCRUDService.addAlarm(
			alarm,
			'',
			timeAlarmTemplate,
			this.$scope.alarmData.operation,
		).then(
			(arg) => { this.actionButtonSaveCallback(arg); },
			(arg) => { this.actionButtonCloseCallback(); },
		);

	}

	public actionButtonAddDepthAlarm() {

		const alarm = {
			alarmType: 'depth',
		};

		this.alarmCRUDService.addAlarm(
			alarm,
			'xpd-modal-xxlg',
			depthAlarmTemplate,
			this.$scope.alarmData.operation,
		).then(
			(arg) => { this.actionButtonSaveCallback(arg); },
			(arg) => { this.actionButtonCloseCallback(); },
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
		).then((alarm1) => {
			if (alarm1) {
				self.operationDataFactory.emitRemoveAlarm(alarm);
			}
		});
	}

	private loadOperation(operationContext) {
		if (!operationContext) { return; }

		this.$scope.alarmData.operation = angular.copy(operationContext.currentOperation);
		this.reloadAlarms();
	}

	private reloadAlarms() {
		if (this.$scope.alarmData.operation == null) { return; }

		this.loadOperationAlarms();
	}

	private loadOperationAlarms() {

		this.operationSetupAPIService.getOperationAlarms(
			this.$scope.alarmData.operation.id).then(
				(arg) => { this.loadOperationAlarmsSuccessCallback(arg); },
		);
	}

	private loadOperationAlarmsSuccessCallback(alarms) {
		this.$scope.alarms.timeAlarms = [];
		this.$scope.alarms.depthAlarms = [];

		for (const i in alarms) {
			if (alarms[i].enabled !== false) {
				if (alarms[i].alarmType === 'time') {
					this.$scope.alarms.timeAlarms.push(alarms[i]);
				} else {
					this.$scope.alarms.depthAlarms.push(alarms[i]);
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
