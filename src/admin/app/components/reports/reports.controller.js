/*
* @Author: Gezzy Ramos
* @Date:   2017-05-11 09:58:24
* @Last Modified by:   Gezzy Ramos
* @Last Modified time: 2017-11-07 10:57:17
*/
(function () {
	'use strict';

	angular.module('xpd.reports')
		.controller('ReportsController', reportsController);

	reportsController.$inject = ['$scope', '$localStorage', 'operationSetupAPIService', 'wellSetupAPIService', 'failureSetupAPIService'];

	function reportsController($scope, $localStorage, operationSetupAPIService, wellSetupAPIService, failureSetupAPIService) {

		// --declarations--
		var vm = this;

		$scope.reportsData = {
			currentOperation: null,
			operationList: null,
			currentWell: null,
			wellList: null,
			reportList: null,
			fromDate: null,
			toDate: null
		};

		vm.getFailuresOnInterval = getFailuresOnInterval;
		
		// --actions--
		if(!$localStorage['reportsData.toDate'] || !$localStorage['reportsData.fromDate']){
			setCurrentDate();
		}else{
			$scope.reportsData.toDate = new Date($localStorage['reportsData.toDate']);
			$scope.reportsData.fromDate = new Date($localStorage['reportsData.fromDate']);
		}
		
		getWellList();
		getFailuresOnInterval($scope.reportsData.fromDate, $scope.reportsData.toDate);

		operationSetupAPIService.getList(
			currentOperationSuccessCallback, 
			currentOperationErrorCallback);


		function setCurrentDate() {

			try{
				$scope.reportsData.fromDate.setHours(0, 0, 0, 0);
			}catch(e){
				$scope.reportsData.fromDate = new Date();
				$scope.reportsData.fromDate.setHours(0, 0, 0, 0);
			}

			try{
				$scope.reportsData.toDate.setHours(23, 59, 59, 999);
			}catch(e){
				$scope.reportsData.toDate = new Date();
				$scope.reportsData.toDate.setHours(23, 59, 59, 999);
			}

			$localStorage['reportsData.toDate'] = $scope.reportsData.toDate.toISOString();
			$localStorage['reportsData.fromDate'] = $scope.reportsData.fromDate.toISOString();

		}

		// --implements--
		function getWellList() {
			wellSetupAPIService.getList( function(wells){
				getWellSuccessCallback(wells);
			}, getWellErrorCallback);
		}

		function getWellSuccessCallback(result) {
			$scope.reportsData.wellList = result;

			for(var i in result){
				if(result[i].current){
					$scope.reportsData.currentWell = result[i];
				}
			}

			makeReportList($scope.reportsData.currentWell);
		}

		function getWellErrorCallback(error) {
			console.log(error);
		}

		function currentOperationSuccessCallback(operationList) {
			$scope.reportsData.operationList = operationList;

			for (var i = operationList.length - 1; i >= 0; i--) {
				if (operationList[i].current) {
					$scope.reportsData.currentOperation = operationList[i];
				}
			}

		}

		function currentOperationErrorCallback(error) {
			console.log(error);
		}

		function makeReportList(currentWell) {

        	$scope.reportsData.reportList = [
        		{type:'VRE', url:'#/vre'},
				{type:'VRE x Consistence', url:'#/vre-score'},
        		{type:'Histogram', url:'#/histogram'},
        		{type:'Needle Report', url:'#/needle-report'},
        		{type:'Failures/NPT', url:'#/failures-npt'},
				{type:'Lessons Learned', url:'#/lessons-learned'}
        		// {type:'VRE', url:'#/operation/'+operationId},
        		// {type:"Daily", url:"#/operation/"+operationId+"/daily"},
        		// {type:'Connections', url:'#/operation/'+operationId+'/connections'},
        		// {type:'Trips', url:'#/operation/'+operationId+'/trips'},
        		// {type:'Time vs Depth', url:'#/time-vs-depth'},
        		// {type:'Time vs Depth', url:'#/operation/'+operationId+'/time-vs-depth'},
        		// {type:"Failures", url:"#/operation/"+operationId+"/failures"},
        		// {type:"Improvements", url:"#/operation/"+operationId+"/improvements"},
        	];

        	if(currentWell){
        		$scope.reportsData.reportList.push({type:'Bit Depth x Time', url:'#/bit-depth-time/' + currentWell.id});
        	}
		}

		function getFailuresOnInterval(startTime, endTime){

			$scope.reportsData.failuresOnInterval = null;

			if(startTime && endTime){

				failureSetupAPIService.getFailuresOnInterval(
					new Date(startTime).getTime(), 
					new Date(endTime).getTime(),
					getFailuresOnIntervalCallback
				);
			}

			setCurrentDate();

		}

		function getFailuresOnIntervalCallback(failuresOnInterval){
			$scope.reportsData.failuresOnInterval = failuresOnInterval;
		}

	}
})();
