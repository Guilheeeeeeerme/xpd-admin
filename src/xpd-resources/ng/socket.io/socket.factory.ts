(function() {
	'use strict';

	angular.module('socketIO')
		.factory('socketFactory', socketFactory);

	socketFactory.$inject = ['$rootScope'];

	function socketFactory($rootScope) {
		return function(url, namespace, threads) {
			return new ioSocket($rootScope, url, namespace, threads);
		};
	}

	function ioSocket($rootScope, url, namespace, threads) {

		let options = {
			reconnectionAttempts : Infinity,
			reconnectionDelay : 500,
			reconnectionDelayMax : 500,
			timeout : 500,
		};

		let Manager = io.Manager;
		let manager = new Manager(url, options);

		let socket = manager.socket(namespace, options);

		socket.on('connect', function() {
			try {
				threads.map(function(thread) {
					socket.emit('room', thread);
				});
			} catch (e) {
				console.log(e);
			}
		});

		this.on = function(eventName, callback) {
			function wrapper() {
				let args = arguments;
				$rootScope.$apply(function() {
					callback.apply(socket, args);
				});
			}

			socket.on(eventName, wrapper);

			return function() {
				socket.removeListener(eventName, wrapper);
			};
		};

		this.emit = function(eventName, data, callback) {
			socket.emit(eventName, data, function() {
				let args = arguments;
				$rootScope.$apply(function() {
					if (callback) {
						callback.apply(socket, args);
					}
				});
			});
		};
	}
})();
