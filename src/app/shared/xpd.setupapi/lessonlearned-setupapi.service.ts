import { XPDAccessService } from '../xpd.access/access.service';
import { SetupAPIService } from './setupapi.service';

// (function() {
// 	'use strict';

// 		.service('lessonLearnedSetupAPIService', lessonLearnedSetupAPIService);

// 	lessonLearnedSetupAPIService.$inject = ['xpdAccessService', 'setupAPIService'];

export class LessonLearnedSetupAPIService {

	public static $inject: string[] = ['xpdAccessService', 'setupAPIService'];
	public BASE_URL: string;

	constructor(private xpdAccessService: XPDAccessService, private setupAPIService: SetupAPIService) {
		this.BASE_URL = xpdAccessService.getSetupAPIURL() + 'setup/lessonlearned';
	}

	public getList() {

		const url = this.BASE_URL + '/list';

		const req = {
			method: 'GET',
			url,
		};

		return this.setupAPIService.doRequest(req, false);
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

	public removeObject(object) {

		const req = {
			method: 'DELETE',
			url: this.BASE_URL,
			headers: {
				'Content-Type': 'application/json',
			},
			data: object,
		};

		return this.setupAPIService.doRequest(req, true);
	}

	public getListCategory() {
		// lessonlearned_category

		const req = {
			method: 'GET',
			url: this.BASE_URL + '_category/list',
		};

		return this.setupAPIService.doRequest(req, false);
	}

	public removeCategory(object) {
		// lessonlearned_category

		const req = {
			method: 'DELETE',
			url: this.BASE_URL + '_category',
			headers: {
				'Content-Type': 'application/json',
			},
			data: object,
		};

		return this.setupAPIService.doRequest(req, true);

	}

	public insertCategory(object) {
		// lessonlearned_category

		const req = {
			method: 'POST',
			url: this.BASE_URL + '_category',
			headers: {
				'Content-Type': 'application/json',
			},
			data: object,
		};

		return this.setupAPIService.doRequest(req, true);

	}

	public updateCategory(object) {
		// lessonlearned_category

		const req = {
			method: 'PUT',
			url: this.BASE_URL + '_category/' + object.id,
			headers: {
				'Content-Type': 'application/json',
			},
			data: object,
		};

		return this.setupAPIService.doRequest(req, true);

	}
}
// })();
