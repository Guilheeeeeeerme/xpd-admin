
import * as io from 'socket.io-client';

export class IOSocket {
	private static instance: IOSocket;
	public on: (eventName: any, callback: any) => () => void;
	public emit: (eventName: any, data: any, callback: any) => void;

	public static getInstance($rootScope, url, namespace, threads): IOSocket {
		return this.instance || (this.instance = new this($rootScope, url, namespace, threads));
	}

	private constructor($rootScope, url, namespace, threads) {

		const options = {
			reconnectionAttempts: Infinity,
			reconnectionDelay: 500,
			reconnectionDelayMax: 500,
			timeout: 500,
		};

		const Manager = io.Manager;
		const manager = new Manager(url, options);

		const socket = manager.socket(namespace, options);

		socket.on('connect', function () {
			try {
				threads.map(function (thread) {
					socket.emit('room', thread);
				});
			} catch (e) {
				console.log(e);
			}
		});

		this.on = function (eventName, callback) {
			function wrapper() {
				const args = arguments;
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
				const args = arguments;
				$rootScope.$apply(function () {
					if (callback) {
						callback.apply(socket, args);
					}
				});
			});
		};
	}
}
