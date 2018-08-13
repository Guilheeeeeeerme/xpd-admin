import { XPDAccessService } from '../xpd.access/access.service';
import { SetupAPIService } from './setupapi.service';

// (function() {
// 	'use strict';

// 	operationSetupAPIService.$inject = ['xpdAccessService', 'setupAPIService'];

export class OperationSetupAPIService {

	public static $inject: string[] = ['xpdAccessService', 'setupAPIService'];
	public BASE_URL: string;

	constructor(private xpdAccessService: XPDAccessService, private setupAPIService: SetupAPIService) {
		this.BASE_URL = xpdAccessService.getSetupURL() + 'setup/operation';
	}

	public getOperationAlarms(operationId) {

		const req = {
			method: 'GET',
			url: this.BASE_URL + '/' + operationId + '/alarms',
		};

		return this.setupAPIService.doRequest(req);
	}

	public getOperationById(id) {

		const req = {
			method: 'GET',
			url: this.BASE_URL + '/' + id,
		};

		return this.setupAPIService.doRequest(req);
	}

	public getList() {

		const req = {
			method: 'GET',
			url: this.BASE_URL + '/list',
		};

		return this.setupAPIService.doRequest(req);
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

		return this.setupAPIService.doRequest(req);

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

		return this.setupAPIService.doRequest(req);
	}

	public getDefaultFields(type) {
		const req = {
			method: 'GET',
			url: this.BASE_URL + '/default?type=' + type,
			headers: {
				'Content-Type': 'application/json',
			},
		};

		return this.setupAPIService.doRequest(req);
	}

	// function getOperationReadings(operationId, successCallback, errorCallback) {

	// 	$http.get(BASE_URL + '/' + operationId + '/readings')
	// 		.then(
	// 			function (response) {
	// 				successCallback && successCallback(response.data.data);
	// 			},
	// 			function (error) {
	// 				setupAPIService.generateToast(error.data, true);
	// 				errorCallback && errorCallback(error);
	// 			}
	// 		);
	// }

	public getOperationQueue(wellId) {

		const req = {
			method: 'GET',
			url: this.xpdAccessService.getSetupURL() + 'operation-resources/operations-queue/' + wellId,
		};

		return this.setupAPIService.doRequest(req);
	}
}

// })();
