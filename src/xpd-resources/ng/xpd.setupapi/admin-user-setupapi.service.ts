(function() {
	'use strict';

	angular.module('xpd.setupapi').service('adminUserSetupAPIService', adminUserSetupAPIService);

	adminUserSetupAPIService.$inject = ['xpdAccessFactory', 'setupAPIService'];

	function adminUserSetupAPIService(xpdAccessFactory, setupAPIService) {

		let BASE_URL = xpdAccessFactory.getSetupURL() + 'setup/admin-user';

		let vm = this;

		vm.authenticate = authenticate;

		function authenticate(loginInfo, successCallback, errorCallback) {

			let req = {
				method: 'POST',
				url: BASE_URL + '/login',
				headers: {
					'Content-Type': 'application/json',
				},
				data: loginInfo,
			};

			setupAPIService.doRequest(req, successCallback, errorCallback);
		}

	}

})();
