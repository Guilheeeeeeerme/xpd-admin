(function () {
	'use strict';

	angular.module('socketIO')
		.factory('socketFactory', socketFactory);

	socketFactory.$inject = ['$rootScope'];

	function socketFactory($rootScope) {
		return function (url, namespace, threads) {
			return new ioSocket($rootScope, url, namespace, threads);
		};
	}

	function ioSocket($rootScope, url, namespace, threads) {

		var options = {
			reconnectionAttempts : Infinity,
			reconnectionDelay : 500,
			reconnectionDelayMax : 500,
			timeout : 500
		};

		var Manager = io.Manager;
		var manager = new Manager(url, options);

		var socket = manager.socket(namespace, options);

		socket.on('connect', function(){
			try{
				threads.map(function(thread){
					socket.emit('room', thread);
				});
			}catch(e){
				console.log(e);
			}
		});

		this.on = function (eventName, callback) {
			function wrapper() {
				var args = arguments;
				$rootScope.$apply(function () {
					callback.apply(socket, args);
				});
			}

			socket.on(eventName, wrapper);

			return function () {
				socket.removeListener(eventName, wrapper);
			};
		};

		this.emit = function (eventName, data, callback) {
			socket.emit(eventName, data, function () {
				var args = arguments;
				$rootScope.$apply(function () {
					if (callback) {
						callback.apply(socket, args);
					}
				});
			});
		};
	}
})();
