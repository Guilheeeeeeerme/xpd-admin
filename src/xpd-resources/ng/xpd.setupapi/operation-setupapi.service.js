(function () {
	'use strict';

	angular.module('xpd.setupapi').service('operationSetupAPIService', operationSetupAPIService);

	operationSetupAPIService.$inject = ['$http', 'xpdAccessFactory', 'setupAPIService'];

	function operationSetupAPIService($http, xpdAccessFactory, setupAPIService) {

		var BASE_URL = xpdAccessFactory.getSetupURL() + 'setup/operation';

		var vm = this;

		vm.getDefaultFields = getDefaultFields;
		vm.getOperationAlarms = getOperationAlarms;
		vm.getOperationReadings = getOperationReadings;
		vm.getOperationQueue = getOperationQueue;
		vm.getObjectById = getObjectById;
		vm.insertObject = insertObject;
		vm.updateObject = updateObject;
		vm.getList = getList;

		function getOperationAlarms(operationId, successCallback, errorCallback) {

			$http.get(BASE_URL + '/' + operationId + '/alarms')
				.then(
					function (response) {
						successCallback && successCallback(response.data.data);
					},
					function (error) {
						setupAPIService.generateToast(error.data, true);
						errorCallback && errorCallback(error);
					}
				);
		}

		function getObjectById(id, successCallback, errorCallback) {

			$http.get(BASE_URL + '/' + id)
				.then(
					function (response) {
						successCallback && successCallback(response.data.data);
					},
					function (error) {
						setupAPIService.generateToast(error.data, true);
						errorCallback && errorCallback(error);
					}
				);
		}

		function getList(successCallback, errorCallback) {

			$http.get(BASE_URL + '/list')
				.then(
					function (response) {
						successCallback && successCallback(response.data.data);
					},
					function (error) {
						setupAPIService.generateToast(error.data, true);
						errorCallback && errorCallback(error);
					}
				);
		}

		function insertObject(object, successCallback, errorCallback) {

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

		function updateObject(object, successCallback, errorCallback) {

			var req = {
				method: 'PUT',
				url: BASE_URL + '/' + object.id,
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

		function getDefaultFields(type, successCallback, errorCallback) {
			var req = {
				method: 'GET',
				url: BASE_URL + '/default?type=' + type,
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

		function getOperationReadings(operationId, successCallback, errorCallback) {

			$http.get(BASE_URL + '/' + operationId + '/readings')
				.then(
					function (response) {
						successCallback && successCallback(response.data.data);
					},
					function (error) {
						setupAPIService.generateToast(error.data, true);
						errorCallback && errorCallback(error);
					}
				);
		}

		function getOperationQueue(wellId, successCallback, errorCallback) {
			$http.get(xpdAccessFactory.getSetupURL() + 'report-service/operations-queue/' + wellId)
				.then(
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
