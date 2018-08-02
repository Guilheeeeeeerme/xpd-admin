import { XPDAccessService } from '../xpd.access/access.service';
import { SetupAPIService } from './setupapi.service';

// (function() {
// 	'use strict';

// 	readingSetupAPIService.$inject = ['xpdAccessService', 'setupAPIService'];

export class ReadingSetupAPIService {

	public static $inject: string[] = ['xpdAccessService', 'setupAPIService'];
	public BASE_URL: string;

	constructor(private xpdAccessService: XPDAccessService, private setupAPIService: SetupAPIService) {
		this.BASE_URL = xpdAccessService.getSetupURL() + 'setup/reading';
	}

	public getAllReadingSince(from) {
		const req = {
			method: 'GET',
			url: this.BASE_URL + '/from/' + from,
			headers: {
				'Content-Type': 'application/json',
			},
		};

		return this.setupAPIService.doRequest(req);
	}

	public getTick(tick) {
		const req = {
			method: 'GET',
			url: this.BASE_URL + '/tick/' + tick,
			headers: {
				'Content-Type': 'application/json',
			},
		};

		return this.setupAPIService.doRequest(req);
	}

	public getAllReadingByStartEndTime(from, to) {
		const req = {
			method: 'GET',
			url: this.BASE_URL + '/from/' + from + ((to) ? ('/to/' + to) : ''),
			// cache: (to) ? true : false,
			headers: {
				'Content-Type': 'application/json',
			},
		};

		return this.setupAPIService.doRequest(req);
	}
}

// })();
