import { XPDAccessFactory } from '../xpd.access/accessfactory.factory';
import { SetupAPIService } from './setupapi.service';

// (function() {
// 	'use strict';

// 	angular.module('xpd.setupapi')
// 		.service('reportsSetupAPIService', reportsSetupAPIService);

	// reportsSetupAPIService.$inject = ['xpdAccessFactory', 'setupAPIService'];

export class ReportsSetupAPIService {

	public static $inject: string[] = ['xpdAccessFactory', 'setupAPIService'];
	public BASE_URL: string;

	constructor(private xpdAccessFactory: XPDAccessFactory, private setupAPIService: SetupAPIService) {
		this.BASE_URL = xpdAccessFactory.getSetupURL() + 'setup/reports';
	}

	public getVreList(fromDate, toDate, successCallback, errorCallback) {

		let url = this.BASE_URL + '/vre?';
		url += 'from=' + fromDate.getTime();
		url += '&to=' + toDate.getTime();

		const req = {
			method: 'GET',
			url,
		};

		this.setupAPIService.doRequest(req, successCallback, errorCallback);
	}

	public getVreScoreList(fromDate, toDate, successCallback, errorCallback) {
		let url = this.BASE_URL + '/vre-score?';
		url += 'from=' + fromDate.getTime();
		url += '&to=' + toDate.getTime();

		const req = {
			method: 'GET',
			url,
		};

		this.setupAPIService.doRequest(req, successCallback, errorCallback);
	}

	public getPlannedGraphicDataOperation(operationId, successCallback, errorCallback) {
		const req = {
			method: 'GET',
			url: this.BASE_URL + '/planned-operation-graphic-data?'
				+ 'operation-id=' + operationId,
		};
		this.setupAPIService.doRequest(req, successCallback, errorCallback);
	}

	public getRealizedGraphicDataOperation(operationId, successCallback, errorCallback) {
		const req = {
			method: 'GET',
			url: this.BASE_URL + '/realized-operation-graphic-data?' +
				'operation-id=' + operationId,
		};

		this.setupAPIService.doRequest(req, successCallback, errorCallback);
	}

	public getHistogramData(fromDate, toDate, successCallback, errorCallback) {
		let url = this.BASE_URL + '/histogram?';
		url += 'from=' + fromDate.getTime();
		url += '&to=' + toDate.getTime();

		const req = {
			method: 'GET',
			url,
		};

		this.setupAPIService.doRequest(req, successCallback, errorCallback);
	}

	public getNeedleDataChart(fromDate, toDate, successCallback, errorCallback) {
		let url = this.BASE_URL + '/needle?';
		url += 'from=' + fromDate.getTime();
		url += '&to=' + toDate.getTime();

		const req = {
			method: 'GET',
			url,
		};

		this.setupAPIService.doRequest(req, successCallback, errorCallback);
	}

	public getFailuresNptDataChart(fromDate, toDate, successCallback, errorCallback) {
		let url = this.BASE_URL + '/failure-category?';
		url += 'from=' + fromDate.getTime();
		url += '&to=' + toDate.getTime();

		const req = {
			method: 'GET',
			url,
		};

		this.setupAPIService.doRequest(req, successCallback, errorCallback);
	}

	public getLessonsLearnedDataChart(fromDate, toDate, successCallback, errorCallback) {
		let url = this.BASE_URL + '/lesson-learned-category?';
		url += 'from=' + fromDate.getTime();
		url += '&to=' + toDate.getTime();

		const req = {
			method: 'GET',
			url,
		};

		this.setupAPIService.doRequest(req, successCallback, errorCallback);
	}

	public getOperationQueue(wellId, successCallback, errorCallback) {

		const req = {
			method: 'GET',
			url: this.xpdAccessFactory.getReportsAPIURL() + 'planning/well/' + wellId,
		};

		this.setupAPIService.doRequest(req, successCallback, errorCallback);

	}

	public getBitDepthChartForOperation(wellId, operationId, successCallback, errorCallback) {

		const req = {
			method: 'GET',
			url: this.xpdAccessFactory.getReportsAPIURL() + 'planning/well/' + wellId + '/operation/' + operationId,
		};

		this.setupAPIService.doRequest(req, successCallback, errorCallback);

	}

	public getOperationExecuted(operationId, successCallback, errorCallback) {

		const req = {
			method: 'GET',
			url: this.xpdAccessFactory.getReportsAPIURL() + 'executed/operation/' + operationId,
		};

		this.setupAPIService.doRequest(req, successCallback, errorCallback);

	}

}
// })();
