(function () {
	'use strict';

	angular.module('xpd.setupapi').service('operationSetupAPIService', operationSetupAPIService);

	operationSetupAPIService.$inject = ['xpdAccessFactory', 'setupAPIService'];

	function operationSetupAPIService(xpdAccessFactory, setupAPIService) {

		var BASE_URL = xpdAccessFactory.getSetupURL() + 'setup/operation';

		var vm = this;

		vm.getDefaultFields = getDefaultFields;
		vm.getOperationAlarms = getOperationAlarms;
		// vm.getOperationReadings = getOperationReadings;
		vm.getOperationQueue = getOperationQueue;
		vm.getObjectById = getObjectById;
		vm.insertObject = insertObject;
		vm.updateObject = updateObject;
		vm.getList = getList;

		function getOperationAlarms(operationId, successCallback, errorCallback) {

			var req = {
				method: 'GET',
				url: BASE_URL + '/' + operationId + '/alarms'
			};

			setupAPIService.doRequest(req, successCallback, errorCallback);
		}

		function getObjectById(id, successCallback, errorCallback) {
			
			var req = {
				method: 'GET',
				url: BASE_URL + '/' + id
			};

			setupAPIService.doRequest(req, successCallback, errorCallback);
		}

		function getList(successCallback, errorCallback) {

			var req = {
				method: 'GET',
				url: BASE_URL + '/list'
			};

			setupAPIService.doRequest(req, successCallback, errorCallback);
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

			setupAPIService.doRequest(req, successCallback, errorCallback);

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

			setupAPIService.doRequest(req, successCallback, errorCallback);
		}

		function getDefaultFields(type, successCallback, errorCallback) {
			var req = {
				method: 'GET',
				url: BASE_URL + '/default?type=' + type,
				headers: {
					'Content-Type': 'application/json'
				}
			};

			setupAPIService.doRequest(req, successCallback, errorCallback);
		}

		// function getOperationReadings(operationId, successCallback, errorCallback) {

		// 	$http.get(BASE_URL + '/' + operationId + '/readings')
		// 		.then(
		// 			function (response) {
		// 				successCallback && successCallback(response.data.data);
		// 			},
		// 			function (error) {
		// 				setupAPIService.generateToast(error.data, true);
		// 				errorCallback && errorCallback(error);
		// 			}
		// 		);
		// }

		function getOperationQueue(wellId, successCallback, errorCallback) {
			
			var req = {
				method: 'GET',
				url: xpdAccessFactory.getSetupURL() + 'operation-resources/operations-queue/' + wellId
			};

			setupAPIService.doRequest(req, successCallback, errorCallback);			
		}
	}

})();
