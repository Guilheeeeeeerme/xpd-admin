import { XPDAccessService } from '../xpd.access/access.service';
import { SetupAPIService } from './setupapi.service';

// (function() {
// 	'use strict';

// 		.service('wellSetupAPIService', wellSetupAPIService);

// 	wellSetupAPIService.$inject = ['xpdAccessService', 'setupAPIService'];

const STORAGE_TYPE = localStorage;

export class AuthService {

	public static $inject: string[] = ['$q', 'xpdAccessService', 'setupAPIService'];

	public static OS_TOKEN = 'operationServerToken';
	public static RS_TOKEN = 'reportsServerToken';

	public static logout() {
		STORAGE_TYPE.removeItem(AuthService.OS_TOKEN);
		STORAGE_TYPE.removeItem(AuthService.RS_TOKEN);
		AuthService.redirectToPath('/auth.html#', false);
	}

	public static skipAuth() {
		if (STORAGE_TYPE.getItem('redirectTo')) {
			const href = STORAGE_TYPE.getItem('redirectTo');
			STORAGE_TYPE.removeItem('redirectTo');
			location.href = href;
		} else {
			AuthService.redirectToPath('/admin.html#', false);
		}
	}

	public static redirectToPath(path: any, newTab: any): any {

		if (window.location.href.indexOf('auth.html') < 0) {
			STORAGE_TYPE.setItem('redirectTo', window.location.href);
		}

		if (location.port) {
			// path = 'https://' + location.hostname + ':' + location.port + path;
			// path = 'http://' + location.hostname + ':' + location.port + path;
			path = location.origin + path;
		} else {
			for (const page of ['auth.html', 'setup.html', 'admin.html', 'dmec-log.html', 'reports.html']) {
				if (window.location.href.indexOf(page) >= 0) {
					path = window.location.href.slice(0, (window.location.href.indexOf(page) - 1)) + path;
					break;
				}
			}
		}

		// console.log(path);
		// console.log(location);

		// debugger;

		if (newTab === true) {
			window.open(path);
		} else {
			window.location.href = path;
		}
	}

	public static isLogged() {
		return STORAGE_TYPE.getItem(AuthService.OS_TOKEN) && STORAGE_TYPE.getItem(AuthService.RS_TOKEN);
	}

	public static getOperationServerToken() {
		return STORAGE_TYPE.getItem(AuthService.OS_TOKEN);
	}

	public static getReportsAPIToken() {
		return STORAGE_TYPE.getItem(AuthService.RS_TOKEN);
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

		// console.log('operationServerRequest', operationServerRequest);
		// console.log('reportsServerRequest', reportsServerRequest);

		const operationServerPromise = this.setupAPIService.doRequest(operationServerRequest, true);
		const reportsServerPromise = this.setupAPIService.doRequest(reportsServerRequest, true);

		operationServerPromise.then((data: any) => {
			// console.log(AuthService.OS_TOKEN, data.token)
			STORAGE_TYPE.setItem(AuthService.OS_TOKEN, data.token);
		}, (error) => error );

		reportsServerPromise.then((data: any) => {
			// console.log(AuthService.RS_TOKEN, data.token)
			STORAGE_TYPE.setItem(AuthService.RS_TOKEN, data.token);
		});

		return this.$q.all([
			operationServerPromise,
			reportsServerPromise,
		]);

	}

	public register(user?: any) {

		const operationServerRequest = {
			method: 'POST',
			url: this.xpdAccessService.getOperationServerURL() + '/auth/register',
			data: user,
		};

		const operationServerPromise = this.setupAPIService.doRequest(operationServerRequest, true);

		operationServerPromise.then((data: any) => {
			STORAGE_TYPE.setItem(AuthService.OS_TOKEN, data.token);
		});

		return this.$q.all([
			operationServerPromise,
		]);

	}

}

// })();
