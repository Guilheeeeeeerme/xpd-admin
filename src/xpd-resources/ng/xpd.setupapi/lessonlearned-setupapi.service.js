(function () {
	'use strict';

	angular.module('xpd.setupapi')
		.service('lessonLearnedSetupAPIService', lessonLearnedSetupAPIService);

	lessonLearnedSetupAPIService.$inject = ['$http', 'xpdAccessFactory', 'setupAPIService'];

	function lessonLearnedSetupAPIService($http, xpdAccessFactory, setupAPIService) {
		
		var vm = this;

		vm.listByOperation = listByOperation;
		vm.list = list;

		function listByOperation(id, successCallback, errorCallback) {

			var url = xpdAccessFactory.getSetupURL() + 'setup/lessonlearned/list-by-operation/' + id;

			$http.get(url)
            	.then(
	            function(response) {
	                successCallback && successCallback(response.data.data);	                
	            },
	            function(error){
	            	generateToast(error.data, true);
	                errorCallback && errorCallback(error);
            	}
				);
		}

		function list(successCallback, errorCallback) {

			var url = xpdAccessFactory.getSetupURL() + 'setup/lessonlearned/list';

			$http.get(url)
            	.then(
	            function(response) {
	                successCallback && successCallback(response.data.data);	                
	            },
	            function(error){
	            	generateToast(error.data, true);
	                errorCallback && errorCallback(error);
            	}
				);
		}
	}
})();
