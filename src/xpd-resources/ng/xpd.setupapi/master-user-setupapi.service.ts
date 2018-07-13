import { XPDAccessFactory } from '../xpd.access/accessfactory.factory';
import { SetupAPIService } from './setupapi.service';

// (function() {
// 	'use strict';

// 	angular.module('xpd.setupapi').service('masterUserSetupAPIService', masterUserSetupAPIService);

// 	masterUserSetupAPIService.$inject = ['xpdAccessFactory', 'setupAPIService'];

export class MasterUserSetupAPIService {

	public static $inject: string[] = ['xpdAccessFactory', 'setupAPIService'];
	public MASTER_USERNAME: string;

	constructor(private xpdAccessFactory: XPDAccessFactory, private setupAPIService: SetupAPIService) {
		this.MASTER_USERNAME = 'admin';
	}

	public authenticate(object, successCallback, errorCallback) {

		object.username = this.MASTER_USERNAME;

		const req = {
			method: 'POST',
			url: this.xpdAccessFactory.getSetupURL() + 'setup/master-user/login',
			headers: {
				'Content-Type': 'application/json',
			},
			/*withCredentials: true,*/
			data: object,
		};

		this.setupAPIService.doRequest(req, successCallback, errorCallback);
	}

}

// })();
