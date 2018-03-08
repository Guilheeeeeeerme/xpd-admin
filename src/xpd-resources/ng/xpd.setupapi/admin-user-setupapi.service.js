(function () {
	'use strict';

	angular.module('xpd.setupapi').service('adminUserSetupAPIService', adminUserSetupAPIService);

	adminUserSetupAPIService.$inject = ['$http', 'xpdAccessFactory', 'setupAPIService'];

	function adminUserSetupAPIService($http, xpdAccessFactory, setupAPIService) {

		var vm = this;

		vm.authenticate = authenticate;

		function authenticate(object, successCallback, errorCallback) {

			var req = {
				method: 'POST',
				url: xpdAccessFactory.getSetupURL() + 'setup/admin-user/login',
				headers: {
					'Content-Type': 'application/json'
				},
				data: object
			};

			$http(req).then(
	            function(data) {
	            	setupAPIService.generateToast(data.data, false);
	                successCallback && successCallback(data.data);
	            },
	            function(error){
	            	setupAPIService.generateToast(error.data, true);
	                errorCallback && errorCallback(error);
            	}
			);
		}

	}

})();
