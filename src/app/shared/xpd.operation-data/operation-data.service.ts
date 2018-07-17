
import { EventEmitter } from 'events';
import * as io from 'socket.io-client';
import { IPromise, IQService, IRootScopeService } from '../../../../node_modules/@types/angular';
import { XPDAccessService } from '../xpd.access/access.service';

// (function() {
// 	'use strict';

// 		angular.module('xpd.communication')
// 			.factory('operationDataFactory', operationDataFactory);

// operationDataFactory.$inject = ['$q', 'socketService', 'xpdAccessService'];

export class OperationDataService {

	private observer: EventEmitter;

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

	public operationDataFactory = {
		operationData: {},
	};

	public socket: any;
	private locked: boolean;
	private operationDataDefer: angular.IDeferred<{}>;
	public static $inject = ['$q', '$rootScope', 'xpdAccessService'];

	constructor(
		$q: IQService,
		private $rootScope: IRootScopeService,
		private accessService: XPDAccessService) {

		this.operationDataDefer = $q.defer();
		this.locked = false;
		this.observer = new EventEmitter();
	}

	public emit(subject: string, data: any): void {
		this.observer.emit(subject, data);
	}

	public on(subject: string, callback): void {
		this.observer.on(subject, callback);
	}

	public openConnection(threads: string[]): IPromise<{}> {

		if (!threads || threads.length === 0) {
			threads = OperationDataService.THREADS;
		}

		const self: OperationDataService = this;

		if (!self.locked) {
			console.log('Criando conexão com operation server');

			self.locked = true;

			const options = {
				reconnectionAttempts: Infinity,
				reconnectionDelay: 500,
				reconnectionDelayMax: 500,
				timeout: 500,
			};

			const manager = new io.Manager(self.accessService.getOperationServerURL(), options);

			const socket = manager.socket('/operation-socket', options);
			self.socket = socket;

			socket.on('connect', () => {

				threads.map((thread) => {
					socket.emit('room', thread);
				});

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
			console.log('Reusando conexão com operation server');
		}

		return self.operationDataDefer.promise;

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
			socket.emit(eventName, data);
		};
	}
}
