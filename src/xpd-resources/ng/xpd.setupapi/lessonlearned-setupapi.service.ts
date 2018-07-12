// (function() {
// 	'use strict';

// 	angular.module('xpd.setupapi')
// 		.service('lessonLearnedSetupAPIService', lessonLearnedSetupAPIService);

// 	lessonLearnedSetupAPIService.$inject = ['xpdAccessFactory', 'setupAPIService'];

export class LessonLearnedSetupAPIService {

	public static $inject: string[] = ['xpdAccessFactory', 'setupAPIService'];
	public BASE_URL: string;

	constructor(private xpdAccessFactory: XPDAccessFactory, private setupAPIService: SetupAPIService) {
		this.BASE_URL = xpdAccessFactory.getSetupURL() + 'setup/lessonlearned';
	}

	public getList(successCallback, errorCallback) {

		const url = this.BASE_URL + '/list';

		const req = {
			method: 'GET',
			url,
		};

		this.setupAPIService.doRequest(req, successCallback, errorCallback);
	}

	public updateObject(object, successCallback, errorCallback) {

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

	public insertObject(object, successCallback, errorCallback) {

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

	public removeObject(object, successCallback, errorCallback) {

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

	public getListCategory(successCallback, errorCallback) {
		// lessonlearned_category

		const req = {
			method: 'GET',
			url: this.BASE_URL + '_category/list',
		};

		this.setupAPIService.doRequest(req, successCallback, errorCallback);
	}

	public removeCategory(object, successCallback, errorCallback) {
		// lessonlearned_category

		const req = {
			method: 'DELETE',
			url: this.BASE_URL + '_category',
			headers: {
				'Content-Type': 'application/json',
			},
			data: object,
		};

		this.setupAPIService.doRequest(req, successCallback, errorCallback);

	}

	public insertCategory(object, successCallback, errorCallback) {
		// lessonlearned_category

		const req = {
			method: 'POST',
			url: this.BASE_URL + '_category',
			headers: {
				'Content-Type': 'application/json',
			},
			data: object,
		};

		this.setupAPIService.doRequest(req, successCallback, errorCallback);

	}

	public updateCategory(object, successCallback, errorCallback) {
		// lessonlearned_category

		const req = {
			method: 'PUT',
			url: this.BASE_URL + '_category/' + object.id,
			headers: {
				'Content-Type': 'application/json',
			},
			data: object,
		};

		this.setupAPIService.doRequest(req, successCallback, errorCallback);

	}
}
// })();
