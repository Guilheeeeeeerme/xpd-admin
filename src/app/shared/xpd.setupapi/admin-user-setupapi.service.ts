import { XPDAccessService } from '../xpd.access/access.service';
import { SetupAPIService } from './setupapi.service';

// (function() {
// 	'use strict';

// 	adminUserSetupAPIService.$inject = ['xpdAccessService', 'setupAPIService'];

export class AdminUserSetupAPIService {

	public static $inject: string[] = ['xpdAccessService', 'setupAPIService'];
	public BASE_URL: string;

	constructor(private xpdAccessService: XPDAccessService, private setupAPIService: SetupAPIService) {
		this.BASE_URL = xpdAccessService.getSetupAPIURL() + 'setup/admin-user';
	}

	public authenticate(loginInfo) {

		const req = {
			method: 'POST',
			url: this.BASE_URL + '/login',
			headers: {
				'Content-Type': 'application/json',
			},
			data: loginInfo,
		};

		return this.setupAPIService.doRequest(req);
	}

}

// })();
