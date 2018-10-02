import { XPDAccessService } from '../xpd.access/access.service';
import { SetupAPIService } from './setupapi.service';

// (function() {
// 	'use strict';

// 		.service('alarmSetupAPIService', alarmSetupAPIService);

// 	alarmSetupAPIService.$inject = ['xpdAccessService', 'setupAPIService'];

export class AlarmSetupAPIService {

	public static $inject: string[] = ['xpdAccessService', 'setupAPIService'];
	public BASE_URL: string;

	constructor(private xpdAccessService: XPDAccessService, private setupAPIService: SetupAPIService) {
		this.BASE_URL = xpdAccessService.getSetupAPIURL() + 'setup/alarm';
	}

	public insertAlarm(alarm) {

		const req = {
			method: 'POST',
			url: this.BASE_URL,
			headers: {
				'Content-Type': 'application/json',
			},
			data: alarm,
		};

		return this.setupAPIService.doRequest(req, true);
	}

	public removeAlarm(alarm) {

		const req = {
			method: 'DELETE',
			url: this.BASE_URL + '/' + alarm.id,
			headers: {
				'Content-Type': 'application/json',
			},
		};

		return this.setupAPIService.doRequest(req, true);
	}

	public updateAlarm(alarm) {

		const req = {
			method: 'PUT',
			url: this.BASE_URL,
			headers: {
				'Content-Type': 'application/json',
			},
			data: alarm,
		};

		return this.setupAPIService.doRequest(req, true);
	}

	public updateArchive(id, archived) {
		const req = {
			method: 'GET',
			url: this.BASE_URL + '/' + id + '/archive/' + archived,
		};

		return this.setupAPIService.doRequest(req, true);
	}

	public getByOperationType(type, butNot) {

		const req = {
			method: 'GET',
			url: this.BASE_URL + '/of-operations/' + type + '/but-not-id/' + (butNot || 0),
		};

		return this.setupAPIService.doRequest(req, false);
	}
}

// })();
