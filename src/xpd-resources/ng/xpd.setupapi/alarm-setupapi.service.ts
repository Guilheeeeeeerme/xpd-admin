import { XPDAccessFactory } from '../xpd.access/accessfactory.factory';
import { SetupAPIService } from './setupapi.service';

// (function() {
// 	'use strict';

// 	angular.module('xpd.setupapi')
// 		.service('alarmSetupAPIService', alarmSetupAPIService);

// 	alarmSetupAPIService.$inject = ['xpdAccessFactory', 'setupAPIService'];

export class AlarmSetupAPIService {

	public static $inject: string[] = ['xpdAccessFactory', 'setupAPIService'];
	public BASE_URL: string;

	constructor(private xpdAccessFactory: XPDAccessFactory, private setupAPIService: SetupAPIService) {
		this.BASE_URL = xpdAccessFactory.getSetupURL() + 'setup/alarm';
	}

	public insertAlarm(alarm, successCallback, errorCallback) {

		const req = {
			method: 'POST',
			url: this.BASE_URL,
			headers: {
				'Content-Type': 'application/json',
			},
			data: alarm,
		};

		this.setupAPIService.doRequest(req, successCallback, errorCallback);
	}

	public removeAlarm(alarm, successCallback, errorCallback?) {

		const req = {
			method: 'DELETE',
			url: this.BASE_URL + '/' + alarm.id,
			headers: {
				'Content-Type': 'application/json',
			},
		};

		this.setupAPIService.doRequest(req, successCallback, errorCallback);
	}

	public updateAlarm(alarm, successCallback, errorCallback) {

		const req = {
			method: 'PUT',
			url: this.BASE_URL,
			headers: {
				'Content-Type': 'application/json',
			},
			data: alarm,
		};

		this.setupAPIService.doRequest(req, successCallback, errorCallback);
	}

	public updateArchive(id, archived, successCallback, errorCallback?) {
		const req = {
			method: 'GET',
			url: this.BASE_URL + '/' + id + '/archive/' + archived,
		};

		this.setupAPIService.doRequest(req, successCallback, errorCallback);
	}

	public getByOperationType(type, butNot, successCallback, errorCallback?) {

		const req = {
			method: 'GET',
			url: this.BASE_URL + '/of-operations/' + type + '/but-not-id/' + (butNot || 0),
		};

		this.setupAPIService.doRequest(req, successCallback, errorCallback);
	}
}

// })();
