import { ReportsSetupAPIService } from '../../shared/xpd.setupapi/reports-setupapi.service';

export class VREScoreController {
	// 'use-strict';

	public static $inject = ['$scope', 'reportsSetupAPIService'];
	public operationTypes: { none: { label: string; activities: any[]; }; bha: { label: string; activities: any[]; }; casing: { label: string; activities: any[]; }; riser: { label: string; activities: any[]; }; time: { label: string; activities: any[]; }; };

	constructor(
		private $scope,
		private reportsSetupAPIService: ReportsSetupAPIService) {

		const vm = this;

		$scope.vreScoredata = {
			fromDate: 0,
			toDate: 0,
			chartData: {},
		};

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

		this.getVreScoreList();
	}

	public onClickFilterButton(fromDate, toDate) {
		this.$scope.$parent.rController.getFailuresOnInterval(fromDate, toDate);

		if (toDate === undefined) { return false; }

		if (toDate >= fromDate) {
			this.reportsSetupAPIService.getVreScoreList(fromDate, toDate).then(
				(arg) => { this.getVreScoreListSuccess(arg); },
				(arg) => { this.getVreScoreListError(arg); },
			);
		} else {
			return false;
		}
	}

	private getVreScoreList() {

		const parentData = this.$scope.reportsData;

		this.reportsSetupAPIService.getVreScoreList(
			parentData.fromDate,
			parentData.toDate).then(
				(arg) => { this.getVreScoreListSuccess(arg); },
				(arg) => { this.getVreScoreListError(arg); },
		);
	}

	private getVreScoreListSuccess(result) {

		this.operationTypes.none.activities = [];
		this.operationTypes.bha.activities = [];
		this.operationTypes.casing.activities = [];
		this.operationTypes.riser.activities = [];
		this.operationTypes.time.activities = [];

		// setColorToLastIndexVre(result);
		this.groupOperationByState(result.activities);

		this.$scope.vreScoredata.chartData.scale = result.scale;
		this.$scope.vreScoredata.chartData.categories = result.categories;
		this.$scope.vreScoredata.chartData.operationTypes = this.operationTypes;
	}

	private getVreScoreListError(error) {
		console.log(error);
	}

	// function setColorToLastIndexVre(dataChart) {
	// 	var lastIndexVre;
	// 	var lastValueVre;

	// 	for (var i = dataChart.activities.length - 1; i >= 0; i--) {
	// 		lastIndexVre = dataChart.activities[i].vre.length -1;
	// 		lastValueVre = dataChart.activities[i].vre[lastIndexVre];

	// 		dataChart.activities[i].vre[lastIndexVre] = {y: lastValueVre, color:'rgba(157, 195, 231,1)'};
	// 	}
	// }

	private groupOperationByState(activities) {

		const bhaStates = [
			{ 0: /makeup/i, 1: /make up/i },
			{ 0: /laydown/i, 1: /lay down/i },
			{ 0: /cased/i, 1: /cased well/i },
			{ 0: /opensea/i, 1: /open sea/i },
			{ 0: /drilling/i, 1: /drilling run/i },
			{ 0: /openhole/i, 1: /open hole/i },
			// {0:/inBreakDPInterval/i, 1:/In Break DP Interval/i}
		];

		const casingStates = [
			{ 0: /casing/i, 1: /casing/i },
			{ 0: /settlementstring/i, 1: /settlement string/i },
			{ 0: /belowshoedepth/i, 1: /below shoe depth/i },
			{ 0: /cementing/i, 1: /cementing/i },
			// {0:/inBreakDPInterval/i, 1:/In Break DP Interval/i}
		];

		const riserStates = [
			{ 0: /ascentriser/i, 1: /ascent riser/i },
			{ 0: /descentriser/i, 1: /descent riser/i },
		];

		const timeState = [
			{ 0: /time/i, 1: /time/i },
		];

		activities = activities.map((activity) => {

			if (activity.$$operationType) {
				return activity;
			}

			if (activity.label) {
				activity = this.setOperationType(activity, bhaStates, 'bha');
				activity = this.setOperationType(activity, casingStates, 'casing');
				activity = this.setOperationType(activity, riserStates, 'riser');
				activity = this.setOperationType(activity, timeState, 'time');
			}

			return activity;
		});

		for (const i in activities) {
			if (activities[i].$$operationType === 'bha') {
				this.operationTypes.bha.activities.push(activities[i]);
			} else if (activities[i].$$operationType === 'casing') {
				this.operationTypes.casing.activities.push(activities[i]);
			} else if (activities[i].$$operationType === 'riser') {
				this.operationTypes.riser.activities.push(activities[i]);
			} else if (activities[i].$$operationType === 'time') {
				this.operationTypes.time.activities.push(activities[i]);
			} else {
				this.operationTypes.none.activities.push(activities[i]);
			}
		}
	}

	private setOperationType(activity, states, type) {

		if (activity.$$operationType) {
			return activity;
		}

		const attr = activity.label;

		for (const i in states) {
			if (attr.match(states[i][0]) || attr.match(states[i][1])) {
				activity.$$operationType = type;
				break;
			}
		}

		if (!activity.$$operationType) {
			activity.$$operationType = '';
		}

		return activity;
	}

}
// })();
