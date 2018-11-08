import { ReportsSetupAPIService } from '../../shared/xpd.setupapi/reports-setupapi.service';

export class NeedleReportController {
	// 'use strict';

	public static $inject = ['$scope', 'reportsSetupAPIService'];
	public operationTypes: { none: { label: string; activities: any[]; }; bha: { label: string; activities: any[]; }; casing: { label: string; activities: any[]; }; riser: { label: string; activities: any[]; }; time: { label: string; activities: any[]; }; };

	constructor(
		private $scope: any,
		private reportsSetupAPIService: ReportsSetupAPIService) {

		const vm = this;

		$scope.needleData = {
			needleDataChart: null,
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

		this.renderChart();
	}

	public onClickFilterButton(fromDate, toDate) {
		this.$scope.$parent.rController.getFailuresOnInterval(fromDate, toDate);

		this.reportsSetupAPIService.getNeedleDataChart(
			fromDate,
			toDate).then(
			(arg) => { this.getNeedleInitialDateCallbackSuccess(arg); },
			(arg) => { this.getNeedleInitialDateCallbackError(arg); },
		);
	}

	private renderChart() {

		const parentData = this.$scope.reportsData;

		this.reportsSetupAPIService.getNeedleDataChart(
			parentData.fromDate,
			parentData.toDate).then(
			(arg) => { this.getNeedleInitialDateCallbackSuccess(arg); },
			(arg) => { this.getNeedleInitialDateCallbackError(arg); },
		);
	}

	private getNeedleInitialDateCallbackSuccess(result) {
		this.operationTypes.none.activities = [];
		this.operationTypes.bha.activities = [];
		this.operationTypes.casing.activities = [];
		this.operationTypes.riser.activities = [];
		this.operationTypes.time.activities = [];

		this.groupOperationByState(result.activities);

		this.$scope.needleData.isEmpty = this.operationTypes.none.activities.length === 0;

		this.$scope.needleData.isEmpty = this.$scope.needleData.isEmpty || this.operationTypes.bha.activities.length === 0;
		this.$scope.needleData.isEmpty = this.$scope.needleData.isEmpty || this.operationTypes.casing.activities.length === 0;
		this.$scope.needleData.isEmpty = this.$scope.needleData.isEmpty || this.operationTypes.riser.activities.length === 0;
		this.$scope.needleData.isEmpty = this.$scope.needleData.isEmpty || this.operationTypes.time.activities.length === 0;

		this.$scope.needleData.operationTypes = this.operationTypes;
	}

	private getNeedleInitialDateCallbackError(error) {
		console.log(error);
	}

	private groupOperationByState(activities) {

		// var bhaStates = [
		// 	{0:/makeup/i, 1:/make up/i},
		// 	{0:/cased/i, 1:/cased well/i},
		// 	{0:/opensea/i, 1:/open sea/i},
		// 	{0:/drilling/i, 1:/drilling run/i},
		// 	{0:/openhole/i, 1:/open hole/i},
		// 	{0:/laydown/i, 1:/lay down/i}
		// 	// {0:/inBreakDPInterval/i, 1:/In Break DP Interval/i}
		// ];

		// var casingStates = [
		// 	{0:/casing/i, 1:/casing/i},
		// 	{0:/settlementstring/i, 1:/settlement string/i},
		// 	{0:/belowshoedepth/i, 1:/below shoe depth/i},
		// 	{0:/cementing/i, 1:/cementing/i}
		// 	// {0:/inBreakDPInterval/i, 1:/In Break DP Interval/i}
		// ];

		// var riserStates = [
		// 	{0:/ascentriser/i, 1:/ascent riser/i},
		// 	{0:/descentriser/i, 1:/descent riser/i}
		// ];

		// var timeState = [
		// 	{0:/time/i, 1:/time/i}
		// ];

		// activities = activities.map(function(activity){

		// 	if(activity.$$operationType)
		// 		return activity;

		// 	if(activity.activity){
		// 		activity = setOperationType(activity, bhaStates, 'bha');
		// 		activity = setOperationType(activity, casingStates, 'casing');
		// 		activity = setOperationType(activity, riserStates, 'riser');
		// 		activity = setOperationType(activity, timeState, 'time');
		// 	}

		// 	return activity;
		// });

		for (const i in activities) {
			if (activities[i].operationType === 'bha') {
				this.operationTypes.bha.activities.push(activities[i]);
				// operationTypes.bha.activities = sortActivities(operationTypes.bha.activities, bhaStates);
			} else if (activities[i].operationType === 'casing') {
				this.operationTypes.casing.activities.push(activities[i]);
				// operationTypes.casing.activities = sortActivities(operationTypes.casing.activities, casingStates);
			} else if (activities[i].operationType === 'riser') {
				this.operationTypes.riser.activities.push(activities[i]);
				// operationTypes.riser.activities = sortActivities(operationTypes.riser.activities, riserStates);
			} else if (activities[i].operationType === 'time') {
				this.operationTypes.time.activities.push(activities[i]);
				// operationTypes.time.activities = sortActivities(operationTypes.time.activities, timeState);
			} else {
				this.operationTypes.none.activities.push(activities[i]);
			}
		}
	}

	// function sortActivities(activities, states){

	// 	var matches = [
	// 		/trip/gi,
	// 		/connection/gi,
	// 		/make up/gi,
	// 		/lay down/gi
	// 	];

	// 	var tempArray = activities.sort(function(activity1, activity2){

	// 		var temp1 = null;
	// 		var temp2 = null;

	// 		for (var index in matches){

	// 			if(activity1.activity.match(matches[index])){
	// 				temp1 = index;
	// 			}

	// 			if(activity2.activity.match(matches[index])){
	// 				temp2 = index;
	// 			}
	// 		}

	// 		if(temp1 == null && temp2 != null){
	// 			return 1;
	// 		}else if((temp1 != null && temp2 == null) || (temp1 == null && temp2 == null)){
	// 			return -1;
	// 		}else{
	// 			return temp1 - temp2;
	// 		}

	// 	});

	// 	return tempArray.sort(function(activity1, activity2){

	// 		var temp1 = null;
	// 		var temp2 = null;

	// 		for (var i in states){

	// 			if( activity1.activity.match(states[i][0]) || activity1.activity.match(states[i][1]) ){
	// 				temp1 = i;
	// 			}

	// 			if( activity2.activity.match(states[i][0]) || activity2.activity.match(states[i][1]) ){
	// 				temp2 = i;
	// 			}
	// 		}

	// 		if(temp1 == null && temp2 != null){
	// 			return 1;
	// 		}else if((temp1 != null && temp2 == null) || (temp1 == null && temp2 == null)){
	// 			return -1;
	// 		}else{
	// 			return temp1 - temp2;
	// 		}

	// 	});
	// }

	// function setOperationType(activity, states, type) {

	// 	if (activity.$$operationType)
	// 		return activity;

	// 	var attr = activity.activity;

	// 	for(var i in states){
	// 		if (attr.match(states[i][0]) || attr.match(states[i][1])) {
	// 			activity.$$operationType = type;
	// 			break;
	// 		}
	// 	}

	// 	if (!activity.$$operationType)
	// 		activity.$$operationType = '';

	// 	return activity;
	// }
}
// })();
