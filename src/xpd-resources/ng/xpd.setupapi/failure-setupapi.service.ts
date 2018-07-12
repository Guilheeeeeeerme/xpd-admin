(function() {
	'use strict';

	angular.module('xpd.setupapi')
		.service('failureSetupAPIService', failureSetupAPIService);

	failureSetupAPIService.$inject = ['xpdAccessFactory', 'setupAPIService'];

	function failureSetupAPIService(xpdAccessFactory, setupAPIService) {

		let BASE_URL = xpdAccessFactory.getSetupURL() + 'setup/failure';

		let vm = this;

		vm.insertObject = insertObject;
		vm.updateObject = updateObject;
		vm.getFailuresOnInterval = getFailuresOnInterval;
		// vm.listByOperation = listByOperation;
		vm.listFailuresOnGoing = listFailuresOnGoing;
		vm.listFailures = listFailures;
		vm.removeObject = removeObject;

		function updateObject(failure, successCallback, errorCallback) {

			let req = {
				method: 'PUT',
				url: BASE_URL + '/' + failure.id,
				headers: {
					'Content-Type': 'application/json',
				},
				data: failure,
			};

			setupAPIService.doRequest(req, successCallback, errorCallback);

		}

		function removeObject(object, successCallback, errorCallback) {

			let req = {
				method: 'DELETE',
				url: BASE_URL,
				headers: {
					'Content-Type': 'application/json',
				},
				data: object,
			};

			setupAPIService.doRequest(req, successCallback, errorCallback);
		}

		function insertObject(object, successCallback, errorCallback) {

			let req = {
				method: 'POST',
				url: BASE_URL,
				headers: {
					'Content-Type': 'application/json',
				},
				data: object,
			};

			setupAPIService.doRequest(req, successCallback, errorCallback);

		}

		function getFailuresOnInterval(from, to, successCallback, errorCallback) {
			let url = BASE_URL + '/get-by-interval?from=' + from + '&to=' + to;

			let req = {
				method: 'GET',
				url,
			};

			setupAPIService.doRequest(req, successCallback, errorCallback);
		}

		// function listByOperation(id, successCallback, errorCallback) {

		// 	var url = BASE_URL + '/list-by-operation/' + id;

		// 	$http.get(url)
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

		function listFailuresOnGoing(successCallback, errorCallback) {
			let url = BASE_URL + '/list-on-going';

			let req = {
				method: 'GET',
				url,
			};

			setupAPIService.doRequest(req, successCallback, errorCallback);
		}

		function listFailures(successCallback, errorCallback) {
			let url = BASE_URL + '/list';

			let req = {
				method: 'GET',
				url,
			};

			setupAPIService.doRequest(req, successCallback, errorCallback);
		}
	}

})();
