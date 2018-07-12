// (function() {
// 	'use strict';

// 	angular
// 		.module('xpd.accessfactory')
// 		.factory('xpdAccessFactory', xpdAccessFactory);

// 	xpdAccessFactory.$inject = [];

/* @ngInject */
export class XPDAccessFactory {

	public static $inject: string[] = [];
	private server: any;

	constructor() {

		let XPDAccessData = (window as any).XPDAccessData;

		// 	tem algo no local storage?
		if (localStorage.getItem('xpd.admin.XPDAccessData')) {
			XPDAccessData = JSON.parse(localStorage.getItem('xpd.admin.XPDAccessData'));
		}

		// 	checando se tem os campos necessários
		if (!XPDAccessData || !XPDAccessData.server) {

			console.log('Criando Access Data Default !!!');

			XPDAccessData = {
				server: {
					xpdDefaultAccessIp: '127.0.0.1',
					xpdDefaultOperationServerPort: '8081',
					xpdDefaultReportsAPIPort: '8082',
					xpdDefaultSetupApiPort: '8443',
				},
			};
		}

		// colocando valores default
		XPDAccessData.server.xpdDefaultAccessIp = XPDAccessData.server.xpdDefaultAccessIp || '127.0.0.1';
		XPDAccessData.server.xpdDefaultReportsAPIAccessIp = XPDAccessData.server.xpdDefaultReportsAPIAccessIp || XPDAccessData.server.xpdDefaultAccessIp;
		XPDAccessData.server.xpdDefaultSetupAPIAccessIp = XPDAccessData.server.xpdDefaultSetupAPIAccessIp || XPDAccessData.server.xpdDefaultAccessIp;

		XPDAccessData.server.xpdDefaultOperationServerPort = XPDAccessData.server.xpdDefaultOperationServerPort || '8081';
		XPDAccessData.server.xpdDefaultReportsAPIPort = XPDAccessData.server.xpdDefaultReportsAPIPort || '8082';
		XPDAccessData.server.xpdDefaultSetupApiPort = XPDAccessData.server.xpdDefaultSetupApiPort || '8443';

		// 	sincronizando local storage
		// console.log('Atualizando Local Storage !!!');
		(window as any).XPDAccessData = XPDAccessData;
		localStorage.setItem('xpd.admin.XPDAccessData', JSON.stringify(XPDAccessData));

		this.server = XPDAccessData.server;
	}

	public getReportsAPIURL() {
		const url = 'https://' + this.server.xpdDefaultReportsAPIAccessIp + ':' + this.server.xpdDefaultReportsAPIPort + '/reports-api/';
		// console.log(url);
		return url;
	}

	public getOperationServerURL() {
		const url = 'https://' + this.server.xpdDefaultSetupAPIAccessIp + ':' + this.server.xpdDefaultOperationServerPort;
		// console.log(url);
		return url;
	}

	public getSetupURL() {
		const url = 'https://' + this.server.xpdDefaultAccessIp + ':' + this.server.xpdDefaultSetupApiPort + '/xpd-setup-api/';
		// console.log(url);
		return url;
	}
}
// })();
