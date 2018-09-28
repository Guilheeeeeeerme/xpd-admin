import { XPDAccessService } from '../xpd.access/access.service';
import { SetupAPIService } from './setupapi.service';

// (function() {
// 	'use strict';

// 	masterUserSetupAPIService.$inject = ['xpdAccessService', 'setupAPIService'];

export class MasterUserSetupAPIService {

	public static $inject: string[] = ['xpdAccessService', 'setupAPIService'];
	public MASTER_USERNAME: string;

	constructor(private xpdAccessService: XPDAccessService, private setupAPIService: SetupAPIService) {
		this.MASTER_USERNAME = 'admin';
	}

	public authenticate(object) {

		object.username = this.MASTER_USERNAME;

		const req = {
			method: 'POST',
			url: this.xpdAccessService.getSetupAPIURL() + 'setup/master-user/login',
			headers: {
				'Content-Type': 'application/json',
			},
			/*withCredentials: true,*/
			data: object,
		};

		return this.setupAPIService.doRequest(req);
	}

}

// })();
