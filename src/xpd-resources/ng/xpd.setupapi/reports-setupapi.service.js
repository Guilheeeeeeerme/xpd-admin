(function () {
	'use strict';

	angular.module('xpd.setupapi')
		.service('reportsSetupAPIService', reportsSetupAPIService);

	reportsSetupAPIService.$inject = ['xpdAccessFactory', 'setupAPIService'];

	function reportsSetupAPIService(xpdAccessFactory, setupAPIService) {
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

			var req = {
				method: 'GET',
				url: url
			};

			setupAPIService.doRequest(req, successCallback, errorCallback);
		}

		function getVreScoreList(fromDate, toDate, successCallback, errorCallback) {
			var url = xpdAccessFactory.getSetupURL() + 'setup/reports/vre-score?';
			url += 'from=' + fromDate.getTime();
			url += '&to=' + toDate.getTime();

			var req = {
				method: 'GET',
				url: url
			};

			setupAPIService.doRequest(req, successCallback, errorCallback);
		}

		function getPlannedGraphicDataOperation(operationId, successCallback, errorCallback) {
			var req = {
				method: 'GET',
				url: xpdAccessFactory.getSetupURL() +
					'setup/reports/planned-operation-graphic-data?'
					+ 'operation-id=' + operationId
			};
			setupAPIService.doRequest(req, successCallback, errorCallback);
		}

		function getRealizedGraphicDataOperation(operation_id, successCallback, errorCallback) {
			var req = {
				method: 'GET',
				url: xpdAccessFactory.getSetupURL() +
					'setup/reports/realized-operation-graphic-data?' +
					'operation-id=' + operation_id
			};

			setupAPIService.doRequest(req, successCallback, errorCallback);
		}

		function getHistogramData(fromDate, toDate, successCallback, errorCallback) {
			var url = xpdAccessFactory.getSetupURL() + 'setup/reports/histogram?';
			url += 'from=' + fromDate.getTime();
			url += '&to=' + toDate.getTime();

			var req = {
				method: 'GET',
				url: url
			};

			setupAPIService.doRequest(req, successCallback, errorCallback);
		}

		function getNeedleDataChart(fromDate, toDate, successCallback, errorCallback) {
			var url = xpdAccessFactory.getSetupURL() + 'setup/reports/needle?';
			url += 'from=' + fromDate.getTime();
			url += '&to=' + toDate.getTime();

			var req = {
				method: 'GET',
				url: url
			};

			setupAPIService.doRequest(req, successCallback, errorCallback);
		}

		function getFailuresNptDataChart(fromDate, toDate, successCallback, errorCallback) {
			var url = xpdAccessFactory.getSetupURL() + 'setup/reports/failure-category?';
			url += 'from=' + fromDate.getTime();
			url += '&to=' + toDate.getTime();

			var req = {
				method: 'GET',
				url: url
			};

			setupAPIService.doRequest(req, successCallback, errorCallback);
		}

		function getLessonsLearnedDataChart(fromDate, toDate, successCallback, errorCallback) {
			var url = xpdAccessFactory.getSetupURL() + 'setup/reports/lesson-learned-category?';
			url += 'from=' + fromDate.getTime();
			url += '&to=' + toDate.getTime();

			var req = {
				method: 'GET',
				url: url
			};

			setupAPIService.doRequest(req, successCallback, errorCallback);
		}

		function getOperationQueue(wellId, successCallback, errorCallback) {

			var req = {
				method: 'GET',
				url: xpdAccessFactory.getReportsAPIURL() + 'bitdepth-vs-time/' + wellId
			};

			setupAPIService.doRequest(req, successCallback, errorCallback);

		}

		function getBitDepthChartForOperation(wellId, operationId, successCallback, errorCallback) {

			var req = {
				method: 'GET',
				url: xpdAccessFactory.getReportsAPIURL() + 'bitdepth-vs-time/' + wellId + '/operation/' + operationId
			};

			setupAPIService.doRequest(req, successCallback, errorCallback);

		}

	}
})();
