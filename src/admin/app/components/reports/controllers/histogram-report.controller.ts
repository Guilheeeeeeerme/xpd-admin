/*
* @Author: Xavier
* @Date:   2017-05-11 10:06:57
* @Last Modified by:   Gezzy Ramos
* @Last Modified time: 2017-07-27 09:48:23
*/
(function() {
	'use strict';

	angular.module('xpd.reports')
		.controller('HistogramReportController', histogramReportController);

	histogramReportController.$inject = ['$scope', 'reportsSetupAPIService'];

	function histogramReportController($scope, reportsSetupAPIService) {
		let vm = this;

		let parentData = $scope.reportsData;

		$scope.histoData = {
			columns: 2,
			histograms: [],
		};

		$scope.inputIntevals = {};

		let operationTypes = {
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

		vm.getColSize = getColSize;
		vm.actionFilterButton = actionFilterButton;

		reportsSetupAPIService.getHistogramData(
			parentData.fromDate,
			parentData.toDate,
			loadHistogramData,
			loadHistogramDataError,
		);

		function actionFilterButton(fromDate, toDate) {

			reportsSetupAPIService.getHistogramData(
				fromDate,
				toDate,
				loadHistogramData,
				loadHistogramDataError,
			);
		}

		function loadHistogramData(data) {
			operationTypes.none.activities = [];
			operationTypes.bha.activities = [];
			operationTypes.casing.activities = [];
			operationTypes.riser.activities = [];
			operationTypes.time.activities = [];

			groupOperationByState(data);

			$scope.histoData.histograms = operationTypes;
		}

		function loadHistogramDataError(error) {
			console.log('Histogram request data error!');
			console.log(error);
		}

		function getColSize() {
			return Math.floor(12 / $scope.histoData.columns);
		}

		function groupOperationByState(activities) {

			for (let i in activities) {
				if (activities[i].operationType == 'bha') {
					operationTypes.bha.activities.push(activities[i]);
				} else if (activities[i].operationType == 'casing') {
					operationTypes.casing.activities.push(activities[i]);
				} else if (activities[i].operationType == 'riser') {
					operationTypes.riser.activities.push(activities[i]);
				} else if (activities[i].operationType == 'time') {
					operationTypes.time.activities.push(activities[i]);
				} else {
					operationTypes.none.activities.push(activities[i]);
				}
			}
		}
	}
})();
