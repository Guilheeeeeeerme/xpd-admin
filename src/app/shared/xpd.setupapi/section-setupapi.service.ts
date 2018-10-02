import { XPDAccessService } from '../xpd.access/access.service';
import { SetupAPIService } from './setupapi.service';

// (function() {
// 	'use strict';

// 		.service('sectionSetupAPIService', sectionSetupAPIService);

// sectionSetupAPIService.$inject = ['xpdAccessService', 'setupAPIService'];

export class SectionSetupAPIService {
	public static $inject: string[] = ['xpdAccessService', 'setupAPIService'];
	public BASE_URL: string;

	constructor(private xpdAccessService: XPDAccessService, private setupAPIService: SetupAPIService) {
		this.BASE_URL = xpdAccessService.getSetupAPIURL() + 'setup/section';
	}

	public getObjectById(id) {

		const req = {
			method: 'GET',
			url: this.BASE_URL + '/' + id,
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

	public getListOfSectionsByWell(wellId) {

		const url = this.BASE_URL + '/list-sections-by-well?wellId=' + wellId;

		const req = {
			method: 'GET',
			url,
		};

		return this.setupAPIService.doRequest(req, false);

	}

	public getListOfOperationsBySection(sectionId) {

		const url = this.BASE_URL + '/' + sectionId + '/operation';

		const req = {
			method: 'GET',
			url,
		};

		return this.setupAPIService.doRequest(req, false);
	}

}

// })();
