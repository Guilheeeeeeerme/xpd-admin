import { IRootScopeService } from 'angular';
import { XPDAccessFactory } from '../xpd.access/accessfactory.factory';
import { SetupAPIService } from './setupapi.service';

// (function() {
// 	'use strict';

// 	angular.module('xpd.setupapi').service('eventlogSetupAPIService', eventlogSetupAPIService);

// 	eventlogSetupAPIService.$inject = ['xpdAccessFactory', 'setupAPIService', '$rootScope'];

export class EventLogSetupAPIService {

	public static $inject: string[] = ['$rootScope', 'xpdAccessFactory', 'setupAPIService'];
	public BASE_URL: string;

	constructor(private $rootScope: IRootScopeService, private xpdAccessFactory: XPDAccessFactory, private setupAPIService: SetupAPIService) {
		this.BASE_URL = xpdAccessFactory.getSetupURL() + 'setup/event';
	}

	public listTrackingEventByOperation(operationId, successCallback, errorCallback) {
		const url = this.BASE_URL + '/operation/' + operationId + '/tracking-events';

		const req = {
			method: 'GET',
			url,
		};

		this.setupAPIService.doRequest(req, successCallback, errorCallback);
	}

	public listByFilters(eventType, operationId, limit, fromDate, toDate, successCallback, errorCallback) {
		let url = this.BASE_URL + '/list-by-type';

		let params = 0;

		if (eventType || operationId || limit || fromDate || fromDate) {
			url += '?';

			if (eventType) {
				url += 'type=' + eventType;
				params++;
			}

			if (operationId) {
				if (params > 0) {
					url += '&';
				}

				url += 'operation-id=' + operationId;
				params++;
			}

			if (limit) {
				if (params > 0) {
					url += '&';
				}

				url += 'limit=' + limit;
				params++;
			}

			if (fromDate) {
				if (params > 0) {
					url += '&';
				}

				url += 'from=' + fromDate.getTime();
				params++;
			}

			if (toDate) {
				if (params > 0) {
					url += '&';
				}

				url += 'to=' + toDate.getTime();
				params++;
			}

			if (params > 0) {
				url += '&';
			}

			url += 'xpdmodule=' + (this.$rootScope as any).XPDmodule;
		}

		const req = {
			method: 'GET',
			url,
		};

		this.setupAPIService.doRequest(req, successCallback, errorCallback);
	}

	public getWithDetails(eventId, successCallback, errorCallback?) {
		let url = this.BASE_URL;
		url += '/' + eventId + '/details';

		const req = {
			method: 'GET',
			url,
		};

		this.setupAPIService.doRequest(req, successCallback, errorCallback);
	}

}

// })();
