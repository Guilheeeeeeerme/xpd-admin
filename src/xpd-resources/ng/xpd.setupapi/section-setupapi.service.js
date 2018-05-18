(function () {
	'use strict';

	angular.module('xpd.setupapi')
		.service('sectionSetupAPIService', sectionSetupAPIService);

	sectionSetupAPIService.$inject = ['$http', 'xpdAccessFactory', 'setupAPIService'];

	function sectionSetupAPIService($http, xpdAccessFactory, setupAPIService) {

		var BASE_URL = xpdAccessFactory.getSetupURL() + 'setup/section';

		var vm = this;

		vm.getObjectById = getObjectById;
		vm.insertObject = insertObject;
		vm.updateObject = updateObject;
		vm.getListOfSectionsByWell = getListOfSectionsByWell;
		vm.getListOfOperationsBySection = getListOfOperationsBySection;

		function getObjectById(id, successCallback, errorCallback) {

			$http.get( BASE_URL + '/' + id)
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

		function getListOfSectionsByWell(wellId, successCallback, errorCallback) {

			var url = BASE_URL + '/list-sections-by-well?wellId=' + wellId;

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

		function getListOfOperationsBySection(sectionId, successCallback, errorCallback) {

			var url = BASE_URL + '/' + sectionId + '/operation';

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
