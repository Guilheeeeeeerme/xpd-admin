import { IQProvider, IQService } from 'angular';
import { SocketIOService } from '../socket.io/socket.factory';
import { XPDAccessService } from '../xpd.access/access.service';

// (function() {
// 	'use strict';

// 		angular.module('xpd.communication')
// 			.factory('operationDataFactory', operationDataFactory);

// operationDataFactory.$inject = ['$q', 'socketService', 'xpdAccessService'];

export class OperationDataService {

	public static $inject: string[] = ['$q', 'socketService', 'xpdAccessService'];

	public static THREADS = [
		'failure',
		'well',
		'blockSpeed',
		'shift',
		'operation',
		'timeSlices',
		'alarm',
		'state',
		'chronometer',
		'event',
		'parallelEvent',
		'jointLog',
		'operationProgress',
		'elevatorTarget',
		'score',
		'vTarget',
		'reading',
		'bitDepth',
		'vre',
		'subOperation',
		'forecast',
		'operationQueue',
		'speedSecurity',
		'direction',
		'dataAcquisition',
	];

	private eventsCallbacks: any = {};
	private communicationChannel: any = null;
	private socket: any;
	private operationDataFactory: any = {
		operationData: {},
	};
	private socketDefer: angular.IDeferred<{}>;

	constructor(private $q: IQService, private socketService: SocketIOService, private xpdAccessService: XPDAccessService) {
		this.socketDefer = this.$q.defer();
	}

	public addEventListener(origin, event, callback) {

		if (!this.eventsCallbacks[event]) {
			this.eventsCallbacks[event] = {};
		}

		this.eventsCallbacks[event][origin] = callback;
	}

	public openConnection(threads) {
		const self = this;

		if (!threads || threads.length === 0) {
			threads = OperationDataService.THREADS;
		}

		return self.$q(function (resolve, reject) {

			if (self.communicationChannel) {
				console.info('There is already an running operation data factory.');
				resolve(self.operationDataFactory);
			} else {
				self.communicationChannel = {};

				self.socket = self.socketService.create(self.xpdAccessService.getOperationServerURL(), '/operation-socket', threads);

				self.socket.on('subjects', function (response) {

					self.operationDataFactory = {
						operationData: {

						},
					};

					const ContextSubjects = response.ContextSubjects;
					const UserActions = response.UserActions;

					self.contextSubjectGenerator(ContextSubjects);
					self.userActionsGenerator(UserActions);

					for (const key in self.communicationChannel) {
						if (key.startsWith('emit')) {
							self.operationDataFactory[key] = getEmitFunction(key);
						}
					}

					function getEmitFunction(channelKey) {
						return function (data) {
							self.communicationChannel[channelKey](data);
						};
					}

					resolve(self.operationDataFactory);
					self.socketDefer.resolve(self.operationDataFactory);

				});
			}

		});

	}

	private contextSubjectGenerator(ContextSubjects) {
		for (const i in ContextSubjects) {

			const contextSubject = ContextSubjects[i];

			let subject = contextSubject.toLowerCase();

			subject = subject.replace(/_./g, function (v) {
				return v.toUpperCase().replace(/_/g, '');
			});

			subject = 'set' + subject.charAt(0).toUpperCase() + subject.slice(1) + 'Listener';

			this.communicationChannel[subject] = this.setOn(this.socket, contextSubject);
			this.setInterceptor(subject, this.communicationChannel[subject]);
		}
	}

	private userActionsGenerator(UserActions) {
		for (const i in UserActions) {

			const userAction = UserActions[i];

			let action = userAction.toLowerCase();

			action = action.replace(/_./g, function (v) {
				return v.toUpperCase().replace(/_/g, '');
			});

			action = 'emit' + action.charAt(0).toUpperCase() + action.slice(1);

			this.communicationChannel[action] = this.setEmit(this.socket, userAction);
		}
	}

	private setInterceptor(subject, communication) {
		const self = this;

		communication(function (contextRoot) {
			if (contextRoot && contextRoot.name && contextRoot.data) {
				const contextName = contextRoot.name;
				const contextData = contextRoot.data;

				self.loadContext(contextName, contextData);
				self.loadEventListenersCallback(subject, contextData);
			}
		});
	}

	private loadContext(target, context) {

		if (!this.operationDataFactory.operationData[target]) {
			// console.warn('Contexto não esperado', target, new Error().stack);
			this.operationDataFactory.operationData[target] = {};
		}

		for (const i in context) {
			this.operationDataFactory.operationData[target][i] = context[i];
		}
	}

	private loadEventListenersCallback(listenerName, context) {
		const self = this;

		if (self.eventsCallbacks && self.eventsCallbacks[listenerName]) {
			for (const origin in self.eventsCallbacks[listenerName]) {
				try {
					self.socketDefer.promise.then(() => {
						self.eventsCallbacks[listenerName][origin](context);
					});
				} catch (e) {
					console.error(e);
				}
			}
		}

	}

	private setOn(socket, eventName) {
		return function (callback) {
			socket.on(eventName, callback);
		};
	}

	private setEmit(socket, eventName) {
		return function (data) {
			socket.emit(eventName, data);
		};
	}

}
