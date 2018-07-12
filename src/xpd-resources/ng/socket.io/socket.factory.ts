import { IOSocket } from './io-socket';

// (function() {
// 	'use strict';

// 	angular.module('socketIO')
// 		.factory('socketFactory', socketFactory);

// 	socketFactory.$inject = ['$rootScope'];

export class SocketIOFactory {
	constructor(private $rootScope) {}

	public create(url: string, namespace: string, threads: string[]) {
		return IOSocket.getInstance(this.$rootScope, url, namespace, threads);
	}
}

// })();
