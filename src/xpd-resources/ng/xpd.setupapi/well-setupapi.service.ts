import { XPDAccessService } from '../xpd.access/access.service';
import { SetupAPIService } from './setupapi.service';

// (function() {
// 	'use strict';

// 	angular.module('xpd.setupapi')
// 		.service('wellSetupAPIService', wellSetupAPIService);

// 	wellSetupAPIService.$inject = ['xpdAccessService', 'setupAPIService'];

export class WellSetupAPIService {

	public static $inject: string[] = ['xpdAccessService', 'setupAPIService'];
	public BASE_URL: string;

	constructor(
		private xpdAccessService: XPDAccessService,
		private setupAPIService: SetupAPIService) {
		this.BASE_URL = xpdAccessService.getSetupURL() + 'setup/well';
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

	public removeObject(object, successCallback, errorCallback?) {

		const req = {
			method: 'DELETE',
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

	public getList(successCallback, errorCallback?) {

		const req = {
			method: 'GET',
			url: this.BASE_URL + '/list',
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

}

// })();
