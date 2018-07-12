(function() {
	'use strict';

	angular.module('xpd.setupapi')
		.service('sectionSetupAPIService', sectionSetupAPIService);

	sectionSetupAPIService.$inject = ['xpdAccessFactory', 'setupAPIService'];

	function sectionSetupAPIService(xpdAccessFactory, setupAPIService) {

		const BASE_URL = xpdAccessFactory.getSetupURL() + 'setup/section';

		const vm = this;

		vm.getObjectById = getObjectById;
		vm.insertObject = insertObject;
		vm.updateObject = updateObject;
		vm.getListOfSectionsByWell = getListOfSectionsByWell;
		vm.getListOfOperationsBySection = getListOfOperationsBySection;

		function getObjectById(id, successCallback, errorCallback) {

			const req = {
				method: 'GET',
				url: BASE_URL + '/' + id,
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

		function getListOfSectionsByWell(wellId, successCallback, errorCallback) {

			const url = BASE_URL + '/list-sections-by-well?wellId=' + wellId;

			const req = {
				method: 'GET',
				url,
			};

			setupAPIService.doRequest(req, successCallback, errorCallback);

		}

		function getListOfOperationsBySection(sectionId, successCallback, errorCallback) {

			const url = BASE_URL + '/' + sectionId + '/operation';

			const req = {
				method: 'GET',
				url,
			};

			setupAPIService.doRequest(req, successCallback, errorCallback);
		}

	}

})();
