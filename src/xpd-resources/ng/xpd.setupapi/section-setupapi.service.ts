import { XPDAccessService } from '../xpd.access/access.service';
import { SetupAPIService } from './setupapi.service';

// (function() {
// 	'use strict';

// 	angular.module('xpd.setupapi')
// 		.service('sectionSetupAPIService', sectionSetupAPIService);

// sectionSetupAPIService.$inject = ['xpdAccessService', 'setupAPIService'];

export class SectionSetupAPIService {
	public static $inject: string[] = ['xpdAccessService', 'setupAPIService'];
	public BASE_URL: string;

	constructor(private xpdAccessService: XPDAccessService, private setupAPIService: SetupAPIService) {
		this.BASE_URL = xpdAccessService.getSetupURL() + 'setup/section';
	}

	public getObjectById(id, successCallback, errorCallback?) {

		const req = {
			method: 'GET',
			url: this.BASE_URL + '/' + id,
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

	public getListOfSectionsByWell(wellId, successCallback, errorCallback?) {

		const url = this.BASE_URL + '/list-sections-by-well?wellId=' + wellId;

		const req = {
			method: 'GET',
			url,
		};

		this.setupAPIService.doRequest(req, successCallback, errorCallback);

	}

	public getListOfOperationsBySection(sectionId, successCallback, errorCallback?) {

		const url = this.BASE_URL + '/' + sectionId + '/operation';

		const req = {
			method: 'GET',
			url,
		};

		this.setupAPIService.doRequest(req, successCallback, errorCallback);
	}

}

// })();
