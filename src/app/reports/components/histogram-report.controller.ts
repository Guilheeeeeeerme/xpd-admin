import { ReportsSetupAPIService } from '../../shared/xpd.setupapi/reports-setupapi.service';

export class HistogramReportController {
	// 'use strict';

	public static $inject = ['$scope', 'reportsSetupAPIService'];
	public operationTypes: { none: { label: string; activities: any[]; }; bha: { label: string; activities: any[]; }; casing: { label: string; activities: any[]; }; riser: { label: string; activities: any[]; }; time: { label: string; activities: any[]; }; };

	constructor(
		private $scope: any,
		private reportsSetupAPIService: ReportsSetupAPIService) {
		const vm = this;

		const parentData = $scope.reportsData;

		$scope.histoData = {
			columns: 2,
			histograms: [],
		};

		$scope.inputIntevals = {};

		this.operationTypes = {
			none: {
				label: '',
				activities: [],
			},
			bha: {
				label: 'bha',
				activities: [],
			},
			casing: {
				label: 'casing',
				activities: [],
			},
			riser: {
				label: 'riser',
				activities: [],
			},
			time: {
				label: 'time',
				activities: [],
			},
		};

		reportsSetupAPIService.getHistogramData(
			parentData.fromDate,
			parentData.toDate).then(
				(arg) => { this.loadHistogramData(arg); },
				(arg) => { this.loadHistogramDataError(arg); },
		);
	}

	public getColSize() {
		return Math.floor(12 / this.$scope.histoData.columns);
	}

	public actionFilterButton(fromDate, toDate) {

		this.reportsSetupAPIService.getHistogramData(
			fromDate,
			toDate).then(
				(arg) => { this.loadHistogramData(arg); },
				(arg) => { this.loadHistogramDataError(arg); },
		);
	}

	private loadHistogramData(data) {
		this.operationTypes.none.activities = [];
		this.operationTypes.bha.activities = [];
		this.operationTypes.casing.activities = [];
		this.operationTypes.riser.activities = [];
		this.operationTypes.time.activities = [];

		this.groupOperationByState(data);

		this.$scope.histoData.isEmpty = this.operationTypes.none.activities.length === 0;

		this.$scope.histoData.isEmpty = this.$scope.histoData.isEmpty || this.operationTypes.bha.activities.length === 0;
		this.$scope.histoData.isEmpty = this.$scope.histoData.isEmpty || this.operationTypes.casing.activities.length === 0;
		this.$scope.histoData.isEmpty = this.$scope.histoData.isEmpty || this.operationTypes.riser.activities.length === 0;
		this.$scope.histoData.isEmpty = this.$scope.histoData.isEmpty || this.operationTypes.time.activities.length === 0;

		this.$scope.histoData.histograms = this.operationTypes;
	}

	private loadHistogramDataError(error) {
		console.log('Histogram request data error!');
		console.log(error);
	}

	private groupOperationByState(activities) {

		for (const i in activities) {
			if (activities[i].operationType === 'bha') {
				this.operationTypes.bha.activities.push(activities[i]);
			} else if (activities[i].operationType === 'casing') {
				this.operationTypes.casing.activities.push(activities[i]);
			} else if (activities[i].operationType === 'riser') {
				this.operationTypes.riser.activities.push(activities[i]);
			} else if (activities[i].operationType === 'time') {
				this.operationTypes.time.activities.push(activities[i]);
			} else {
				this.operationTypes.none.activities.push(activities[i]);
			}
		}
	}
}
// })();
