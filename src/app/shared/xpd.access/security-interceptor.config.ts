// (function() {
// 	'use strict';

// secureConfig.$inject = ['$httpProvider'];

export class SecurityInterceptorConfig {

	public static $inject: string[] = ['$httpProvider'];

	constructor($httpProvider: ng.IHttpProvider) {
		$httpProvider.interceptors.push('securityInteceptor');
	}

}
// })();
