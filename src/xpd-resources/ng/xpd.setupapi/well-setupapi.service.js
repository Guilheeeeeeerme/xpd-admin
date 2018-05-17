(function () {
	'use strict';

	angular.module('xpd.setupapi')
		.service('wellSetupAPIService', wellSetupAPIService);


	wellSetupAPIService.$inject = ['$http', 'xpdAccessFactory', 'setupAPIService'];

	function wellSetupAPIService($http, xpdAccessFactory, setupAPIService) {

		var vm = this;

		vm.getListOfSectionsByWell = getListOfSectionsByWell;
		vm.getListOfOperationsBySection = getListOfOperationsBySection;
		vm.getObjectById = getObjectById;
		vm.insertObject = insertObject;
		vm.removeObject = removeObject;
		vm.updateObject = updateObject;
		vm.getList = getList;

		function insertObject(object, successCallback, errorCallback) {
			var modelURL = 'setup/well';

			var req = {
				method: 'POST',
				url: xpdAccessFactory.getSetupURL() + modelURL,
				headers: {
					'Content-Type': 'application/json'
				},
				data: object
			};

			$http(req).then(
				function (data) {
					successCallback && successCallback(data.data);
				},
				function (error) {
					setupAPIService.generateToast(error.data, true);
					errorCallback && errorCallback(error);
				}
			);

		}

		function removeObject(object, successCallback, errorCallback) {
			var modelURL = 'setup/well';

			var req = {
				method: 'DELETE',
				url: xpdAccessFactory.getSetupURL() + modelURL,
				headers: {
					'Content-Type': 'application/json'
				},
				data: object
			};

			$http(req).then(function (data) {
				successCallback && successCallback(data.data);
			}, function (error) {
				setupAPIService.generateToast(error.data, true);
				errorCallback && errorCallback(error);
			});
		}

		function updateObject(object, successCallback, errorCallback) {
			var modelURL = 'setup/well';

			var req = {
				method: 'PUT',
				url: xpdAccessFactory.getSetupURL() + modelURL + '/' + object.id,
				headers: {
					'Content-Type': 'application/json'
				},
				data: object
			};

			$http(req).then(
				function (data) {
					successCallback && successCallback(data.data);
				},
				function (error) {
					setupAPIService.generateToast(error.data, true);
					errorCallback && errorCallback(error);
				}
			);
		}

		function getList(successCallback, errorCallback) {
			var modelURL = 'setup/well';

			$http.get(xpdAccessFactory.getSetupURL() + modelURL + '/list')
				.then(
					function (data) {
						successCallback && successCallback(data.data);
					},
					function (error) {
						setupAPIService.generateToast(error.data, true);
						errorCallback && errorCallback(error);
					}
				);
		}

		function getObjectById(id, successCallback, errorCallback) {
			var modelURL = 'setup/well';

			$http.get(xpdAccessFactory.getSetupURL() + modelURL + '/' + id)
				.then(
					function (data) {
						successCallback && successCallback(data.data);
					},
					function (error) {
						setupAPIService.generateToast(error.data, true);
						errorCallback && errorCallback(error);
					}
				);
		}
		function getListOfSectionsByWell(wellId, successCallback, errorCallback) {

			var url = xpdAccessFactory.getSetupURL() + 'setup/section/list-sections-by-well?wellId=' + wellId;

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

			var url = xpdAccessFactory.getSetupURL() + 'setup/section/' + sectionId + '/operation';

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
