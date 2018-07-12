// (function() {
// 	'use strict';

// 	angular.module('xpd.setupapi').service('adminUserSetupAPIService', adminUserSetupAPIService);

// 	adminUserSetupAPIService.$inject = ['xpdAccessFactory', 'setupAPIService'];

	export class AdminUserSetupAPIService {

		public static $inject: string[] = ['xpdAccessFactory', 'setupAPIService'];
		public BASE_URL: string;

		constructor(private xpdAccessFactory: XPDAccessFactory, private setupAPIService: SetupAPIService) {
			this.BASE_URL = xpdAccessFactory.getSetupURL() + 'setup/admin-user';
		}

		public authenticate(loginInfo, successCallback, errorCallback) {

			const req = {
				method: 'POST',
				url: this.BASE_URL + '/login',
				headers: {
					'Content-Type': 'application/json',
				},
				data: loginInfo,
			};

			this.setupAPIService.doRequest(req, successCallback, errorCallback);
		}

	}

// })();
