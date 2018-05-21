(function () {
	'use strict';

	angular.module('xpd.setupapi')
		.service('sectionSetupAPIService', sectionSetupAPIService);

	sectionSetupAPIService.$inject = ['xpdAccessFactory', 'setupAPIService'];

	function sectionSetupAPIService(xpdAccessFactory, setupAPIService) {

		var BASE_URL = xpdAccessFactory.getSetupURL() + 'setup/section';
		

		var vm = this;

		vm.getObjectById = getObjectById;
		vm.insertObject = insertObject;
		vm.updateObject = updateObject;
		vm.getListOfSectionsByWell = getListOfSectionsByWell;
		vm.getListOfOperationsBySection = getListOfOperationsBySection;

		function getObjectById(id, successCallback, errorCallback) {
				
			var req = {
				method: 'GET',
				url: BASE_URL + '/' + id
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

		function getListOfSectionsByWell(wellId, successCallback, errorCallback) {

			var url = BASE_URL + '/list-sections-by-well?wellId=' + wellId;

			var req = {
				method: 'GET',
				url: url
			};

			setupAPIService.doRequest(req, successCallback, errorCallback);

		}

		function getListOfOperationsBySection(sectionId, successCallback, errorCallback) {

			var url = BASE_URL + '/' + sectionId + '/operation';
			
			var req = {
				method: 'GET',
				url: url
			};

			setupAPIService.doRequest(req, successCallback, errorCallback);
		}

	}

})();
