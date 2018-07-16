import { XPDAccessService } from '../xpd.access/access.service';
import { SetupAPIService } from './setupapi.service';

// (function() {
// 	'use strict';

// 	angular.module('xpd.setupapi').service('operationSetupAPIService', operationSetupAPIService);

// 	operationSetupAPIService.$inject = ['xpdAccessService', 'setupAPIService'];

export class OperationSetupAPIService {

	public static $inject: string[] = ['xpdAccessService', 'setupAPIService'];
	public BASE_URL: string;

	constructor(private xpdAccessService: XPDAccessService, private setupAPIService: SetupAPIService) {
		this.BASE_URL = xpdAccessService.getSetupURL() + 'setup/operation';
	}

	public getOperationAlarms(operationId, successCallback, errorCallback?) {

		const req = {
			method: 'GET',
			url: this.BASE_URL + '/' + operationId + '/alarms',
		};

		this.setupAPIService.doRequest(req, successCallback, errorCallback);
	}

	public getObjectById(id, successCallback, errorCallback?) {

		const req = {
			method: 'GET',
			url: this.BASE_URL + '/' + id,
		};

		this.setupAPIService.doRequest(req, successCallback, errorCallback);
	}

	public getList(successCallback, errorCallback?) {

		const req = {
			method: 'GET',
			url: this.BASE_URL + '/list',
		};

		this.setupAPIService.doRequest(req, successCallback, errorCallback);
	}

	public insertObject(object, successCallback, errorCallback?) {

		const req = {
			method: 'POST',
			url: this.BASE_URL,
			headers: {
				'Content-Type': 'application/json',
			},
			data: object,
		};

		this.setupAPIService.doRequest(req, successCallback, errorCallback);

	}

	public updateObject(object, successCallback, errorCallback?) {

		const req = {
			method: 'PUT',
			url: this.BASE_URL + '/' + object.id,
			headers: {
				'Content-Type': 'application/json',
			},
			data: object,
		};

		this.setupAPIService.doRequest(req, successCallback, errorCallback);
	}

	public getDefaultFields(type, successCallback, errorCallback?) {
		const req = {
			method: 'GET',
			url: this.BASE_URL + '/default?type=' + type,
			headers: {
				'Content-Type': 'application/json',
			},
		};

		this.setupAPIService.doRequest(req, successCallback, errorCallback);
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

	public getOperationQueue(wellId, successCallback, errorCallback?) {

		const req = {
			method: 'GET',
			url: this.xpdAccessService.getSetupURL() + 'operation-resources/operations-queue/' + wellId,
		};

		this.setupAPIService.doRequest(req, successCallback, errorCallback);
	}
}

// })();
