(function () {
	'use strict';

	angular.module('xpd.setupapi')
		.service('failureSetupAPIService', failureSetupAPIService);

	failureSetupAPIService.$inject = ['$http', 'xpdAccessFactory', 'setupAPIService'];

	function failureSetupAPIService($http, xpdAccessFactory, setupAPIService) {

		var BASE_URL = xpdAccessFactory.getSetupURL() + 'setup/failure';
		

		var vm = this;

		vm.insertObject = insertObject;
		vm.updateObject = updateObject;
		vm.getFailuresOnInterval = getFailuresOnInterval;
		// vm.listByOperation = listByOperation;
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

		function removeObject(object, successCallback, errorCallback) {

			var req = {
				method: 'DELETE',
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

		function getFailuresOnInterval(from, to, successCallback, errorCallback) {

			var url = BASE_URL + '/get-by-interval?from=' + from + '&to=' + to;

			$http.get(url)
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
			var url = BASE_URL + '/list-on-going';

			$http.get(url)
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

		function listFailures(successCallback, errorCallback) {
			var url = BASE_URL + '/list';

			$http.get(url)
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