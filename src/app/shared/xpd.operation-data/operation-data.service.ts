
import { IPromise, IQService, IRootScopeService } from 'angular';
import { EventEmitter } from 'events';
import * as io from 'socket.io-client';
import { XPDAccessService } from '../xpd.access/access.service';
import { AccessFactoryService } from '../xpd.access/accessfactory.service';
import { AuthService } from '../xpd.setupapi/auth.service';

export class OperationDataService {

	public static THREADS = [
		'alarm',
		'bitDepth',
		'blockSpeed',
		'chronometer',
		'dataAcquisition',
		'direction',
		'elevatorTarget',
		'event',
		'failure',
		'forecast',
		'jointLog',
		'operation',
		'operationProgress',
		'operationQueue',
		'parallelEvent',
		'reading',
		'score',
		'shift',
		'speedSecurity',
		'state',
		'subOperation',
		'timeSlices',
		'vre',
		'vTarget',
		'well',
	];

	public static $inject = ['$q', '$rootScope', 'xpdAccessService'];

	public operationDataFactory = {
		operationData: {},
	};

	public socket: any;
	private locked: boolean;
	private threads: string[] = [];
	private operationDataDefer: angular.IDeferred<{}>;

	private observer: EventEmitter;

	constructor(
		$q: IQService,
		private $rootScope: IRootScopeService,
		private accessService: XPDAccessService) {

		OperationDataService.THREADS.map((thread) => {
			Object.defineProperty(OperationDataService, 'operationDataFactory.operationData.' + thread + 'Context', {
				get: () => {
					if (!this.threads.includes(thread)) {
						throw new Error('Please listen to ' + thread);
					} else {
						return this.operationDataFactory.operationData[thread + 'Context'];
					}
				},
			});
		});

		this.operationDataDefer = $q.defer();
		this.locked = false;
		this.observer = new EventEmitter();
	}

	public emit(subject: string, data: any, log: boolean): void {
		this.observer.emit(subject, data);

		if (log) {
			this.log(subject, data);
		}
	}

	public on($scope: any, subject: string, callback): void {

		this.observer.on(subject, callback);

		if($scope && $scope.$on) {	
			$scope.$on("$destroy", () => {
				try {
					this.observer.removeListener(subject, callback);
				} catch {}
			});
		}
	}

	public log(eventName, data) {
		try {
			this.socket.emit('logactivity', {
				module: 'admin',
				timestamp: new Date().toISOString(),
				path: location.href,
				action: eventName,
				data,
			});
		} catch (e) {
			console.error(e);
		}
	}

	public openConnection(threads: string[]): IPromise<{}> {

		if (!threads || threads.length === 0) {
			threads = OperationDataService.THREADS;
		}

		const self: OperationDataService = this;

		const token = AuthService.getOperationServerToken();

		if (!self.locked) {
			console.log('Criando conexão com operation server');

			self.locked = true;

			const options = {
				reconnectionAttempts: Infinity,
				reconnectionDelay: 500,
				reconnectionDelayMax: 500,
				timeout: 500,
				query: { token: token },
			};

			const manager: io.Manager = new io.Manager(self.accessService.getOperationServerURL(), options);

			const socket = manager.socket('/operation-socket', options);
			self.socket = socket;

			socket.on('error', (error) => {
				if (error === 'Authentication error') {
					AuthService.logout();
				}
			});

			self.socket.on('connect_error', (data) => { self.emit('connect_error', data, true); });
			self.socket.on('connect_timeout', (data) => { self.emit('connect_timeout', data, true); });
			self.socket.on('reconnect', (data) => { self.emit('reconnect', data, true); });
			self.socket.on('reconnect_attempt', (data) => { self.emit('reconnect_attempt', data, true); });
			self.socket.on('reconnecting', (data) => { self.emit('reconnecting', data, true); });
			self.socket.on('reconnect_error', (data) => { self.emit('reconnect_error', data, true); });
			self.socket.on('reconnect_failed', (data) => { self.emit('reconnect_failed', data, true); });
			self.socket.on('ping', (data) => { self.emit('ping', data, false); });
			self.socket.on('pong', (data) => { self.emit('pong', data, false); });

			socket.on('connect', () => {
				this.emitEvent(threads);
				this.log('connect', null);
			});

			socket.on('authenticated', () => {
				// use the socket as usual
				console.log('User is authenticated');
			});

			socket.on('subjects', (response) => {

				const getEmitFunction = (channelKey) => {
					return (data) => {
						communicationChannel[channelKey](data);
					};
				};

				const ContextSubjects = response.ContextSubjects;
				const UserActions = response.UserActions;
				const communicationChannel: any = {};

				// const communicationChannel = new CommunicationChannel(socket, ContextSubjects, UserActions, self);

				this.contextSubjectGenerator(ContextSubjects, communicationChannel);

				this.userActionsGenerator(UserActions, communicationChannel);

				for (const key in communicationChannel) {
					if (key.startsWith('emit')) {
						self.operationDataFactory[key] = getEmitFunction(key);
					}
				}

				self.operationDataDefer.resolve();

			});

		} else {
			this.emitEvent(threads);
			console.log('Reusando conexão com operation server');
		}

		return self.operationDataDefer.promise;

	}

	private emitEvent(threads) {
		const self: OperationDataService = this;

		threads.map((thread) => {
			if (!self.threads.includes(thread)) {
				self.threads.push(thread);
				self.socket.emit('room', thread);
			}
		});
	}

	private contextSubjectGenerator(ContextSubjects, communicationChannel) {
		const self = this;

		// tslint:disable-next-line:forin
		for (const i in ContextSubjects) {

			const contextSubject = ContextSubjects[i];

			let subject = contextSubject.toLowerCase();

			subject = subject.replace(/_./g, (v) => {
				return v.toUpperCase().replace(/_/g, '');
			});

			subject = 'set' + subject.charAt(0).toUpperCase() + subject.slice(1) + 'Listener';

			communicationChannel[subject] = self.setOn(self.socket, contextSubject);
			self.setInterceptor(subject, communicationChannel[subject]);

		}
	}

	private userActionsGenerator(UserActions, communicationChannel) {
		const self = this;

		// tslint:disable-next-line:forin
		for (const i in UserActions) {

			const userAction = UserActions[i];

			let action = userAction.toLowerCase();

			action = action.replace(/_./g, (v) => {
				return v.toUpperCase().replace(/_/g, '');
			});

			action = 'emit' + action.charAt(0).toUpperCase() + action.slice(1);

			communicationChannel[action] = self.setEmit(self.socket, userAction);
		}
	}

	private setInterceptor(subject, communication) {

		communication((contextRoot: any) => {
			if (contextRoot && contextRoot.name && contextRoot.data) {
				const contextName = contextRoot.name;
				const contextData = contextRoot.data;
				this.loadContext(contextName, contextData);
				this.loadEventListenersCallback(subject, contextData);
			}
		});

	}

	private loadContext(target, context) {
		const self = this;

		if (!self.operationDataFactory.operationData[target]) {
			// console.warn('Contexto não esperado', target, new Error().stack);
			self.operationDataFactory.operationData[target] = {};
		}

		// tslint:disable-next-line:forin
		for (const i in context) {
			self.operationDataFactory.operationData[target][i] = context[i];
		}

	}

	private loadEventListenersCallback(listenerName, data) {
		const self = this;
		self.observer.emit(listenerName, data);
	}

	private setOn(socket, eventName): any {
		const vm = this;

		return (callback) => {
			// socket.on(eventName, callback);
			socket.on(eventName, function wrapper() {
				const args = arguments;
				vm.$rootScope.$apply(() => {
					callback.apply(socket, args);
				});
			});
		};
	}

	private setEmit(socket, eventName): any {
		return (data) => {
			this.log(eventName, data);
			socket.emit(eventName, data);
		};
	}
}
