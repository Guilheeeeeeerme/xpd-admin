/*
* @Author: 
* @Date:   2017-05-09 14:48:15
* @Last Modified by:   Gezzy Ramos
* @Last Modified time: 2017-05-17 11:17:17
*/
(function () {
	'use strict';

	angular.module('xpd.reports')
		.controller('ReportNeedleController', reportNeedleController);

	reportNeedleController.$inject = ['$scope', 'reportsSetupAPIService'];

	function reportNeedleController($scope, reportsSetupAPIService) {
		var vm = this;

		$scope.needleData = {
			needleDataChart: null
		};

		var operationTypes = {
			none: {
				label: '',
				activities: [],
			},
			bha: {
				label: 'bha',
				activities: [],
			},
			casing:{
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
			}
		};

		vm.onClickFilterButton = onClickFilterButton;

		renderChart();

		function renderChart() {

			var parentData = $scope.reportsData;

			reportsSetupAPIService.getNeedleDataChart(
				parentData.fromDate,
				parentData.toDate,
				getNeedleInitialDateCallbackSuccess,
				getNeedleInitialDateCallbackError
			);
		}

		function getNeedleInitialDateCallbackSuccess(result) {
			operationTypes.none.activities = [];
			operationTypes.bha.activities = [];
			operationTypes.casing.activities = [];
			operationTypes.riser.activities = [];
			operationTypes.time.activities = [];

			groupOperationByState(result.activities);

			$scope.needleData.operationTypes = operationTypes;
		}

		function getNeedleInitialDateCallbackError(error) {
			console.log(error);
		}

		function onClickFilterButton(fromDate, toDate) {
			$scope.$parent.rController.getFailuresOnInterval(fromDate, toDate);
			
			reportsSetupAPIService.getNeedleDataChart(
				fromDate,
				toDate,
				getNeedleInitialDateCallbackSuccess,
				getNeedleInitialDateCallbackError
			);
		}

		function groupOperationByState(activities) {

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

			for(var i in activities){
				if (activities[i].operationType == 'bha') {
					operationTypes.bha.activities.push(activities[i]);
					// operationTypes.bha.activities = sortActivities(operationTypes.bha.activities, bhaStates);
				}else if(activities[i].operationType == 'casing'){
					operationTypes.casing.activities.push(activities[i]);
					// operationTypes.casing.activities = sortActivities(operationTypes.casing.activities, casingStates);
				}else if(activities[i].operationType == 'riser'){
					operationTypes.riser.activities.push(activities[i]);
					// operationTypes.riser.activities = sortActivities(operationTypes.riser.activities, riserStates);
				}else if(activities[i].operationType == 'time'){
					operationTypes.time.activities.push(activities[i]);
					// operationTypes.time.activities = sortActivities(operationTypes.time.activities, timeState);
				}else{
					operationTypes.none.activities.push(activities[i]);
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
})();
