(function () {
	'use strict';

	angular.module('xpd.setupapi')
		.service('alarmSetupAPIService', alarmSetupAPIService);

	alarmSetupAPIService.$inject = ['$http', 'xpdAccessFactory', 'setupAPIService'];

	function alarmSetupAPIService($http, xpdAccessFactory, setupAPIService) {

		var BASE_URL = xpdAccessFactory.getSetupURL() + 'setup/alarm';

		var vm = this;

		vm.updateArchive = updateArchive;
		vm.getByOperationType = getByOperationType;

		function updateArchive(id, archived, successCallback, errorCallback) {
			var req = {
				method: 'GET',
				url: BASE_URL + '/' + id + '/archive/' + archived
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

		function getByOperationType(type, butNot, successCallback, errorCallback) {

			var req = {
				method: 'GET',
				url: BASE_URL + '/of-operations/' + type + '/but-not-id/' + (butNot || 0)
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
