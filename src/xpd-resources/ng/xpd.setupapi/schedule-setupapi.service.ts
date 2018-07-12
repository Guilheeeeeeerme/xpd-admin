// (function() {
// 	'use strict';

// 	angular.module('xpd.setupapi')
// 		.service('scheduleSetupAPIService', scheduleSetupAPIService);

// 	scheduleSetupAPIService.$inject = ['xpdAccessFactory', 'setupAPIService'];

export class ScheduleSetupAPIService {

	public static $inject: string[] = ['xpdAccessFactory', 'setupAPIService'];
	public BASE_URL: string;
	public FUNCTION_URL: string;
	public MEMBER_URL: string;
	public SCHEDULE_URL: string;

	constructor(private xpdAccessFactory: XPDAccessFactory, private setupAPIService: SetupAPIService) {
		this.BASE_URL = xpdAccessFactory.getSetupURL();
		this.FUNCTION_URL = this.BASE_URL + 'setup/function';
		this.MEMBER_URL = this.BASE_URL + 'setup/member';
		this.SCHEDULE_URL = this.BASE_URL + 'setup/schedule';
	}

	/**
	 * Function
	 * setup/function
	 */
	public getFunctionById(id, successCallback, errorCallback) {

		const req = {
			method: 'GET',
			url: this.FUNCTION_URL + '/' + id,
		};

		this.setupAPIService.doRequest(req, successCallback, errorCallback);

	}

	public insertFunction(object, successCallback, errorCallback) {

		const req = {
			method: 'POST',
			url: this.FUNCTION_URL,
			headers: {
				'Content-Type': 'application/json',
			},
			data: object,
		};

		this.setupAPIService.doRequest(req, successCallback, errorCallback);
	}

	public updateFunction(object, successCallback, errorCallback) {

		const req = {
			method: 'PUT',
			url: this.FUNCTION_URL + '/' + object.id,
			headers: {
				'Content-Type': 'application/json',
			},
			data: object,
		};

		this.setupAPIService.doRequest(req, successCallback, errorCallback);
	}

	public removeFunction(object, successCallback, errorCallback) {

		const req = {
			method: 'DELETE',
			url: this.FUNCTION_URL, // + '/' + object.id,
			headers: {
				'Content-Type': 'application/json',
			},
			data: { id: object.id },
		};

		this.setupAPIService.doRequest(req, successCallback, errorCallback);
	}

	/**
	 * Member
	 * setup/member
	 */
	public updateMember(object, successCallback, errorCallback) {

		const req = {
			method: 'PUT',
			url: this.MEMBER_URL + '/' + object.id,
			headers: {
				'Content-Type': 'application/json',
			},
			data: object,
		};

		this.setupAPIService.doRequest(req, successCallback, errorCallback);
	}

	public getMemberById(id, successCallback, errorCallback) {

		const req = {
			method: 'GET',
			url: this.MEMBER_URL + '/' + id,
		};

		this.setupAPIService.doRequest(req, successCallback, errorCallback);

	}

	public indentificationExists(id, identification, successCallback, errorCallback) {

		const req = {
			method: 'GET',
			url: this.MEMBER_URL + '/identification-exists/' + identification,
		};

		if (id) {
			req.url += '/exclude-member/' + id;
		}

		this.setupAPIService.doRequest(req, successCallback, errorCallback);

	}

	public insertMember(object, successCallback, errorCallback) {

		const req = {
			method: 'POST',
			url: this.MEMBER_URL,
			headers: {
				'Content-Type': 'application/json',
			},
			data: object,
		};

		this.setupAPIService.doRequest(req, successCallback, errorCallback);
	}

	public removeMember(object, successCallback, errorCallback) {

		const req = {
			method: 'DELETE',
			url: this.MEMBER_URL, // + '/' + object.id,
			headers: {
				'Content-Type': 'application/json',
			},
			data: { id: object.id },
		};

		this.setupAPIService.doRequest(req, successCallback, errorCallback);
	}

	public getMemberScore(successCallback, errorCallback) {

		const req = {
			method: 'GET',
			url: this.MEMBER_URL + '/score/list',
			headers: {
				'Content-Type': 'application/json',
			},
		};

		this.setupAPIService.doRequest(req, successCallback, errorCallback);
	}

	/**
	 * Schedule
	 * setup/schedule
	 */
	public getScheduleById(id, successCallback, errorCallback) {

		const req = {
			method: 'GET',
			url: this.SCHEDULE_URL + '/' + id,
		};

		this.setupAPIService.doRequest(req, successCallback, errorCallback);
	}

	public removeSchedule(object, successCallback, errorCallback) {

		const req = {
			method: 'DELETE',
			url: this.SCHEDULE_URL, //  + '/' + object.id,
			headers: {
				'Content-Type': 'application/json',
			},
			data: { id: object.id },
		};

		this.setupAPIService.doRequest(req, successCallback, errorCallback);
	}

	public insertSchedule(object, successCallback, errorCallback) {

		const req = {
			method: 'POST',
			url: this.SCHEDULE_URL,
			headers: {
				'Content-Type': 'application/json',
			},
			data: object,
		};

		this.setupAPIService.doRequest(req, successCallback, errorCallback);
	}

	public updateSchedule(object, successCallback, errorCallback) {

		const req = {
			method: 'PUT',
			url: this.SCHEDULE_URL + '/' + object.id,
			headers: {
				'Content-Type': 'application/json',
			},
			data: object,
		};

		this.setupAPIService.doRequest(req, successCallback, errorCallback);
	}

	/**
	 * Busca toda a agenda de todos os membros QUE TEM ALGUMA SCHEDULE em um intervalo
	 * @param {millis} fromDate
	 * @param {millis} toDate
	 * @param {callback} successCallback
	 * @param {errorCallback} errorCallback
	 */
	public getOnlyScheduled(fromDate, toDate, successCallback, errorCallback) {

		let url = this.SCHEDULE_URL + '/schedule-by-range-date?';
		url += 'fromDate=' + fromDate + '&';
		url += 'toDate=' + toDate;

		const req = {
			method: 'GET',
			url,
		};

		this.setupAPIService.doRequest(req, successCallback, errorCallback);
	}

	/**
	 * Busca toda a agenda de todos os membros em um intervalo
	 * @param {millis} fromDate
	 * @param {millis} toDate
	 * @param {callback} successCallback
	 * @param {errorCallback} errorCallback
	 */
	public fullScheduleByRangeDate(fromDate, toDate, successCallback, errorCallback) {

		let url = this.SCHEDULE_URL + '/full-schedule-by-range-date?';
		url += 'fromDate=' + fromDate + '&';
		url += 'toDate=' + toDate;

		const req = {
			method: 'GET',
			url,
		};

		this.setupAPIService.doRequest(req, successCallback, errorCallback);
	}

	/**
	 * Sends afake schedule of a member, than the systems deletes ALL the schedules of this member
	 * and returns a list of id os those who were deleted
	 * @param {*} schedule
	 * @param {*} successCallback
	 * @param {*} errorCallback
	 */
	public getCleanListBySchedule(schedule, successCallback, errorCallback) {

		const req = {
			method: 'POST',
			url: this.SCHEDULE_URL + '/clean-list-by-schedule',
			headers: {
				'Content-Type': 'application/json',
			},
			data: schedule,
		};

		this.setupAPIService.doRequest(req, successCallback, errorCallback);

	}

}

// }) ();
