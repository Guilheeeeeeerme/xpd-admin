import { XPDAccessService } from '../xpd.access/access.service';
import { SetupAPIService } from './setupapi.service';

// (function() {
// 	'use strict';

// 		.service('reportsSetupAPIService', reportsSetupAPIService);

	// reportsSetupAPIService.$inject = ['xpdAccessService', 'setupAPIService'];

export class ReportsSetupAPIService {

	public static $inject: string[] = ['xpdAccessService', 'setupAPIService'];
	public BASE_URL: string;

	constructor(private xpdAccessService: XPDAccessService, private setupAPIService: SetupAPIService) {
		this.BASE_URL = xpdAccessService.getSetupURL() + 'setup/reports';
	}

	public getVreList(fromDate, toDate) {

		let url = this.BASE_URL + '/vre?';
		url += 'from=' + fromDate.getTime();
		url += '&to=' + toDate.getTime();

		const req = {
			method: 'GET',
			url,
		};

		return this.setupAPIService.doRequest(req);
	}

	public getVreScoreList(fromDate, toDate) {
		let url = this.BASE_URL + '/vre-score?';
		url += 'from=' + fromDate.getTime();
		url += '&to=' + toDate.getTime();

		const req = {
			method: 'GET',
			url,
		};

		return this.setupAPIService.doRequest(req);
	}

	public getPlannedGraphicDataOperation(operationId) {
		const req = {
			method: 'GET',
			url: this.BASE_URL + '/planned-operation-graphic-data?'
				+ 'operation-id=' + operationId,
		};
		return this.setupAPIService.doRequest(req);
	}

	public getRealizedGraphicDataOperation(operationId) {
		const req = {
			method: 'GET',
			url: this.BASE_URL + '/realized-operation-graphic-data?' +
				'operation-id=' + operationId,
		};

		return this.setupAPIService.doRequest(req);
	}

	public getHistogramData(fromDate, toDate) {
		let url = this.BASE_URL + '/histogram?';
		url += 'from=' + fromDate.getTime();
		url += '&to=' + toDate.getTime();

		const req = {
			method: 'GET',
			url,
		};

		return this.setupAPIService.doRequest(req);
	}

	public getNeedleDataChart(fromDate, toDate) {
		let url = this.BASE_URL + '/needle?';
		url += 'from=' + fromDate.getTime();
		url += '&to=' + toDate.getTime();

		const req = {
			method: 'GET',
			url,
		};

		return this.setupAPIService.doRequest(req);
	}

	public getFailuresNptDataChart(fromDate, toDate) {
		let url = this.BASE_URL + '/failure-category?';
		url += 'from=' + fromDate.getTime();
		url += '&to=' + toDate.getTime();

		const req = {
			method: 'GET',
			url,
		};

		return this.setupAPIService.doRequest(req);
	}

	public getLessonsLearnedDataChart(fromDate, toDate) {
		let url = this.BASE_URL + '/lesson-learned-category?';
		url += 'from=' + fromDate.getTime();
		url += '&to=' + toDate.getTime();

		const req = {
			method: 'GET',
			url,
		};

		return this.setupAPIService.doRequest(req);
	}

	public getOperationQueue(wellId) {

		const req = {
			method: 'GET',
			url: this.xpdAccessService.getReportsAPIURL() + 'planning/well/' + wellId,
		};

		return this.setupAPIService.doRequest(req);

	}

	public getBitDepthChartForOperation(wellId, operationId) {

		const req = {
			method: 'GET',
			url: this.xpdAccessService.getReportsAPIURL() + 'planning/well/' + wellId + '/operation/' + operationId,
		};

		return this.setupAPIService.doRequest(req);

	}

	public getOperationExecuted(operationId) {

		const req = {
			method: 'GET',
			url: this.xpdAccessService.getReportsAPIURL() + 'executed/operation/' + operationId,
		};

		return this.setupAPIService.doRequest(req);

	}

}
// })();
