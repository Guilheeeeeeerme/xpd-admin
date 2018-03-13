/*
* @Author: Xavier
* @Date:   2017-05-11 10:06:57
* @Last Modified by:   Gezzy Ramos
* @Last Modified time: 2017-07-27 09:48:23
*/
(function () {
	'use strict';

	angular.module('xpd.reports')
		.controller('HistogramReportController', histogramReportController);

	histogramReportController.$inject = ['$scope', 'operationSetupAPIService', 'reportsSetupAPIService'];

	function histogramReportController($scope, operationSetupAPIService, reportsSetupAPIService) {
		var vm = this;

		var parentData = $scope.reportsData;

		$scope.histoData = {
			columns: 2,
			histograms: []
		};

		$scope.inputIntevals = {};

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

		vm.getColSize = getColSize;
		vm.actionFilterButton = actionFilterButton;

		reportsSetupAPIService.getHistogramData(
			parentData.fromDate,
			parentData.toDate,
			loadHistogramData,
			loadHistogramDataError
		);



		function actionFilterButton(fromDate, toDate){
			
			reportsSetupAPIService.getHistogramData(
				fromDate,
				toDate,
				loadHistogramData,
				loadHistogramDataError
			);
		}

		function loadHistogramData(data){
			operationTypes.none.activities = [];
			operationTypes.bha.activities = [];
			operationTypes.casing.activities = [];
			operationTypes.riser.activities = [];
			operationTypes.time.activities = [];

			groupOperationByState(data);

			console.log(operationTypes);
			$scope.histoData.histograms = operationTypes;
		}

		function loadHistogramDataError(error){
			console.log('Histogram request data error!');
			console.log(error);
		}

		function getColSize(){
			return Math.floor(12 / $scope.histoData.columns);
		}

		function groupOperationByState(activities) {

			var bhaStates = [
				{0:/makeup/i, 1:/make up/i},
				{0:/laydown/i, 1:/lay down/i},
				{0:/cased/i, 1:/cased well/i},
				{0:/opensea/i, 1:/open sea/i},
				{0:/drilling/i, 1:/drilling run/i},
				{0:/openhole/i, 1:/open hole/i}
				// {0:/inBreakDPInterval/i, 1:/In Break DP Interval/i}
			];

			var casingStates = [
				{0:/casing/i, 1:/casing/i},
				{0:/settlementstring/i, 1:/settlement string/i},
				{0:/belowshoedepth/i, 1:/below shoe depth/i},
				{0:/cementing/i, 1:/cementing/i}
				// {0:/inBreakDPInterval/i, 1:/In Break DP Interval/i}
			];

			var riserStates = [
				{0:/ascentriser/i, 1:/ascent riser/i},
				{0:/descentriser/i, 1:/descent riser/i}
			];

			var timeState = [
				{0:/time/i, 1:/time/i}
			];

			activities = activities.map(function(activity){

				if(activity.$$operationType)
					return activity;

				if(activity.label){			
					activity = setOperationType(activity, bhaStates, 'bha');
					activity = setOperationType(activity, casingStates, 'casing');
					activity = setOperationType(activity, riserStates, 'riser');
					activity = setOperationType(activity, timeState, 'time');
				}

				return activity;
			});

			for(var i in activities){
				if (activities[i].$$operationType == 'bha') {
					operationTypes.bha.activities.push(activities[i]);
				}else if(activities[i].$$operationType == 'casing'){
					operationTypes.casing.activities.push(activities[i]);
				}else if(activities[i].$$operationType == 'riser'){
					operationTypes.riser.activities.push(activities[i]);
				}else if(activities[i].$$operationType == 'time'){
					operationTypes.time.activities.push(activities[i]);
				}else{
					operationTypes.none.activities.push(activities[i]);
				}
			}
		}

		function setOperationType(activity, states, type) {

			if (activity.$$operationType) 
				return activity;

			var attr = activity.label;

			for(var i in states){
				if (attr.match(states[i][0]) || attr.match(states[i][1])) {
					activity.$$operationType = type;
					break;
				}
			}

			if (!activity.$$operationType)
				activity.$$operationType = '';

			return activity;
		}

		/*operationSetupAPIService.getDefaultFields("casing", setSampleData);

		function setSampleData(data){
			var contractParams = data.contractParams;
			var sampleData = [];

			contractParams.forEach(function(item){
				var histogram = {
					label: item.type
				};

				var displacement = (item.type.indexOf("Trip")>-1?30:1);

				var vpoorEventDuration = displacement / (item.vpoor / 3600);
				var vstandardEventDuration = displacement / (item.vstandard / 3600);
				var voptimumEventDuration = displacement / (item.voptimum / 3600);

				histogram.params = {
					vpoor: vpoorEventDuration,
					vstandard: vstandardEventDuration,
					voptimum: voptimumEventDuration,
				};

				histogram.data = [];

				var variation = 0.5;
				var min = voptimumEventDuration * (1 - (variation/3));
				var max = vpoorEventDuration * (1 + variation);

				for(var i=0; i<100; i++){
					//
					histogram.data.push([Math.floor(Math.random()*(max-min+1)+min), i+1]);
				}

				sampleData.push(histogram);
			});

			$scope.histoData.histograms = sampleData;
		}*/
	}
})();
