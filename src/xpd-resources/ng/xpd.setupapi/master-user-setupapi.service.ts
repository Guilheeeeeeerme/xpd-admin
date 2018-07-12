(function() {
	'use strict';

	angular.module('xpd.setupapi').service('masterUserSetupAPIService', masterUserSetupAPIService);

	masterUserSetupAPIService.$inject = ['xpdAccessFactory', 'setupAPIService'];

	function masterUserSetupAPIService(xpdAccessFactory, setupAPIService) {

		let MASTER_USERNAME = 'admin';

		let vm = this;

		vm.authenticate = authenticate;

		function authenticate(object, successCallback, errorCallback) {

			object.username = MASTER_USERNAME;

			let req = {
				method: 'POST',
				url: xpdAccessFactory.getSetupURL() + 'setup/master-user/login',
				headers: {
					'Content-Type': 'application/json',
				},
				/*withCredentials: true,*/
				data: object,
			};

			setupAPIService.doRequest(req, successCallback, errorCallback);
		}

	}

})();
