import { IRootScopeService } from 'angular';
import { XPDAccessService } from '../xpd.access/access.service';
import { SetupAPIService } from './setupapi.service';

// (function() {
// 	'use strict';

// 	eventlogSetupAPIService.$inject = ['xpdAccessService', 'setupAPIService', '$rootScope'];

export class EventLogSetupAPIService {

	public static $inject: string[] = ['$rootScope', 'xpdAccessService', 'setupAPIService'];
	public BASE_URL: string;

	constructor(private $rootScope: IRootScopeService, private xpdAccessService: XPDAccessService, private setupAPIService: SetupAPIService) {
		this.BASE_URL = xpdAccessService.getSetupAPIURL() + 'setup/event';
	}

	public listTrackingEventByOperation(operationId) {
		const url = this.BASE_URL + '/operation/' + operationId + '/tracking-events';

		const req = {
			method: 'GET',
			url,
		};

		return this.setupAPIService.doRequest(req, false);
	}

	public listByFilters(eventType, operationId, limit, fromDate, toDate) {
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

		return this.setupAPIService.doRequest(req, false);
	}

	public getWithDetails(eventId) {
		let url = this.BASE_URL;
		url += '/' + eventId + '/details';

		const req = {
			method: 'GET',
			url,
		};

		return this.setupAPIService.doRequest(req, false);
	}

}

// })();
