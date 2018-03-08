(function() {
	'use strict';

	angular.module('xpd.setupapi')
		.service('alarmSetupAPIService', alarmSetupAPIService);

	alarmSetupAPIService.$inject = ['$http', 'xpdAccessFactory', 'setupAPIService'];

	function alarmSetupAPIService($http, xpdAccessFactory, setupAPIService) {

		var vm = this;
		var apiUrl = xpdAccessFactory.getSetupURL();

		vm.updateArchive = updateArchive;
		vm.listByType = listByType;

		function updateArchive(id, archived, successCallback, errorCallback) {
			var req = {
				method: 'GET',
				url: apiUrl + 'setup/alarm/' + id + '/archive/' + archived
			};
			$http(req).then(
	            function(response) {
	                successCallback && successCallback(response.data.data);
	            },
	            function(error){
	            	setupAPIService.generateToast(error.data, true);
	                errorCallback && errorCallback(error);
            	}
			);
		}

		function listByType(type, id, successCallback, errorCallback) {

			var req = {
				method: 'GET',
				url: apiUrl + 'setup/alarm/of-operations/' + type + '/but-not-id/' + (id || 0)
			};
			$http(req).then(
	            function(response) {
	                successCallback && successCallback(response.data.data);
	            },
	            function(error){
	            	setupAPIService.generateToast(error.data, true);
	                errorCallback && errorCallback(error);
            	}
			);
		}
	}

})();
