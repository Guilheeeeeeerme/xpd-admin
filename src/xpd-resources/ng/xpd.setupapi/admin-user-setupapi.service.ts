(function() {
	'use strict';

	angular.module('xpd.setupapi').service('adminUserSetupAPIService', adminUserSetupAPIService);

	adminUserSetupAPIService.$inject = ['xpdAccessFactory', 'setupAPIService'];

	function adminUserSetupAPIService(xpdAccessFactory, setupAPIService) {

		const BASE_URL = xpdAccessFactory.getSetupURL() + 'setup/admin-user';

		const vm = this;

		vm.authenticate = authenticate;

		function authenticate(loginInfo, successCallback, errorCallback) {

			const req = {
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
