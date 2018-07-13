// (function() {
// 	'use strict';

// angular.module('xpd.accessfactory').config(secureConfig);

// secureConfig.$inject = ['$httpProvider'];

export class SecurityConfig {

	public static $inject: string[] = ['$httpProvider'];

	constructor($httpProvider: ng.IHttpProvider) {
		$httpProvider.interceptors.push('securityInteceptor');
	}

}
// })();
