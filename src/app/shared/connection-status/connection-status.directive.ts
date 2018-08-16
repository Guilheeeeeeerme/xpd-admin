import * as angular from 'angular';
import { OperationDataService } from '../xpd.operation-data/operation-data.service';
import './connection-status.style.scss';
import template from './connection-status.template.html';

export class ConnectionStatusDirective implements ng.IDirective {

	public static $inject: string[] = ['operationDataService'];
	public static Factory(): ng.IDirectiveFactory {
		return (operationDataService: OperationDataService) => new ConnectionStatusDirective(operationDataService);
	}

	public restrict = 'E';
	public template = template;

	constructor(private operationDataService: OperationDataService) {

	}

	public link: ng.IDirectiveLinkFn = (
		scope: any,
		element: ng.IAugmentedJQuery,
		attrs: ng.IAttributes,
		ctrl: any,
	) => {

		let closeTimeout;

		element[0].style.visibility = 'hidden';

		const open = () => {
			if (!angular.element(element.children()[0]).hasClass('open')) {
				angular.element(element.children()[0]).addClass('open');
			}
		};

		const close = () => {
			if (angular.element(element.children()[0]).hasClass('open')) {
				angular.element(element.children()[0]).removeClass('open');
			}
		};

		const isConnected = () => {
			scope.connected = true;
			try { scope.$apply(); } catch (e) { /*console.log(e)*/ }
			open();

			if (closeTimeout) {
				clearTimeout(closeTimeout);
			}

			closeTimeout = setTimeout(() => {
				close();
				element[0].style.visibility = 'hidden';
			}, 3000);
		};

		const isNotConnected = () => {
			element[0].style.visibility = 'visible';
			scope.connected = false;
			try { scope.$apply(); } catch (e) { /*console.log(e)*/ }
			open();
		};

		this.operationDataService.on('reconnecting', () => {
			isNotConnected();
		});

		this.operationDataService.on('reconnect', () => {
			isConnected();
		});

		// this.operationDataService.on('connect_error', (data) => { console.log('connect_error', data); });
		// this.operationDataService.on('connect_timeout', (data) => { console.log('connect_timeout', data); });
		// this.operationDataService.on('reconnect', (data) => { console.log('reconnect', data); });
		// this.operationDataService.on('reconnect_attempt', (data) => { console.log('reconnect_attempt', data); });
		// this.operationDataService.on('reconnecting', (data) => { console.log('reconnecting', data); });
		// this.operationDataService.on('reconnect_error', (data) => { console.log('reconnect_error', data); });
		// this.operationDataService.on('reconnect_failed', (data) => { console.log('reconnect_failed', data); });
		// this.operationDataService.on('ping', (data) => { console.log('ping', data); });
		// this.operationDataService.on('pong', (data) => { console.log('pong', data); });

		// Event: ‘connect_error’
		// error (Object) error object
		// Fired upon a connection error.

		// Event: ‘connect_timeout’
		// Fired upon a connection timeout.

		// Event: ‘reconnect’
		// attempt (Number) reconnection attempt number
		// Fired upon a successful reconnection.

		// Event: ‘reconnect_attempt’
		// Fired upon an attempt to reconnect.

		// Event: ‘reconnecting’
		// attempt (Number) reconnection attempt number
		// Fired upon a successful reconnection.

		// Event: ‘reconnect_error’
		// error (Object) error object
		// Fired upon a reconnection attempt error.

		// Event: ‘reconnect_failed’
		// Fired when couldn’t reconnect within reconnectionAttempts.

		// Event: ‘ping’
		// Fired when a ping packet is written out to the server.

		// Event: ‘pong’

	}

}

// })();
