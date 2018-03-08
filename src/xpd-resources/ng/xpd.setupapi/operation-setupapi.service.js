(function () {
	'use strict';

	angular.module('xpd.setupapi').service('operationSetupAPIService', operationSetupAPIService);

	operationSetupAPIService.$inject = ['$http', 'xpdAccessFactory', 'setupAPIService'];

	function operationSetupAPIService($http, xpdAccessFactory, setupAPIService) {

		var vm = this;

		vm.getDefaultFields = getDefaultFields;
		vm.getOperationAlarms = getOperationAlarms;
		vm.getOperationReadings = getOperationReadings;
		vm.getOperationQueue = getOperationQueue;

		function getDefaultFields(type, successCallback, errorCallback) {
			var req = {
				method: 'GET',
				url: xpdAccessFactory.getSetupURL() + 'setup/operation/default?type=' + type,
				headers: {
					'Content-Type': 'application/json'
				}
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

		function getOperationAlarms(operationId, successCallback, errorCallback) {

			$http.get(xpdAccessFactory.getSetupURL() + 'setup/operation/'+operationId+'/alarms')
            	.then(
	            function(response) {
	                successCallback && successCallback(response.data.data);
	            },
	            function(error){
	            	setupAPIService.generateToast(error.data, true);
	                errorCallback && errorCallback(error);
            	}
				);
		}

		function getOperationReadings(operationId, successCallback, errorCallback) {

			$http.get(xpdAccessFactory.getSetupURL() + 'setup/operation/'+operationId+'/readings')
            	.then(
	            function(response) {
	                successCallback && successCallback(response.data.data);
	            },
	            function(error){
						setupAPIService.generateToast(error.data, true);
	                errorCallback && errorCallback(error);
            	}
				);
		}

		function getOperationQueue(wellId, successCallback, errorCallback) {
			$http.get(xpdAccessFactory.getSetupURL() + 'report-service/operations-queue/' + wellId)
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
