(function () {
	'use strict';

	angular.module('xpd.setupapi')
		.service('alarmSetupAPIService', alarmSetupAPIService);

	alarmSetupAPIService.$inject = ['xpdAccessFactory', 'setupAPIService'];

	function alarmSetupAPIService(xpdAccessFactory, setupAPIService) {

		var BASE_URL = xpdAccessFactory.getSetupURL() + 'setup/alarm';

		var vm = this;

		vm.insertAlarm = insertAlarm;
		vm.updateAlarm = updateAlarm;
		vm.removeAlarm = removeAlarm;
		vm.updateArchive = updateArchive;
		vm.getByOperationType = getByOperationType;

		function insertAlarm(alarm, successCallback, errorCallback) {

			var req = {
				method: 'POST',
				url: BASE_URL,
				headers: {
					'Content-Type': 'application/json'
				},
				data: alarm
			};

			setupAPIService.doRequest(req, successCallback, errorCallback);
		}

		function removeAlarm(alarm, successCallback, errorCallback) {

			var req = {
				method: 'DELETE',
				url: BASE_URL + '/' + alarm.id,
				headers: {
					'Content-Type': 'application/json'
				}
			};

			setupAPIService.doRequest(req, successCallback, errorCallback);
		}

		function updateAlarm(alarm, successCallback, errorCallback) {

			var req = {
				method: 'PUT',
				url: BASE_URL,
				headers: {
					'Content-Type': 'application/json'
				},
				data: alarm
			};

			setupAPIService.doRequest(req, successCallback, errorCallback);
		}

		function updateArchive(id, archived, successCallback, errorCallback) {
			var req = {
				method: 'GET',
				url: BASE_URL + '/' + id + '/archive/' + archived
			};

			setupAPIService.doRequest(req, successCallback, errorCallback);
		}

		function getByOperationType(type, butNot, successCallback, errorCallback) {

			var req = {
				method: 'GET',
				url: BASE_URL + '/of-operations/' + type + '/but-not-id/' + (butNot || 0)
			};

			setupAPIService.doRequest(req, successCallback, errorCallback);
		}
	}

})();
