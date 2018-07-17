import { ReportsSetupAPIService } from '../../shared/xpd.setupapi/reports-setupapi.service';

export class VREScoreController {
	// 'use-strict';

	// angular.module('xpd.reports').controller('VREScoreController', VREScoreController);

	public static $inject = ['$scope', 'reportsSetupAPIService'];
	public onClickFilterButton: (fromDate: any, toDate: any) => boolean;

	constructor($scope, reportsSetupAPIService: ReportsSetupAPIService) {

		const vm = this;

		$scope.vreScoredata = {
			fromDate: 0,
			toDate: 0,
			chartData: {},
		};

		const operationTypes = {
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

		vm.onClickFilterButton = onClickFilterButton;

		getVreScoreList();

		function getVreScoreList() {

			const parentData = $scope.reportsData;

			reportsSetupAPIService.getVreScoreList(
				parentData.fromDate,
				parentData.toDate,
				getVreScoreListSuccess,
				getVreScoreListError,
			);
		}

		function getVreScoreListSuccess(result) {
			operationTypes.none.activities = [];
			operationTypes.bha.activities = [];
			operationTypes.casing.activities = [];
			operationTypes.riser.activities = [];
			operationTypes.time.activities = [];

			// setColorToLastIndexVre(result);
			groupOperationByState(result.activities);

			$scope.vreScoredata.chartData.scale = result.scale;
			$scope.vreScoredata.chartData.categories = result.categories;
			$scope.vreScoredata.chartData.operationTypes = operationTypes;
		}

		function getVreScoreListError(error) {
			console.log(error);
		}

		function onClickFilterButton(fromDate, toDate) {

			if (toDate === undefined) { return false; }

			$scope.$parent.rController.getFailuresOnInterval(fromDate, toDate);

			if (toDate >= fromDate) {
				reportsSetupAPIService.getVreScoreList(
					fromDate,
					toDate,
					getVreScoreListSuccess,
					getVreScoreListError,
				);
			} else {
				return false;
			}
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

		function groupOperationByState(activities) {

			const bhaStates = [
				{0: /makeup/i, 1: /make up/i},
				{0: /laydown/i, 1: /lay down/i},
				{0: /cased/i, 1: /cased well/i},
				{0: /opensea/i, 1: /open sea/i},
				{0: /drilling/i, 1: /drilling run/i},
				{0: /openhole/i, 1: /open hole/i},
				// {0:/inBreakDPInterval/i, 1:/In Break DP Interval/i}
			];

			const casingStates = [
				{0: /casing/i, 1: /casing/i},
				{0: /settlementstring/i, 1: /settlement string/i},
				{0: /belowshoedepth/i, 1: /below shoe depth/i},
				{0: /cementing/i, 1: /cementing/i},
				// {0:/inBreakDPInterval/i, 1:/In Break DP Interval/i}
			];

			const riserStates = [
				{0: /ascentriser/i, 1: /ascent riser/i},
				{0: /descentriser/i, 1: /descent riser/i},
			];

			const timeState = [
				{0: /time/i, 1: /time/i},
			];

			activities = activities.map(function(activity) {

				if (activity.$$operationType) {
					return activity;
				}

				if (activity.label) {
					activity = setOperationType(activity, bhaStates, 'bha');
					activity = setOperationType(activity, casingStates, 'casing');
					activity = setOperationType(activity, riserStates, 'riser');
					activity = setOperationType(activity, timeState, 'time');
				}

				return activity;
			});

			for (const i in activities) {
				if (activities[i].$$operationType === 'bha') {
					operationTypes.bha.activities.push(activities[i]);
				} else if (activities[i].$$operationType === 'casing') {
					operationTypes.casing.activities.push(activities[i]);
				} else if (activities[i].$$operationType === 'riser') {
					operationTypes.riser.activities.push(activities[i]);
				} else if (activities[i].$$operationType === 'time') {
					operationTypes.time.activities.push(activities[i]);
				} else {
					operationTypes.none.activities.push(activities[i]);
				}
			}
		}

		function setOperationType(activity, states, type) {

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
}
// })();
