(function () {
	'use strict';

	angular.module('xpd.setupapi')
		.service('lessonLearnedSetupAPIService', lessonLearnedSetupAPIService);

	lessonLearnedSetupAPIService.$inject = ['xpdAccessFactory', 'setupAPIService'];

	function lessonLearnedSetupAPIService(xpdAccessFactory, setupAPIService) {

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

			var req = {
				method: 'GET',
				url: url
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
				method: 'PUT',
				url: BASE_URL + '/' + object.id,
				headers: {
					'Content-Type': 'application/json'
				},
				data: object
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

		function getListCategory(successCallback, errorCallback) {
			// lessonlearned_category

			var req = {
				method: 'GET',
				url: BASE_URL + '_category/list'
			};

			setupAPIService.doRequest(req, successCallback, errorCallback);
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
			
			setupAPIService.doRequest(req, successCallback, errorCallback);

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
			
			setupAPIService.doRequest(req, successCallback, errorCallback);

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

			setupAPIService.doRequest(req, successCallback, errorCallback);


		}
	}
})();
