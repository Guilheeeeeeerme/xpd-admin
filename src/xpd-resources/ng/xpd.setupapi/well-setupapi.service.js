(function () {
	'use strict';

	angular.module('xpd.setupapi')
		.service('wellSetupAPIService', wellSetupAPIService);


	wellSetupAPIService.$inject = ['$http', 'xpdAccessFactory','setupAPIService'];

	function wellSetupAPIService($http, xpdAccessFactory, setupAPIService) {

		var vm = this;

		vm.getListOfSectionsByWell = getListOfSectionsByWell;
		vm.getListOfOperationsBySection = getListOfOperationsBySection;

		function getListOfSectionsByWell(wellId, successCallback, errorCallback) {

			var url = xpdAccessFactory.getSetupURL() + 'setup/section/list-sections-by-well?wellId=' + wellId;

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

		function getListOfOperationsBySection(sectionId, successCallback, errorCallback) {

			var url = xpdAccessFactory.getSetupURL() + 'setup/section/' + sectionId + '/operation';

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
