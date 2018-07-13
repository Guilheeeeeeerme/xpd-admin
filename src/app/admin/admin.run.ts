// (function() {

// 'use strict',

// angular.module('xpd.admin')

export class AdminRunScope {
	public static $inject = ['$rootScope'];
	constructor($rootScope) {
		$rootScope.XPDmodule = 'admin';
	}
}

// })();
