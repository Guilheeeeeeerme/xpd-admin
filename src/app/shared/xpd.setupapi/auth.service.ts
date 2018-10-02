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
		sessionStorage.removeItem(AuthService.OS_TOKEN);
		sessionStorage.removeItem(AuthService.RS_TOKEN);
		AuthService.redirectToPath('/auth.html#', false);
	}

	public static skipAuth() {
		if (sessionStorage.getItem('redirectTo')) {
			const href = sessionStorage.getItem('redirectTo');
			sessionStorage.removeItem('redirectTo');
			location.href = href;
		} else {
			AuthService.redirectToPath('/admin.html#', false);
		}
	}

	public static redirectToPath(path: any, newTab: any): any {

		if (window.location.href.indexOf('auth.html') < 0) {
			sessionStorage.setItem('redirectTo', window.location.href);
		}

		if (location.port) {
			path = 'https://' + location.hostname + ':' + location.port + path;
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

		const operationServerPromise = this.setupAPIService.doRequest(operationServerRequest, true);
		const reportsServerPromise = this.setupAPIService.doRequest(reportsServerRequest, true);

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

	public register(user?: any) {

		const operationServerRequest = {
			method: 'POST',
			url: this.xpdAccessService.getOperationServerURL() + '/auth/register',
			data: user,
		};

		const operationServerPromise = this.setupAPIService.doRequest(operationServerRequest, true);

		operationServerPromise.then((data: any) => {
			sessionStorage.setItem(AuthService.OS_TOKEN, data.token);
		});

		return this.$q.all([
			operationServerPromise,
		]);

	}

}

// })();
