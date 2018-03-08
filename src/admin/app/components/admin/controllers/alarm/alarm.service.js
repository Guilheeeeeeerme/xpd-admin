(function () {
	'use strict';

	angular.module('xpd.admin')
		.service('alarmService', alarmService);
	
	alarmService.$inject = ['$uibModal', 'dialogFactory'];

	function alarmService($uibModal, dialogFactory) {
		var vm = this;

		vm.addAlarm = addAlarm;
		vm.editAlarm = editAlarm;
		vm.removeAlarm = removeAlarm;

		/**
		 * 
		 * @param {obj} alarm
		 * @param {string} windowClass 
		 * @param {string} template 
		 * @param {function} actionButtonSaveCallback 
		 * @param {function} actionButtonCloseCallback 
		 * @param {obj} operation 
		 */
		function addAlarm(alarm, windowClass, template, actionButtonSaveCallback, actionButtonCloseCallback, operation) {
			
			if(!alarm)
				alarm = {};
			
			if (!alarm.alarmType || alarm.alarmType == 'time') {
				alarm.startTime = new Date();
				alarm.endTime = new Date(alarm.startTime.getTime() + 1800000);
			}

			alarm.operation = {id: operation.id};

			openModal(
				alarm,
				windowClass,
				template,
				actionButtonSaveCallback,
				actionButtonCloseCallback,
				operation
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
		function editAlarm(alarm, windowClass, template, actionButtonSaveCallback, actionButtonCloseCallback, operation) {
			
			alarm.operation = {
				id: operation.id
			};

			alarm.startTime = (alarm.startTime != null) ? new Date(alarm.startTime) : null;
			alarm.endTime = (alarm.endTime != null) ? new Date(alarm.endTime) : null;

			openModal(
				alarm,
				windowClass,
				template,
				actionButtonSaveCallback,
				actionButtonCloseCallback,
				operation
			);

		}

		/**
		 * 
		 * @param {obj} alarm 
		 * @param {function} callback 
		 */
		function removeAlarm(alarm, callback) {

			dialogFactory.showConfirmDialog('Are you sure you want to delete this alarm?', function () {

				if (alarm.id == null) {
					alarm = null;
				} else {
					alarm.enabled = false;
				}

				callback && callback(alarm);

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
		function openModal(alarm, windowClass, template, actionButtonSaveCallback, actionButtonCloseCallback, operation) {

			$uibModal.open({
				animation: true,
				keyboard: false,
				backdrop: 'static',
				size: 'lg',
				templateUrl: template,
				controller: 'AlarmModalUpsertController as amuController',
				windowClass: windowClass,
				resolve: {
					actionButtonSaveCallback: function () {
						return actionButtonSaveCallback;
					},
					actionButtonCloseCallback: function () {
						return actionButtonCloseCallback;
					},
					operation: function () {
						return operation;
					},
					alarm: function () {
						return angular.copy(alarm);
					}
				}
			});
		}
	}
})();