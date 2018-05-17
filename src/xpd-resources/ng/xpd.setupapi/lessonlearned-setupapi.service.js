(function () {
	'use strict';

	angular.module('xpd.setupapi')
		.service('lessonLearnedSetupAPIService', lessonLearnedSetupAPIService);

	lessonLearnedSetupAPIService.$inject = ['$http', 'xpdAccessFactory', 'setupAPIService'];

	function lessonLearnedSetupAPIService($http, xpdAccessFactory, setupAPIService) {

		var BASE_URL = xpdAccessFactory.getSetupURL() + 'setup/lessonlearned';

		var vm = this;

		vm.insertObject = insertObject;
		vm.updateObject = updateObject;
		vm.listByOperation = listByOperation;
		vm.getList = getList;
		vm.removeObject = removeObject;
		vm.removeCategory = removeCategory;
		vm.updateCategory = updateCategory;
		vm.insertCategory = insertCategory;
		vm.getListCategory = getListCategory;

	
		function getList(successCallback, errorCallback) {

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

		function listByOperation(id, successCallback, errorCallback) {

			var url = BASE_URL + '/list-by-operation/' + id;

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

		function getListCategory(successCallback, errorCallback) {
			// lessonlearned_category

			$http.get( BASE_URL + '_category/list')
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

		function removeCategory(object, successCallback, errorCallback) {
			// lessonlearned_category

			var req = {
				method: 'PUT',
				url: BASE_URL + '_category/' + object.id,
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

		function insertCategory(object, successCallback, errorCallback) {
			// lessonlearned_category

			var req = {
				method: 'POST',
				url: BASE_URL + '_category',
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

		function updateCategory(object, successCallback, errorCallback) {
			// lessonlearned_category

			var req = {
				method: 'PUT',
				url: BASE_URL + '_category/' + object.id,
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
	}
})();
