(function () {
	'use strict';

	angular.module('xpd.setupapi')
		.service('reportsSetupAPIService', reportsSetupAPIService);

	reportsSetupAPIService.$inject = ['$http', 'xpdAccessFactory', 'setupAPIService'];

	function reportsSetupAPIService($http, xpdAccessFactory, setupAPIService) {
		var vm = this;

		vm.getVreList = getVreList;
		vm.getVreScoreList = getVreScoreList;
		vm.getPlannedGraphicDataOperation = getPlannedGraphicDataOperation;
		vm.getRealizedGraphicDataOperation = getRealizedGraphicDataOperation;
		vm.getHistogramData = getHistogramData;
		vm.getNeedleDataChart = getNeedleDataChart;
		vm.getFailuresNptDataChart = getFailuresNptDataChart;
		vm.getLessonsLearnedDataChart = getLessonsLearnedDataChart;
		vm.getOperationQueue = getOperationQueue;
		vm.getBitDepthChartForOperation = getBitDepthChartForOperation;

		function getVreList(fromDate, toDate, successCallback, errorCallback) {

			var url = xpdAccessFactory.getSetupURL() + 'setup/reports/vre?';
			url += 'from=' + fromDate.getTime();
			url += '&to=' + toDate.getTime();

			$http.get(url)
            	.then(
	            function(response) {
	                successCallback && successCallback(response.data.data);
	            },
	            function(error){
	            	setupAPIService.generateToast(error.data, true);
	                errorCallback && errorCallback(error);
            	}
				);
		}

		function getVreScoreList(fromDate, toDate, successCallback, errorCallback) {
			var url = xpdAccessFactory.getSetupURL() + 'setup/reports/vre-score?';
			url += 'from=' + fromDate.getTime();
			url += '&to=' + toDate.getTime();

			$http.get(url)
            	.then(
	            function(response) {
	                successCallback && successCallback(response.data.data);
	            },
	            function(error){
	            	setupAPIService.generateToast(error.data, true);
	                errorCallback && errorCallback(error);
            	}
				);
		}

		function getPlannedGraphicDataOperation(operationId, successCallback, errorCallback) {
		    var req = {
		        method: 'GET',
		        url: xpdAccessFactory.getSetupURL() +
		            'setup/reports/planned-operation-graphic-data?'
		            + 'operation-id=' + operationId
		    };
		    $http(req).then(
	            function(response) {
	                successCallback && successCallback(response.data.data);
	            },
	            function(error){
	            	setupAPIService.generateToast(error.data, true);
	                errorCallback && errorCallback(error);
            	}
			);
		}

		function getRealizedGraphicDataOperation(operation_id, successCallback, errorCallback) {
		    var req = {
		        method: 'GET',
		        url: xpdAccessFactory.getSetupURL() +
		            'setup/reports/realized-operation-graphic-data?'+
		            'operation-id=' + operation_id
		    };
		    $http(req).then(
	            function(response) {
	                successCallback && successCallback(response.data.data);
	            },
	            function(error){
	            	setupAPIService.generateToast(error.data, true);
	                errorCallback && errorCallback(error);
            	}
			);
		}

		function getHistogramData(fromDate, toDate, successCallback, errorCallback){
			var url = xpdAccessFactory.getSetupURL() + 'setup/reports/histogram?';
			url += 'from=' + fromDate.getTime();
			url += '&to=' + toDate.getTime();

			$http.get(url)
            	.then(
	            function(response) {
	                successCallback && successCallback(response.data.data);
	            },
	            function(error){
	            	setupAPIService.generateToast(error.data, true);
	                errorCallback && errorCallback(error);
            	}
				);
		}

		function getNeedleDataChart(fromDate, toDate, successCallback, errorCallback){
			var url = xpdAccessFactory.getSetupURL() + 'setup/reports/needle?';
			url += 'from=' + fromDate.getTime();
			url += '&to=' + toDate.getTime();

			$http.get(url)
            	.then(
	            function(response) {
	                successCallback && successCallback(response.data.data);
	            },
	            function(error){
	            	setupAPIService.generateToast(error.data, true);
	                errorCallback && errorCallback(error);
            	}
				);
		}

		function getFailuresNptDataChart(fromDate, toDate, successCallback, errorCallback){
			var url = xpdAccessFactory.getSetupURL() + 'setup/reports/failure-category?';
			url += 'from=' + fromDate.getTime();
			url += '&to=' + toDate.getTime();

			$http.get(url)
            	.then(
	            function(response) {
	                successCallback && successCallback(response.data.data);
	            },
	            function(error){
	            	setupAPIService.generateToast(error.data, true);
	                errorCallback && errorCallback(error);
            	}
				);
		}

		function getLessonsLearnedDataChart(fromDate, toDate, successCallback, errorCallback){
			var url = xpdAccessFactory.getSetupURL() + 'setup/reports/lesson-learned-category?';
			url += 'from=' + fromDate.getTime();
			url += '&to=' + toDate.getTime();

			$http.get(url)
            	.then(
	            function(response) {
	                successCallback && successCallback(response.data.data);
	            },
	            function(error){
	            	setupAPIService.generateToast(error.data, true);
	                errorCallback && errorCallback(error);
            	}
				);
		}

		function getOperationQueue(wellId, successCallback, errorCallback){

			$http.get(xpdAccessFactory.getReportsAPIURL() + 'bitdepth-vs-time/' + wellId)
				.then(
					function (data) {
						successCallback && successCallback(data.data);
					},
					function (error) {
						errorCallback && errorCallback(error);
					}
				);
		}

		function getBitDepthChartForOperation(wellId, operationId, successCallback, errorCallback){

			$http.get(xpdAccessFactory.getReportsAPIURL() + 'bitdepth-vs-time/' + wellId + '/operation/' + operationId)
				.then(
					function (data) {
						successCallback && successCallback(data.data);
					},
					function (error) {
						errorCallback && errorCallback(error);
					}
				);
		}

	}
})();
