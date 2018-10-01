import { XPDAccessService } from '../xpd.access/access.service';
import { SetupAPIService } from './setupapi.service';

// (function() {
// 	'use strict';

// 	operationSetupAPIService.$inject = ['xpdAccessService', 'setupAPIService'];

export class OperationSetupAPIService {

	public static $inject: string[] = ['xpdAccessService', 'setupAPIService'];
	public BASE_URL: string;

	constructor(private xpdAccessService: XPDAccessService, private setupAPIService: SetupAPIService) {
		this.BASE_URL = xpdAccessService.getSetupAPIURL() + 'setup/operation';
	}

	public getOperationAlarms(operationId) {

		const req = {
			method: 'GET',
			url: this.BASE_URL + '/' + operationId + '/alarms',
		};

		return this.setupAPIService.doRequest(req, false);
	}

	public getOperationById(id) {

		const req = {
			method: 'GET',
			url: this.BASE_URL + '/' + id,
		};

		return this.setupAPIService.doRequest(req, false);
	}

	public getList() {

		const req = {
			method: 'GET',
			url: this.BASE_URL + '/list',
		};

		return this.setupAPIService.doRequest(req, false);
	}

	public insertObject(object) {

		const req = {
			method: 'POST',
			url: this.BASE_URL,
			headers: {
				'Content-Type': 'application/json',
			},
			data: object,
		};

		return this.setupAPIService.doRequest(req, true);

	}

	public updateObject(object) {

		const req = {
			method: 'PUT',
			url: this.BASE_URL + '/' + object.id,
			headers: {
				'Content-Type': 'application/json',
			},
			data: object,
		};

		return this.setupAPIService.doRequest(req, true);
	}

	public getDefaultFields(type) {
		const req = {
			method: 'GET',
			url: this.BASE_URL + '/default?type=' + type,
			headers: {
				'Content-Type': 'application/json',
			},
		};

		return this.setupAPIService.doRequest(req, false);
	}

	public getOperationQueue(wellId) {

		const req = {
			method: 'GET',
			url: this.xpdAccessService.getSetupAPIURL() + 'operation-resources/operations-queue/' + wellId,
		};

		return this.setupAPIService.doRequest(req, false);
	}
}

// })();
