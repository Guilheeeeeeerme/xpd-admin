import { XPDAccessService } from '../xpd.access/access.service';
import { SetupAPIService } from './setupapi.service';

// (function() {
// 	'use strict';

// 		.service('failureSetupAPIService', failureSetupAPIService);

// 	failureSetupAPIService.$inject = ['xpdAccessService', 'setupAPIService'];

export class FailureSetupAPIService {

	public static $inject: string[] = ['xpdAccessService', 'setupAPIService'];
	public BASE_URL: string;

	constructor(private xpdAccessService: XPDAccessService, private setupAPIService: SetupAPIService) {
		this.BASE_URL = xpdAccessService.getSetupAPIURL() + 'setup/failure';
	}

	public updateObject(failure) {

		const req = {
			method: 'PUT',
			url: this.BASE_URL + '/' + failure.id,
			headers: {
				'Content-Type': 'application/json',
			},
			data: failure,
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

	public getFailuresOnInterval(from, to) {
		const url = this.BASE_URL + '/get-by-interval?from=' + from + '&to=' + to;

		const req = {
			method: 'GET',
			url,
		};

		return this.setupAPIService.doRequest(req, false);
	}

	public listFailuresOnGoing() {
		const url = this.BASE_URL + '/list-on-going';

		const req = {
			method: 'GET',
			url,
		};

		return this.setupAPIService.doRequest(req, false);
	}

	public listFailures() {
		const url = this.BASE_URL + '/list';

		const req = {
			method: 'GET',
			url,
		};

		return this.setupAPIService.doRequest(req, false);
	}
}

// })();
