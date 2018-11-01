import * as angular from 'angular';
import { IModalService } from 'angular-ui-bootstrap';
import { AlarmCRUDService } from '../../../shared/xpd.alarm/alarm.service';
import { AlarmSetupAPIService } from '../../../shared/xpd.setupapi/alarm-setupapi.service';
import alarmInfoTemplate from './alarm-info-upsert.modal.html';

export class AlarmInfoController {
	// 'use strict';

	public static $inject = ['$scope', '$filter', 'alarmSetupAPIService', 'alarmCRUDService'];

	constructor(
		private $scope: any,
		private $filter,
		private alarmSetupAPIService: AlarmSetupAPIService,
		private alarmCRUDService: AlarmCRUDService) {

		const vm = this;

		$scope.alarms = {
			defaultAlarms: [],
			historyAlarms: [],
			archivedAlarms: [],
			// alarmToImport: {}
		};

		this.loadLegacy();
	}

	public actionButtonArchive(alarm) {
		// $scope.alarms.alarmToImport = null;
		alarm.archivedAlarm = true;
		this.alarmSetupAPIService.updateArchive(alarm.id, true).then((arg) => { this.loadLegacy(); });
	}

	public actionButtonUnarchive(alarm) {
		// $scope.alarms.alarmToImport = null;
		alarm.archivedAlarm = false;
		this.alarmSetupAPIService.updateArchive(alarm.id, false).then((arg) => { this.loadLegacy(); });
	}

	// function setAlarmToImport(alarm) {
	// 	$scope.alarms.alarmToImport = alarm;
	// }

	public actionButtonImport(alarm) {

		const newAlarm = angular.copy(alarm);

		// $scope.alarms.alarmToImport = null;

		newAlarm.operation = {
			id: this.$scope.dados.operation.id,
		};

		delete newAlarm.id;

		for (const i in newAlarm.timeSlices) {
			delete newAlarm.timeSlices[i].id;
			delete newAlarm.timeSlices[i].alarm;
		}

		this.actionButtonAddAlarm(newAlarm);

	}

	public actionButtonAddAlarm(talarm) {
		const alarm = (!talarm) ? null : talarm;

		this.alarmCRUDService.addAlarm(
			alarm,
			'xpd-modal-xxlg',
			alarmInfoTemplate,
			this.$scope.dados.operation,
		).then(
			(arg) => { this.actionButtonSaveCallback(arg); },
			(arg) => { this.actionButtonCloseCallback(); },
		);
	}

	public actionButtonEditAlarm(alarm) {

		this.$scope.alarmToUpdate = alarm;

		this.alarmCRUDService.editAlarm(
			alarm,
			'xpd-modal-xxlg',
			alarmInfoTemplate,
			this.$scope.dados.operation,
		).then(
			(updatedAlarm) => {
				for (const field in updatedAlarm) {
					this.$scope.alarmToUpdate[field] = updatedAlarm[field];
				}
			},
			(arg) => {
				this.actionButtonCloseCallback();
			},
		);

	}

	public actionButtonRemoveAlarm(alarm) {
		this.alarmCRUDService.removeAlarm(alarm).then(
			(resp: any) => {
				if (resp == null) {
					this.$scope.dados.operation.alarms = this.$filter('filter')(this.$scope.dados.operation.alarms, (a) => {
						return a.$$hashKey !== alarm.$$hashKey;
					});
				} else {
					this.$scope.dados.operation.alarms = this.$filter('filter')(this.$scope.dados.operation.alarms, (a) => {
						return a.id !== alarm.id;
					});
				}
			},
		);
	}

	private loadLegacy() {
		// $scope.alarms.alarmToImport = null;

		this.$scope.alarms.defaultAlarms = [];
		this.$scope.alarms.historyAlarms = [];
		this.$scope.alarms.archivedAlarms = [];

		this.alarmSetupAPIService.getByOperationType(this.$scope.dados.operation.type, this.$scope.dados.operation.id).then(
			(arg) => {
				this.listByTypeCallback(arg);
			});

	}

	private listByTypeCallback(alarms) {
		for (const i in alarms) {
			const alarm = alarms[i];

			if (alarm.enabled === false) {
				alarm.enabled = false;
			} else {
				alarm.enabled = true;
			}

			if (alarm.archivedAlarm === true) {
				this.$scope.alarms.archivedAlarms.push(alarm);
			} else if (alarm.defaultAlarm === true) {
				this.$scope.alarms.defaultAlarms.push(alarm);
			} else {
				this.$scope.alarms.historyAlarms.push(alarm);
			}
		}
	}

	private actionButtonSaveCallback(alarm) {

		alarm.enabled = true;

		if (this.$scope.dados.operation.alarms && this.$scope.dados.operation.alarms.length) {
			this.$scope.dados.operation.alarms.push(alarm);
		} else {
			this.$scope.dados.operation.alarms = [alarm];
		}

	}

	private actionButtonCloseCallback() {
		// faça nada
	}

}
