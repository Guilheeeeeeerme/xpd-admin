(function () {
	'use strict';

	angular.module('xpd.setupapi')
		.service('categorySetupAPIService', categorySetupAPIService);

	categorySetupAPIService.$inject = ['xpdAccessFactory', 'setupAPIService'];

	function categorySetupAPIService(xpdAccessFactory, setupAPIService) {

		var BASE_URL = xpdAccessFactory.getSetupURL() + 'setup/category';

		var vm = this;

		vm.getList = getList;
		vm.insertObject = insertObject;
		vm.removeObject = removeObject;
		vm.updateObject = updateObject;
		vm.getCategoryName = getCategoryName;

		function getCategoryName(id, successCallback, errorCallback) {

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

	}

})();