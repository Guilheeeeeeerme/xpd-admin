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
		if (localStorage.getItem('xpd.admin.XPDAccessData_V2')) {
			XPDAccessData = JSON.parse(localStorage.getItem('xpd.admin.XPDAccessData_V2'));
		}

		// const xpdDefaultAccessIp = 'http://165.22.178.111:8081';
		// const xpdDefaultReportsAPIAccessIp = 'http://165.22.178.111:8082';
		// const xpdDefaultSetupAPIAccessIp = 'http://165.22.178.111:8080/xpd-setup-api/';
		// const xpdDefaultWitsTranslatorIp = 'http://165.22.178.111:9596';

		const xpdDefaultAccessIp = 'https://operation-xpd.ngrok.io';
		const xpdDefaultReportsAPIAccessIp = 'https://reports-xpd.ngrok.io';
		const xpdDefaultSetupAPIAccessIp = 'https://setup-xpd.ngrok.io/xpd-setup-api/';
		const xpdDefaultWitsTranslatorIp = 'https://wits-xpd.ngrok.io';

		// 	checando se tem os campos necessários
		if (!XPDAccessData || !XPDAccessData.server) {

			console.log('Criando Access Data Default !!!');

			XPDAccessData = {
				server: {
					xpdDefaultAccessIp: xpdDefaultAccessIp,
					xpdDefaultReportsAPIAccessIp: xpdDefaultReportsAPIAccessIp,
					xpdDefaultSetupAPIAccessIp: xpdDefaultSetupAPIAccessIp,
					xpdDefaultWitsTranslatorIp: xpdDefaultWitsTranslatorIp,
					// xpdDefaultOperationServerPort: '8081',
					// xpdDefaultReportsAPIPort: '8082',
					// xpdDefaultSetupApiPort: '8080',
					// xpdDefaultWitsTranslatorServerPort: '9596',
				},
			};
		}

		// colocando valores default
		XPDAccessData.server.xpdDefaultAccessIp = XPDAccessData.server.xpdDefaultAccessIp || xpdDefaultAccessIp;
		XPDAccessData.server.xpdDefaultReportsAPIAccessIp = XPDAccessData.server.xpdDefaultReportsAPIAccessIp || xpdDefaultReportsAPIAccessIp;
		XPDAccessData.server.xpdDefaultSetupAPIAccessIp = XPDAccessData.server.xpdDefaultSetupAPIAccessIp || xpdDefaultSetupAPIAccessIp;
		XPDAccessData.server.xpdDefaultWitsTranslatorIp = XPDAccessData.server.xpdDefaultWitsTranslatorIp || xpdDefaultWitsTranslatorIp;

		// XPDAccessData.server.xpdDefaultOperationServerPort = XPDAccessData.server.xpdDefaultOperationServerPort || '8081';
		// XPDAccessData.server.xpdDefaultReportsAPIPort = XPDAccessData.server.xpdDefaultReportsAPIPort || '8082';
		// XPDAccessData.server.xpdDefaultSetupApiPort = XPDAccessData.server.xpdDefaultSetupApiPort || '8080';
		// XPDAccessData.server.xpdDefaultWitsTranslatorServerPort = XPDAccessData.server.xpdDefaultWitsTranslatorServerPort || "9596";
		

		// 	sincronizando local storage
		// console.log('Atualizando Local Storage !!!');
		(window as any).XPDAccessData = XPDAccessData;
		localStorage.setItem('xpd.admin.XPDAccessData_V2', JSON.stringify(XPDAccessData));

		this.server = XPDAccessData.server;
	}

	public getRawReportsAPIURL() {
		const url = this.server.xpdDefaultReportsAPIAccessIp;
		return url;
	}

	public getReportsAPIURL() {
		const url = this.getRawReportsAPIURL() + '/reports-api/';
		return url;
	}

	public getOperationServerURL() {
		const url = this.server.xpdDefaultAccessIp;
		return url;
	}

	public getSetupAPIURL() {
		const url = this.server.xpdDefaultSetupAPIAccessIp;
		return url;
	}

	public getWitsTranslatorURL() {
		const url = this.server.xpdDefaultWitsTranslatorIp;
		return url;
	}
}
// })();
