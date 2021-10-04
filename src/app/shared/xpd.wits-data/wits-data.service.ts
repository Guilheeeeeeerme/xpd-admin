
import { IPromise, IQService, IRootScopeService } from 'angular';
import { EventEmitter } from 'events';
import { map } from 'highcharts';
import * as io from 'socket.io-client';
import { XPDAccessService } from '../xpd.access/access.service';
import { AuthService } from '../xpd.setupapi/auth.service';

export class WitsDataService {

	public static THREADS = [
		'mapping',
		'dataAcquisition',
	];

	public static FIELDS = [
		'rpm',
		'wob',
		'rop',
		'flow',
		'torque',
		'depth',
		'blockPosition',
		'hookload',
		'sppa',
		'bitDepth',
		'blockSpeed',
		'date',
		'time'
	];


	public static $inject = ['$q', '$rootScope', 'xpdAccessService'];

	public witsDataFactory = {
		operationData: {},
	};

	public socket: any;
	private locked: boolean;
	private threads: string[] = [];
	private fields: string[] = [];
	private witsDataDefer: angular.IDeferred<{}>;

	private observer: EventEmitter;

	constructor(
		$q: IQService,
		public $rootScope: any,
		private accessService: XPDAccessService) {

		WitsDataService.THREADS.map((thread) => {
			Object.defineProperty(WitsDataService, 'witsDataFactory.operationData.' + thread + 'Context', {
				get: () => {
					if (!this.threads.includes(thread)) {
						throw new Error('Please listen to ' + thread);
					} else {
						return this.witsDataFactory.operationData[thread + 'Context'];
					}
				},
			});
		});

		this.witsDataDefer = $q.defer();
		this.locked = false;
		this.observer = new EventEmitter();
	}
	public emitEv(subject: string, data: any): void {
		this.socket.emit(`${subject}`, data);
	}

	public emit(subject: string, data: any, log: boolean): void {
		this.observer.emit(subject, data);

		if (log) {
			this.log(subject, data);
		}
	}

	public on(subject: string, callback): void {
		if (this.observer.listeners(subject).length === 0) {
			this.observer.on(subject, callback);
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

	public addMapping(map) {
		let index = this.$rootScope.mapping.findIndex(val => val.rec == map.rec && val.item == map.item);
		this.$rootScope.mappingFilter.push(this.$rootScope.mapping[index]);
		this.$rootScope.$apply();
	}

	private onMapping(mapping) {
		this.$rootScope.dict = [];
		this.$rootScope.mapping = [];
		this.$rootScope.mappingFilter = [];
		for (var i in mapping) {
			var item = mapping[i];
			if (WitsDataService.FIELDS.includes(item.field)) {
				this.$rootScope.mappingFilter.push(item);
			}
			this.$rootScope.mapping.push(item)
			this.$rootScope.dict.push({
				key: `${item.rec + item.item}`,
				value: `${item.description}`,
				metric: `${item.metric_units}`,
			});
		}
		this.$rootScope.$apply();
	}


	public onServerInfo(serverInfo) {
		this.$rootScope.serverInfo = serverInfo;
		this.$rootScope.$apply();
	}

	public readingWitsToJson(witsData) {
		let description;
		let metric = '';
		var json = '';
		if (witsData) {
			const data = witsData.split('\n');
			data.map((item) => {
				const isValid = item !== '&&' && item !== '!!'
				if (isValid) {
					const recInfo = item.slice(0, 4);
					const valueRec = item.slice(4, item.length);
					let index = this.$rootScope.dict.findIndex(val => val.key == recInfo);
					if (index !== -1) {
						if (this.$rootScope.dict[index].metric) {
							metric = this.$rootScope.dict[index].metric;
						}
						description = this.$rootScope.dict[index].value.charAt(0).toUpperCase() + this.$rootScope.dict[index].value.slice(1);
						json += recInfo + ' - ' + description + `(${metric})` + ' - ' + valueRec + '\n';
					} else {
						json += recInfo + ' - ' + 'Undefined' + ' - ' + valueRec + '\n';
					}
				}
			})
		}

		return json;
	}

	public readingLineToJson(readingLine, mapping) {

		var json = '';
		for (var i in mapping) {
			var item = mapping[i];
			var regexPattern = item.rec + '' + item.item;
			var regex = new RegExp('^' + regexPattern + '.*');
			for (var j in readingLine) {
				try {
					var readingField = readingLine[j];
					if (readingField.match(regex)) {
						readingField = String(readingField);
						readingField = readingField.split(regexPattern).pop();
						json += item.description + ' (' + readingField + ')\n';
					}
				}
				catch (e) {
					console.log('error', e)
				}
			}
		}
		return json;
	}

	public merge(list) {
		var text = '';
		while (list && list.length) {
			text += list.shift();
			text += '\n';
		}
		return text;
	}

	public onAcquisitionDetails(details) {
		this.$rootScope.dados = [];
		try {
			details.mapped = this.readingLineToJson(details.readingLine, this.$rootScope.mapping);
			details.line = this.merge(details.readingLine);
			this.$rootScope.dados.unshift(details);

			if (this.$rootScope.dados.length == 50) {
				this.$rootScope.dados.pop();
			}

			this.$rootScope.$apply();
		} catch (e) {
			console.log('error', e)
		}
	}

	public openConnection(threads: string[]): IPromise<{}> {

		if (!threads || threads.length === 0) {
			threads = WitsDataService.THREADS;
		}

		const self: WitsDataService = this;

		const token = AuthService.getOperationServerToken();

		if (!self.locked) {
			console.log('Criando conexão com o wits');

			self.locked = true;

			const options = {
				reconnectionAttempts: Infinity,
				reconnectionDelay: 500,
				reconnectionDelayMax: 500,
				timeout: 500,
				query: { token: token },
			};

			const manager: io.Manager = new io.Manager(self.accessService.getWitsTranslatorURL(), options);

			const socket = manager.socket('/wits-translator', options);

			self.socket = socket;
			self.socket.on('error', (error) => {
				console.log('Unable to communicate with wits, associate error:', error);
				this.$rootScope.connectToTranslator = false;
				this.$rootScope.$apply();
				if (error === 'Authentication error') {
					AuthService.logout();
				}
			});

			self.socket.on('connect', () => {
				console.log('Connected with wits')
				this.$rootScope.connectToTranslator = true;
				this.emitEvent(threads);
				this.log('connect', null);
				self.witsDataDefer.resolve();
				this.$rootScope.$apply();
			});

			self.socket.on('server-info', (serverInfo) => {
				this.onServerInfo(serverInfo);
			});

			self.socket.on('mapping', (mapDetails) => {
				this.onMapping(mapDetails)
			})

			self.socket.on('authenticated', () => {
				// use the socket as usual
				console.log('User is authenticated');
			});

			// Wits Simulator 
			self.socket.on('acquisition-details', (data) => { self.emit('acquisition-details', data, true); });
			self.socket.on('server-info', (data) => { self.emit('server-info', data, true); });
			self.socket.on('user-request-connection', (data) => { self.emit('user-request-connection', data, true); });
			self.socket.on('user-request-disconnection', (data) => { self.emit('user-request-disconnection', data, true); });


			self.socket.on("user-update-mapping", (data) => {
				console.log("user-update-mapping")
			});
			self.socket.on("user-request-disconnection", () => {
				console.log("user-request-disconnection")
			});
			self.socket.on("user-request-connection", (data) => {
				console.log("user-request-connection", data)
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

				for (const key in communicationChannel) {
					if (key.startsWith('emit')) {
						self.witsDataFactory[key] = getEmitFunction(key);
					}
				}

				self.witsDataDefer.resolve();

			});

		} else {
			this.emitEvent(threads);
			console.log('Reusando conexão com o wits');
		}

		return self.witsDataDefer.promise;

	}


	private emitEvent(threads) {
		const self: WitsDataService = this;

		threads.map((thread) => {
			if (!self.threads.includes(thread)) {
				self.threads.push(thread);
				self.socket.emit('room', thread);
			}
		});
	}

	private setEmit(socket, eventName): any {
		return (data) => {
			this.log(eventName, data);
			socket.emit(eventName, data);
		};
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


	private loadEventListenersCallback(listenerName, data) {
		const self = this;
		self.observer.emit(listenerName, data);
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

		if (!self.witsDataFactory.operationData[target]) {
			// console.warn('Contexto não esperado', target, new Error().stack);
			self.witsDataFactory.operationData[target] = {};
		}

		// tslint:disable-next-line:forin
		for (const i in context) {
			self.witsDataFactory.operationData[target][i] = context[i];
		}

	}
}
