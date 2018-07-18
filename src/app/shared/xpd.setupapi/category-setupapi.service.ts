import { XPDAccessService } from '../xpd.access/access.service';
import { SetupAPIService } from './setupapi.service';

// (function() {
// 	'use strict';

// 		.service('categorySetupAPIService', categorySetupAPIService);

// 	categorySetupAPIService.$inject = ['xpdAccessService', 'setupAPIService'];

export class CategorySetupAPIService {

	public static $inject: string[] = ['xpdAccessService', 'setupAPIService'];
	public BASE_URL: string;

	constructor(private xpdAccessService: XPDAccessService, private setupAPIService: SetupAPIService) {
		this.BASE_URL = xpdAccessService.getSetupURL() + 'setup/category';
	}

	public getCategoryName(id) {

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

	public removeObject(object) {

		const req = {
			method: 'DELETE',
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

}

// })();
