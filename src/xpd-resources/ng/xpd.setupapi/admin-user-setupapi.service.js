(function () {
	'use strict';

	angular.module('xpd.setupapi').service('adminUserSetupAPIService', adminUserSetupAPIService);

	adminUserSetupAPIService.$inject = ['$http', 'xpdAccessFactory'];

	function adminUserSetupAPIService($http, xpdAccessFactory) {

		var BASE_URL = xpdAccessFactory.getSetupURL() + 'setup/admin-user';

		var vm = this;

		vm.authenticate = authenticate;

		function authenticate(loginInfo, successCallback, errorCallback) {

			var req = {
				method: 'POST',
				url: BASE_URL + '/login',
				headers: {
					'Content-Type': 'application/json'
				},
				data: loginInfo
			};

			$http(req).then(
	            function(response) {
	                successCallback && successCallback(response.data.data);
	            },
	            function(error){
	                errorCallback && errorCallback(error);
            	}
			);
		}

	}

})();
