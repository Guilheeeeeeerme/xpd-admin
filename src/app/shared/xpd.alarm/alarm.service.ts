import * as angular from 'angular';
import { IModalService } from 'angular-ui-bootstrap';
import { DialogService } from '../xpd.dialog/xpd.dialog.factory';
// (function() {
// 	'use strict';

// 		.service('alarmCRUDService', alarmCRUDService);

// 	alarmCRUDService.$inject = ['$uibModal', 'dialogService'];

export class AlarmCRUDService {

	public static $inject: string[] = ['$uibModal', '$q', 'dialogService'];

	constructor(
		private $uibModal: IModalService,
		private $q: angular.IQService,
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
	public addAlarm(alarm, windowClass, template, operation) {

		if (!alarm) {
			alarm = {};
		}

		if (!alarm.alarmType || alarm.alarmType === 'time') {
			alarm.startTime = new Date();
			alarm.endTime = new Date(alarm.startTime.getTime() + 1800000);
		}

		alarm.operation = { id: operation.id };

		return this.openModal(
			alarm,
			windowClass,
			template,
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
	public editAlarm(alarm, windowClass, template, operation) {

		alarm.operation = {
			id: operation.id,
		};

		alarm.startTime = (alarm.startTime != null) ? new Date(alarm.startTime) : null;
		alarm.endTime = (alarm.endTime != null) ? new Date(alarm.endTime) : null;

		return this.openModal(
			alarm,
			windowClass,
			template,
			operation,
		);

	}

	/**
	 *
	 * @param {obj} alarm
	 * @param {function} callback
	 */
	public removeAlarm(alarm) {

		return this.$q((resolve, reject) => {

			this.dialogService.showConfirmDialog('Are you sure you want to delete this alarm?', () => {

				if (alarm.id == null) {
					alarm = null;
				} else {
					alarm.enabled = false;
				}

				resolve(alarm);

			});

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
	private openModal(alarm, windowClass, template, operation) {

		return this.$q((actionButtonSaveCallback, actionButtonCloseCallback) => {

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

		});

	}

}
// })();
