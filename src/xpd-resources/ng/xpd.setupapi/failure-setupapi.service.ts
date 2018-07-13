import { XPDAccessFactory } from '../xpd.access/accessfactory.factory';
import { SetupAPIService } from './setupapi.service';

// (function() {
// 	'use strict';

// 	angular.module('xpd.setupapi')
// 		.service('failureSetupAPIService', failureSetupAPIService);

// 	failureSetupAPIService.$inject = ['xpdAccessFactory', 'setupAPIService'];

export class FailureSetupAPIService {

	public static $inject: string[] = ['xpdAccessFactory', 'setupAPIService'];
	public BASE_URL: string;

	constructor(private xpdAccessFactory: XPDAccessFactory, private setupAPIService: SetupAPIService) {
		this.BASE_URL = xpdAccessFactory.getSetupURL() + 'setup/failure';
	}

	public updateObject(failure, successCallback?, errorCallback?) {

		const req = {
			method: 'PUT',
			url: this.BASE_URL + '/' + failure.id,
			headers: {
				'Content-Type': 'application/json',
			},
			data: failure,
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

	public getFailuresOnInterval(from, to, successCallback, errorCallback) {
		const url = this.BASE_URL + '/get-by-interval?from=' + from + '&to=' + to;

		const req = {
			method: 'GET',
			url,
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

	public listFailuresOnGoing(successCallback, errorCallback?) {
		const url = this.BASE_URL + '/list-on-going';

		const req = {
			method: 'GET',
			url,
		};

		this.setupAPIService.doRequest(req, successCallback, errorCallback);
	}

	public listFailures(successCallback, errorCallback) {
		const url = this.BASE_URL + '/list';

		const req = {
			method: 'GET',
			url,
		};

		this.setupAPIService.doRequest(req, successCallback, errorCallback);
	}
}

// })();
