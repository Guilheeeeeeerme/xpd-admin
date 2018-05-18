(function () {
	'use strict';

	angular.module('xpd.setupapi')
		.service('alarmSetupAPIService', alarmSetupAPIService);

	alarmSetupAPIService.$inject = ['$http', 'xpdAccessFactory', 'setupAPIService'];

	function alarmSetupAPIService($http, xpdAccessFactory, setupAPIService) {

		var BASE_URL = xpdAccessFactory.getSetupURL() + 'setup/alarm';

		var vm = this;

		vm.insertAlarm = insertAlarm;
		vm.updateAlarm = updateAlarm;
		vm.removeAlarm = removeAlarm;
		vm.updateArchive = updateArchive;
		vm.getByOperationType = getByOperationType;

		function insertAlarm(object, successCallback, errorCallback) {

			var req = {
				method: 'POST',
				url: BASE_URL,
				headers: {
					'Content-Type': 'application/json'
				},
				data: object
			};

			$http(req).then(
				function (response) {
					successCallback && successCallback(response.data.data);
				},
				function (error) {
					setupAPIService.generateToast(error.data, true);
					errorCallback && errorCallback(error);
				}
			);
		}

		function removeAlarm(object, successCallback, errorCallback) {

			var req = {
				method: 'DELETE',
				url: BASE_URL + '/' + object.id,
				headers: {
					'Content-Type': 'application/json'
				}
			};

			$http(req).then(
				function (response) {
					successCallback && successCallback(response.data.data);
				},
				function (error) {
					setupAPIService.generateToast(error.data, true);
					errorCallback && errorCallback(error);
				}
			);
		}

		function updateAlarm(object, successCallback, errorCallback) {

			var req = {
				method: 'PUT',
				url: BASE_URL,
				headers: {
					'Content-Type': 'application/json'
				},
				data: object
			};

			$http(req).then(
				function (response) {
					successCallback && successCallback(response.data.data);
				},
				function (error) {
					setupAPIService.generateToast(error.data, true);
					errorCallback && errorCallback(error);
				}
			);
		}

		function updateArchive(id, archived, successCallback, errorCallback) {
			var req = {
				method: 'GET',
				url: BASE_URL + '/' + id + '/archive/' + archived
			};
			
			$http(req).then(
				function (response) {
					successCallback && successCallback(response.data.data);
				},
				function (error) {
					setupAPIService.generateToast(error.data, true);
					errorCallback && errorCallback(error);
				}
			);
		}

		function getByOperationType(type, butNot, successCallback, errorCallback) {

			var req = {
				method: 'GET',
				url: BASE_URL + '/of-operations/' + type + '/but-not-id/' + (butNot || 0)
			};

			$http(req).then(
				function (response) {
					successCallback && successCallback(response.data.data);
				},
				function (error) {
					setupAPIService.generateToast(error.data, true);
					errorCallback && errorCallback(error);
				}
			);
		}
	}

})();
