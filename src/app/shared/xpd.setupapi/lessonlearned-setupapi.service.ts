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
		this.BASE_URL = xpdAccessService.getSetupURL() + 'setup/lessonlearned';
	}

	public getList() {

		const url = this.BASE_URL + '/list';

		const req = {
			method: 'GET',
			url,
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

	// function listByOperation(id, successCallback, errorCallback) {

	// 	var url = BASE_URL + '/list-by-operation/' + id;

	// 	$http.get(url)
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

	public getListCategory() {
		// lessonlearned_category

		const req = {
			method: 'GET',
			url: this.BASE_URL + '_category/list',
		};

		return this.setupAPIService.doRequest(req);
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

		return this.setupAPIService.doRequest(req);

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

		return this.setupAPIService.doRequest(req);

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

		return this.setupAPIService.doRequest(req);

	}
}
// })();
