(function () {
	'use strict';

	angular.module('xpd.setupapi')
		.service('failureSetupAPIService', failureSetupAPIService);

	failureSetupAPIService.$inject = ['$http', 'xpdAccessFactory', 'setupAPIService'];

	function failureSetupAPIService($http, xpdAccessFactory, setupAPIService) {
		
		var vm = this;

		vm.getFailuresOnInterval = getFailuresOnInterval;
		vm.listByOperation = listByOperation;
		vm.listFailuresOnGoing = listFailuresOnGoing;
		vm.getCategoryName = getCategoryName;
		vm.listFailures = listFailures;

		function getFailuresOnInterval(from, to, successCallback, errorCallback) {

			var url = xpdAccessFactory.getSetupURL() + 'setup/failure/get-by-interval?';
			url += 'from=' + from;
			url += '&to=' + to;

			$http.get(url)
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

		function listByOperation(id, successCallback, errorCallback) {

			var url = xpdAccessFactory.getSetupURL() + 'setup/failure/list-by-operation/' + id;

			$http.get(url)
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

		function listFailuresOnGoing(successCallback){
			var url = xpdAccessFactory.getSetupURL() + 'setup/failure/list-on-going';

			$http.get(url)
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

		function getCategoryName(id, successCallback, errorCallback){
			var url = xpdAccessFactory.getSetupURL() + 'setup/category/' + id;

			$http.get(url)
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

		function listFailures(successCallback){
			var url = xpdAccessFactory.getSetupURL() + 'setup/failure/list';

			$http.get(url)
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
	}

})();