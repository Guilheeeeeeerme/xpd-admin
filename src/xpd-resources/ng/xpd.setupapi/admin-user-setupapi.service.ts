import { XPDAccessService } from '../xpd.access/access.service';
import { SetupAPIService } from './setupapi.service';

// (function() {
// 	'use strict';

// 	angular.module('xpd.setupapi').service('adminUserSetupAPIService', adminUserSetupAPIService);

// 	adminUserSetupAPIService.$inject = ['xpdAccessService', 'setupAPIService'];

export class AdminUserSetupAPIService {

	public static $inject: string[] = ['xpdAccessService', 'setupAPIService'];
	public BASE_URL: string;

	constructor(private xpdAccessService: XPDAccessService, private setupAPIService: SetupAPIService) {
		this.BASE_URL = xpdAccessService.getSetupURL() + 'setup/admin-user';
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
