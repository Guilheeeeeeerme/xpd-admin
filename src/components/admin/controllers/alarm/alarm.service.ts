import * as angular from 'angular';
import { IModalService } from 'angular-ui-bootstrap';
import { DialogService } from '../../../../xpd-resources/ng/xpd.dialog/xpd.dialog.factory';
// (function() {
// 	'use strict';

// 	angular.module('xpd.admin')
// 		.service('alarmCRUDService', alarmCRUDService);

// 	alarmCRUDService.$inject = ['$uibModal', 'dialogService'];

export class AlarmCRUDService {

	public static $inject: string[] = ['$uibModal', 'dialogService'];

	constructor(
		private $uibModal: IModalService,
		private dialogService: DialogService) {

	}

	/**
	 *
	 * @param {obj} alarm
	 * @param {string} windowClass
	 * @param {string} template
	 * @param {function} actionButtonSaveCallback
	 * @param {function} actionButtonCloseCallback
	 * @param {obj} operation
	 */
	public addAlarm(alarm, windowClass, template, actionButtonSaveCallback, actionButtonCloseCallback, operation) {

		if (!alarm) {
			alarm = {};
		}

		if (!alarm.alarmType || alarm.alarmType === 'time') {
			alarm.startTime = new Date();
			alarm.endTime = new Date(alarm.startTime.getTime() + 1800000);
		}

		alarm.operation = { id: operation.id };

		this.openModal(
			alarm,
			windowClass,
			template,
			actionButtonSaveCallback,
			actionButtonCloseCallback,
			operation,
		);
	}

	/**
	 *
	 * @param {obj} alarm
	 * @param {string} windowClass
	 * @param {string} template
	 * @param {function} actionButtonSaveCallback
	 * @param {function} actionButtonCloseCallback
	 * @param {obj} operation
	 */
	public editAlarm(alarm, windowClass, template, actionButtonSaveCallback, actionButtonCloseCallback, operation) {

		alarm.operation = {
			id: operation.id,
		};

		alarm.startTime = (alarm.startTime != null) ? new Date(alarm.startTime) : null;
		alarm.endTime = (alarm.endTime != null) ? new Date(alarm.endTime) : null;

		this.openModal(
			alarm,
			windowClass,
			template,
			actionButtonSaveCallback,
			actionButtonCloseCallback,
			operation,
		);

	}

	/**
	 *
	 * @param {obj} alarm
	 * @param {function} callback
	 */
	public removeAlarm(alarm, callback?) {

		this.dialogService.showConfirmDialog('Are you sure you want to delete this alarm?', function () {

			if (alarm.id == null) {
				alarm = null;
			} else {
				alarm.enabled = false;
			}

			if (callback) {
				callback(alarm);
			}

		});
	}

	/**
	 * Modal para cadastro/edição de alarmes
	 * @param {obj} alarm
	 * @param {string} windowClass
	 * @param {string} template
	 * @param {function} actionButtonSaveCallback
	 * @param {function} actionButtonCloseCallback
	 * @param {obj} operation
	 */
	private openModal(alarm, windowClass, template, actionButtonSaveCallback, actionButtonCloseCallback, operation) {

		this.$uibModal.open({
			animation: true,
			keyboard: false,
			backdrop: 'static',
			size: 'lg',
			template: template,
			controller: 'AlarmModalUpsertController as amuController',
			windowClass,
			resolve: {
				actionButtonSaveCallback() {
					return actionButtonSaveCallback;
				},
				actionButtonCloseCallback() {
					return actionButtonCloseCallback;
				},
				operation() {
					return operation;
				},
				alarm() {
					return angular.copy(alarm);
				},
			},
		});
	}
}
// })();
