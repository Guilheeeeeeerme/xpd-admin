import { XPDAccessService } from '../xpd.access/access.service';
import { SetupAPIService } from './setupapi.service';

// (function() {
// 	'use strict';

// 		.service('wellSetupAPIService', wellSetupAPIService);

// 	wellSetupAPIService.$inject = ['xpdAccessService', 'setupAPIService'];

export class AuthService {

	public static $inject: string[] = ['$q', 'xpdAccessService', 'setupAPIService'];

	public static OS_TOKEN = 'operationServerToken';
	public static RS_TOKEN = 'reportsServerToken';

	public static logout() {
		sessionStorage.clear();
		location.href = '/auth.html#';
	}

	public static isLogged() {
		return sessionStorage.getItem(AuthService.OS_TOKEN) && sessionStorage.getItem(AuthService.RS_TOKEN);
	}

	public static getOperationServerToken() {
		return sessionStorage.getItem(AuthService.OS_TOKEN);
	}

	public static getReportsAPIToken() {
		return sessionStorage.getItem(AuthService.RS_TOKEN);
	}

	constructor(
		private $q: any,
		private xpdAccessService: XPDAccessService,
		private setupAPIService: SetupAPIService) {
	}

	public login(user?: any) {

		const operationServerRequest = {
			method: 'POST',
			url: this.xpdAccessService.getOperationServerURL() + '/auth/login',
			data: user,
		};

		const reportsServerRequest = {
			method: 'POST',
			url: this.xpdAccessService.getRawReportsAPIURL() + '/auth/login',
			data: user,
		};

		const operationServerPromise = this.setupAPIService.doRequest(operationServerRequest);
		const reportsServerPromise = this.setupAPIService.doRequest(reportsServerRequest);

		operationServerPromise.then((data: any) => {
			sessionStorage.setItem(AuthService.OS_TOKEN, data.token);
		});

		reportsServerPromise.then((data: any) => {
			sessionStorage.setItem(AuthService.RS_TOKEN, data.token);
		});

		return this.$q.all([
			operationServerPromise,
			reportsServerPromise,
		]);

	}

	public registerToOperationServer(user?: any) {

		const req = {
			method: 'POST',
			url: this.xpdAccessService.getOperationServerURL() + '/auth/register',
			data: user,
		};

		return this.setupAPIService.doRequest(req);

	}

}

// })();
