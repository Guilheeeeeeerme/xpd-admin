// (function() {
// 	'use strict';

// 	angular.module('xpd.setupapi').service('readingSetupAPIService', readingSetupAPIService);

// 	readingSetupAPIService.$inject = ['xpdAccessFactory', 'setupAPIService'];

export class ReadingSetupAPIService {

	public static $inject: string[] = ['xpdAccessFactory', 'setupAPIService'];
	public BASE_URL: string;

	constructor(private xpdAccessFactory: XPDAccessFactory, private setupAPIService: SetupAPIService) {
		this.BASE_URL = xpdAccessFactory.getSetupURL() + 'setup/reading';
	}

	public getAllReadingSince(from, successCallback, errorCallback) {
		const req = {
			method: 'GET',
			url: this.BASE_URL + '/from/' + from,
			headers: {
				'Content-Type': 'application/json',
			},
		};

		this.setupAPIService.doRequest(req, successCallback, errorCallback);
	}

	public getTick(tick, successCallback, errorCallback) {
		const req = {
			method: 'GET',
			url: this.BASE_URL + '/tick/' + tick,
			headers: {
				'Content-Type': 'application/json',
			},
		};

		this.setupAPIService.doRequest(req, successCallback, errorCallback);
	}

	public getAllReadingByStartEndTime(from, to, successCallback, errorCallback) {
		const req = {
			method: 'GET',
			url: this.BASE_URL + '/from/' + from + ((to) ? ('/to/' + to) : ''),
			// cache: (to) ? true : false,
			headers: {
				'Content-Type': 'application/json',
			},
		};

		this.setupAPIService.doRequest(req, successCallback, errorCallback);
	}
}

// })();
