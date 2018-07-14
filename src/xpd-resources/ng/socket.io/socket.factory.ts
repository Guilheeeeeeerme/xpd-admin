import { IOSocket } from './io-socket';

// (function() {
// 	'use strict';

// 	angular.module('socketIO')
// 		.factory('socketService', socketService);

// 	socketService.$inject = ['$rootScope'];

export class SocketIOService {
	constructor(private $rootScope) {}

	public create(url: string, namespace: string, threads: string[]) {
		return IOSocket.getInstance(this.$rootScope, url, namespace, threads);
	}
}

// })();
