(function () {
	'use strict';

	angular.module('xpd.setupapi')
		.service('failureSetupAPIService', failureSetupAPIService);

	failureSetupAPIService.$inject = ['xpdAccessFactory', 'setupAPIService'];

	function failureSetupAPIService(xpdAccessFactory, setupAPIService) {

		var BASE_URL = xpdAccessFactory.getSetupURL() + 'setup/failure';

		var vm = this;

		vm.updateObject = updateObject;
		vm.getFailuresOnInterval = getFailuresOnInterval;
		vm.listByOperation = listByOperation;
		vm.listFailuresOnGoing = listFailuresOnGoing;
		vm.listFailures = listFailures;
		vm.removeObject = removeObject;

		function updateObject(failure, successCallback, errorCallback) {

			var req = {
				method: 'PUT',
				url: BASE_URL + '/' + failure.id,
				headers: {
					'Content-Type': 'application/json'
				},
				data: failure
			};

			setupAPIService.doRequest(req, successCallback, errorCallback);

		}

		function removeObject(object, successCallback, errorCallback) {

			var req = {
				method: 'DELETE',
				url: BASE_URL,
				headers: {
					'Content-Type': 'application/json'
				},
				data: object
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

		function getFailuresOnInterval(from, to, successCallback, errorCallback) {
			var url = BASE_URL + '/get-by-interval?from=' + from + '&to=' + to;

			var req = {
				method: 'GET',
				url: url
			};

			setupAPIService.doRequest(req, successCallback, errorCallback);
		}

		function listByOperation(id, successCallback, errorCallback) {
			var url = BASE_URL + '/list-by-operation/' + id;			

			var req = {
				method: 'GET',
				url: url
			};

			setupAPIService.doRequest(req, successCallback, errorCallback);
		}

		function listFailuresOnGoing(successCallback, errorCallback) {
			var url = BASE_URL + '/list-on-going';			

			var req = {
				method: 'GET',
				url: url
			};

			setupAPIService.doRequest(req, successCallback, errorCallback);
		}

		function listFailures(successCallback, errorCallback) {
			var url = BASE_URL + '/list';			

			var req = {
				method: 'GET',
				url: url
			};

			setupAPIService.doRequest(req, successCallback, errorCallback);
		}
	}

})();