(function () {
	'use strict';

	angular.module('xpd.setupapi')
		.service('wellSetupAPIService', wellSetupAPIService);


	wellSetupAPIService.$inject = ['$http', 'xpdAccessFactory', 'setupAPIService'];

	function wellSetupAPIService($http, xpdAccessFactory, setupAPIService) {
		var BASE_URL = xpdAccessFactory.getSetupURL() + 'setup/well';

		var vm = this;

		vm.getObjectById = getObjectById;
		vm.insertObject = insertObject;
		vm.removeObject = removeObject;
		vm.updateObject = updateObject;
		vm.getList = getList;

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

		function removeObject(object, successCallback, errorCallback) {

			var req = {
				method: 'DELETE',
				url: BASE_URL,
				headers: {
					'Content-Type': 'application/json'
				},
				data: object
			};

			$http(req).then(function (response) {
				successCallback && successCallback(response.data.data);
			}, function (error) {
				setupAPIService.generateToast(error.data, true);
				errorCallback && errorCallback(error);
			});
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

	}

})();
