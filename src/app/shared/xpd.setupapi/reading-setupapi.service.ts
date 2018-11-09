import { XPDAccessService } from '../xpd.access/access.service';
import { SetupAPIService } from './setupapi.service';

// (function() {
// 	'use strict';

// 	readingSetupAPIService.$inject = ['xpdAccessService', 'setupAPIService'];

export class ReadingSetupAPIService {

	public static $inject: string[] = ['xpdAccessService', 'setupAPIService'];
	public BASE_URL: string;

	constructor(private xpdAccessService: XPDAccessService, private setupAPIService: SetupAPIService) {
		this.BASE_URL = xpdAccessService.getReportsAPIURL() + 'executed/readings';
	}

	public getAllReadingSince(from, tracks) {
		const req = {
			method: 'POST',
			url: this.BASE_URL + '/from/' + from,
			headers: {
				'Content-Type': 'application/json',
			},
			data: tracks,
		};

		return this.setupAPIService.doRequest(req, false);
	}

	public getTick(tick, tracks) {
		const req = {
			method: 'POST',
			url: this.BASE_URL + '/tick/' + tick,
			headers: {
				'Content-Type': 'application/json',
			},
			data: tracks,
		};

		return this.setupAPIService.doRequest(req, false, true);
	}

	public getAllReadingByStartEndTime(from, to, tracks) {
		const req = {
			method: 'POST',
			url: this.BASE_URL + '/from/' + from + ((to) ? ('/to/' + to) : ''),
			headers: {
				'Content-Type': 'application/json',
			},
			data: tracks,
		};

		return this.setupAPIService.doRequest(req, false);
	}
}

// })();
