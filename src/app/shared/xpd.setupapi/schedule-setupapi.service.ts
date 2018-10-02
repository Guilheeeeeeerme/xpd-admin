import { XPDAccessService } from '../xpd.access/access.service';
import { SetupAPIService } from './setupapi.service';

// (function() {
// 	'use strict';

// 		.service('scheduleSetupAPIService', scheduleSetupAPIService);

// 	scheduleSetupAPIService.$inject = ['xpdAccessService', 'setupAPIService'];

export class ScheduleSetupAPIService {

	public static $inject: string[] = ['xpdAccessService', 'setupAPIService'];
	public BASE_URL: string;
	public FUNCTION_URL: string;
	public MEMBER_URL: string;
	public SCHEDULE_URL: string;

	constructor(private xpdAccessService: XPDAccessService, private setupAPIService: SetupAPIService) {
		this.BASE_URL = xpdAccessService.getSetupAPIURL();
		this.FUNCTION_URL = this.BASE_URL + 'setup/function';
		this.MEMBER_URL = this.BASE_URL + 'setup/member';
		this.SCHEDULE_URL = this.BASE_URL + 'setup/schedule';
	}

	/**
	 * Function
	 * setup/function
	 */
	public getFunctionById(id) {

		const req = {
			method: 'GET',
			url: this.FUNCTION_URL + '/' + id,
		};

		return this.setupAPIService.doRequest(req, false);

	}

	public insertFunction(object) {

		const req = {
			method: 'POST',
			url: this.FUNCTION_URL,
			headers: {
				'Content-Type': 'application/json',
			},
			data: object,
		};

		return this.setupAPIService.doRequest(req, true);
	}

	public updateFunction(object) {

		const req = {
			method: 'PUT',
			url: this.FUNCTION_URL + '/' + object.id,
			headers: {
				'Content-Type': 'application/json',
			},
			data: object,
		};

		return this.setupAPIService.doRequest(req, true);
	}

	public removeFunction(object) {

		const req = {
			method: 'DELETE',
			url: this.FUNCTION_URL, // + '/' + object.id,
			headers: {
				'Content-Type': 'application/json',
			},
			data: { id: object.id },
		};

		return this.setupAPIService.doRequest(req, true);
	}

	/**
	 * Member
	 * setup/member
	 */
	public updateMember(object) {

		const req = {
			method: 'PUT',
			url: this.MEMBER_URL + '/' + object.id,
			headers: {
				'Content-Type': 'application/json',
			},
			data: object,
		};

		return this.setupAPIService.doRequest(req, true);
	}

	public getMemberById(id) {

		const req = {
			method: 'GET',
			url: this.MEMBER_URL + '/' + id,
		};

		return this.setupAPIService.doRequest(req, false);

	}

	public indentificationExists(id, identification) {

		const req = {
			method: 'GET',
			url: this.MEMBER_URL + '/identification-exists/' + identification,
		};

		if (id) {
			req.url += '/exclude-member/' + id;
		}

		return this.setupAPIService.doRequest(req, false);

	}

	public insertMember(object) {

		const req = {
			method: 'POST',
			url: this.MEMBER_URL,
			headers: {
				'Content-Type': 'application/json',
			},
			data: object,
		};

		return this.setupAPIService.doRequest(req, true);
	}

	public removeMember(object) {

		const req = {
			method: 'DELETE',
			url: this.MEMBER_URL, // + '/' + object.id,
			headers: {
				'Content-Type': 'application/json',
			},
			data: { id: object.id },
		};

		return this.setupAPIService.doRequest(req, true);
	}

	public getMemberScore() {

		const req = {
			method: 'GET',
			url: this.MEMBER_URL + '/score/list',
			headers: {
				'Content-Type': 'application/json',
			},
		};

		return this.setupAPIService.doRequest(req, false);
	}

	/**
	 * Schedule
	 * setup/schedule
	 */
	public getScheduleById(id) {

		const req = {
			method: 'GET',
			url: this.SCHEDULE_URL + '/' + id,
		};

		return this.setupAPIService.doRequest(req, false);
	}

	public removeSchedule(object) {

		const req = {
			method: 'DELETE',
			url: this.SCHEDULE_URL, //  + '/' + object.id,
			headers: {
				'Content-Type': 'application/json',
			},
			data: { id: object.id },
		};

		return this.setupAPIService.doRequest(req, true);
	}

	public insertSchedule(object) {

		const req = {
			method: 'POST',
			url: this.SCHEDULE_URL,
			headers: {
				'Content-Type': 'application/json',
			},
			data: object,
		};

		return this.setupAPIService.doRequest(req, true);
	}

	public updateSchedule(object) {

		const req = {
			method: 'PUT',
			url: this.SCHEDULE_URL + '/' + object.id,
			headers: {
				'Content-Type': 'application/json',
			},
			data: object,
		};

		return this.setupAPIService.doRequest(req, true);
	}

	/**
	 * Busca toda a agenda de todos os membros QUE TEM ALGUMA SCHEDULE em um intervalo
	 * @param {millis} fromDate
	 * @param {millis} toDate
	 * @param {callback} successCallback
	 * @param {errorCallback} errorCallback
	 */
	public getOnlyScheduled(fromDate, toDate) {

		let url = this.SCHEDULE_URL + '/schedule-by-range-date?';
		url += 'fromDate=' + fromDate + '&';
		url += 'toDate=' + toDate;

		const req = {
			method: 'GET',
			url,
		};

		return this.setupAPIService.doRequest(req, false);
	}

	/**
	 * Busca toda a agenda de todos os membros em um intervalo
	 * @param {millis} fromDate
	 * @param {millis} toDate
	 * @param {callback} successCallback
	 * @param {errorCallback} errorCallback
	 */
	public fullScheduleByRangeDate(fromDate, toDate) {

		let url = this.SCHEDULE_URL + '/full-schedule-by-range-date?';
		url += 'fromDate=' + fromDate + '&';
		url += 'toDate=' + toDate;

		const req = {
			method: 'GET',
			url,
		};

		return this.setupAPIService.doRequest(req, false);
	}

	/**
	 * Sends afake schedule of a member, than the systems deletes ALL the schedules of this member
	 * and returns a list of id os those who were deleted
	 * @param {*} schedule
	 * @param {*} successCallback
	 * @param {*} errorCallback
	 */
	public getCleanListBySchedule(schedule) {

		const req = {
			method: 'POST',
			url: this.SCHEDULE_URL + '/clean-list-by-schedule',
			headers: {
				'Content-Type': 'application/json',
			},
			data: schedule,
		};

		return this.setupAPIService.doRequest(req, false);

	}

}

// }) ();
