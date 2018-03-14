(function () {
	'use strict';

	angular.module('xpd.setupapi').service('masterUserSetupAPIService', masterUserSetupAPIService);

	masterUserSetupAPIService.$inject = ['$http', 'xpdAccessFactory', 'setupAPIService'];

	function masterUserSetupAPIService($http, xpdAccessFactory, setupAPIService) {

		var MASTER_USERNAME = 'admin';

		var vm = this;

		vm.authenticate = authenticate;

		function authenticate(object, successCallback, errorCallback) {

			object.username = MASTER_USERNAME;

			var req = {
				method: 'POST',
				url: xpdAccessFactory.getSetupURL() + 'setup/master-user/login',
				headers: {
					'Content-Type': 'application/json'
				},
				/*withCredentials: true,*/
				data: object
			};

			$http(req).then(
	            function(response) {
	            	setupAPIService.generateToast(response.data, true);
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
