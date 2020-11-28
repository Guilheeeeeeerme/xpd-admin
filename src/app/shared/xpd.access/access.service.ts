// (function() {
// 	'use strict';

// 	angular
// 		.module('xpd.accessfactory')
// 		.factory('xpdAccessService', xpdAccessService);

// 	xpdAccessService.$inject = [];

/* @ngInject */
export class XPDAccessService {

	public static $inject: string[] = [];
	private server: any;

	constructor() {
		this.loadAccessData();
	}

	public loadAccessData() {
		let XPDAccessData;

		// 	tem algo no local storage?
		if (localStorage.getItem('xpd.admin.XPDAccessData')) {
			XPDAccessData = JSON.parse(localStorage.getItem('xpd.admin.XPDAccessData'));
		}

		// 	checando se tem os campos necessários
		if (!XPDAccessData || !XPDAccessData.server) {

			console.log('Criando Access Data Default !!!');

			XPDAccessData = {
				server: {
					xpdDefaultAccessIp: 'http://127.0.0.1',
					xpdDefaultOperationServerPort: '8081',
					xpdDefaultReportsAPIPort: '8082',
					xpdDefaultSetupApiPort: '8080',
				},
			};
		}

		// colocando valores default
		XPDAccessData.server.xpdDefaultAccessIp = XPDAccessData.server.xpdDefaultAccessIp || 'http://127.0.0.1';
		XPDAccessData.server.xpdDefaultReportsAPIAccessIp = XPDAccessData.server.xpdDefaultReportsAPIAccessIp || XPDAccessData.server.xpdDefaultAccessIp;
		XPDAccessData.server.xpdDefaultSetupAPIAccessIp = XPDAccessData.server.xpdDefaultSetupAPIAccessIp || XPDAccessData.server.xpdDefaultAccessIp;

		XPDAccessData.server.xpdDefaultOperationServerPort = XPDAccessData.server.xpdDefaultOperationServerPort || '8081';
		XPDAccessData.server.xpdDefaultReportsAPIPort = XPDAccessData.server.xpdDefaultReportsAPIPort || '8082';
		XPDAccessData.server.xpdDefaultSetupApiPort = XPDAccessData.server.xpdDefaultSetupApiPort || '8080';

		// 	sincronizando local storage
		// console.log('Atualizando Local Storage !!!');
		(window as any).XPDAccessData = XPDAccessData;
		localStorage.setItem('xpd.admin.XPDAccessData', JSON.stringify(XPDAccessData));

		this.server = XPDAccessData.server;
	}

	public getRawReportsAPIURL() {
		// const url = 'https://' + this.server.xpdDefaultReportsAPIAccessIp + ':' + this.server.xpdDefaultReportsAPIPort;
		const url = this.server.xpdDefaultReportsAPIAccessIp + ':' + this.server.xpdDefaultReportsAPIPort;
		// console.log(url);
		return url;
	}

	public getRawSetupAPIURL() {
		// const url = 'https://' + this.server.xpdDefaultAccessIp + ':' + this.server.xpdDefaultSetupApiPort;
		const url = this.server.xpdDefaultAccessIp + ':' + this.server.xpdDefaultSetupApiPort;
		return url;
	}

	public getReportsAPIURL() {
		const url = this.getRawReportsAPIURL() + '/reports-api/';
		// console.log(url);
		return url;
	}

	public getOperationServerURL() {
		// const url = 'https://' + this.server.xpdDefaultSetupAPIAccessIp + ':' + this.server.xpdDefaultOperationServerPort;
		const url = this.server.xpdDefaultSetupAPIAccessIp + ':' + this.server.xpdDefaultOperationServerPort;
		// console.log(url);
		return url;
	}

	public getSetupAPIURL() {
		const url = this.getRawSetupAPIURL() + '/xpd-setup-api/';
		// console.log(url);
		return url;
	}
}
// })();
