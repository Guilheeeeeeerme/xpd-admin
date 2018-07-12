(function() {
	'use strict';

	angular.module('xpd.setupapi')
		.service('lessonLearnedSetupAPIService', lessonLearnedSetupAPIService);

	lessonLearnedSetupAPIService.$inject = ['xpdAccessFactory', 'setupAPIService'];

	function lessonLearnedSetupAPIService(xpdAccessFactory, setupAPIService) {

		const BASE_URL = xpdAccessFactory.getSetupURL() + 'setup/lessonlearned';

		const vm = this;

		vm.insertObject = insertObject;
		vm.updateObject = updateObject;
		// vm.listByOperation = listByOperation;
		vm.getList = getList;
		vm.removeObject = removeObject;
		vm.removeCategory = removeCategory;
		vm.updateCategory = updateCategory;
		vm.insertCategory = insertCategory;
		vm.getListCategory = getListCategory;

		function getList(successCallback, errorCallback) {

			const url = BASE_URL + '/list';

			const req = {
				method: 'GET',
				url,
			};

			setupAPIService.doRequest(req, successCallback, errorCallback);
		}

		function updateObject(object, successCallback, errorCallback) {

			const req = {
				method: 'PUT',
				url: BASE_URL + '/' + object.id,
				headers: {
					'Content-Type': 'application/json',
				},
				data: object,
			};

			setupAPIService.doRequest(req, successCallback, errorCallback);
		}

		function insertObject(object, successCallback, errorCallback) {

			const req = {
				method: 'POST',
				url: BASE_URL,
				headers: {
					'Content-Type': 'application/json',
				},
				data: object,
			};

			setupAPIService.doRequest(req, successCallback, errorCallback);

		}

		function removeObject(object, successCallback, errorCallback) {

			const req = {
				method: 'DELETE',
				url: BASE_URL,
				headers: {
					'Content-Type': 'application/json',
				},
				data: object,
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

		function getListCategory(successCallback, errorCallback) {
			// lessonlearned_category

			const req = {
				method: 'GET',
				url: BASE_URL + '_category/list',
			};

			setupAPIService.doRequest(req, successCallback, errorCallback);
		}

		function removeCategory(object, successCallback, errorCallback) {
			// lessonlearned_category

			const req = {
				method: 'DELETE',
				url: BASE_URL + '_category',
				headers: {
					'Content-Type': 'application/json',
				},
				data: object,
			};

			setupAPIService.doRequest(req, successCallback, errorCallback);

		}

		function insertCategory(object, successCallback, errorCallback) {
			// lessonlearned_category

			const req = {
				method: 'POST',
				url: BASE_URL + '_category',
				headers: {
					'Content-Type': 'application/json',
				},
				data: object,
			};

			setupAPIService.doRequest(req, successCallback, errorCallback);

		}

		function updateCategory(object, successCallback, errorCallback) {
			// lessonlearned_category

			const req = {
				method: 'PUT',
				url: BASE_URL + '_category/' + object.id,
				headers: {
					'Content-Type': 'application/json',
				},
				data: object,
			};

			setupAPIService.doRequest(req, successCallback, errorCallback);

		}
	}
})();
