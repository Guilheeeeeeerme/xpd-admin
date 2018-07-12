/*
* @Author: Gezzy Ramos
* @Date:   2017-05-11 09:58:24
* @Last Modified by:   Gezzy Ramos
* @Last Modified time: 2017-11-07 10:57:17
*/
(function() {
	'use strict';

	angular.module('xpd.reports')
		.controller('ReportsController', reportsController);

	reportsController.$inject = ['$scope', 'operationSetupAPIService', 'wellSetupAPIService', 'operationDataFactory'];

	function reportsController($scope, operationSetupAPIService, wellSetupAPIService, operationDataFactory) {

		// --declarations--
		const vm = this;

		$scope.reportsData = {
			currentOperation: null,
			operationList: null,
			currentWell: null,
			wellList: null,
			reportList: null,
			fromDate: null,
			toDate: null,
		};

		vm.getFailuresOnInterval = getFailuresOnInterval;

		operationDataFactory.openConnection([]).then(function(response) {
			operationDataFactory = response;
		});

		// --actions--
		if (!localStorage.getItem('xpd.admin.reports.reportsData.toDate')  || !localStorage.getItem('xpd.admin.reports.reportsData.fromDate') ) {
			setCurrentDate();
		} else {
			$scope.reportsData.toDate = new Date(localStorage.getItem('xpd.admin.reports.reportsData.toDate') );
			$scope.reportsData.fromDate = new Date(localStorage.getItem('xpd.admin.reports.reportsData.fromDate') );
		}

		getWellList();
		operationDataFactory.addEventListener('reportsController', 'setOnFailureChangeListener', onFailureChange);

		operationSetupAPIService.getList(
			currentOperationSuccessCallback,
			currentOperationErrorCallback);

		function onFailureChange() {
			getFailuresOnInterval($scope.reportsData.fromDate, $scope.reportsData.toDate);
		}

		function setCurrentDate() {

			try {
				$scope.reportsData.fromDate.setHours(0, 0, 0, 0);
			} catch (e) {
				$scope.reportsData.fromDate = new Date();
				$scope.reportsData.fromDate.setHours(0, 0, 0, 0);
			}

			try {
				$scope.reportsData.toDate.setHours(23, 59, 59, 999);
			} catch (e) {
				$scope.reportsData.toDate = new Date();
				$scope.reportsData.toDate.setHours(23, 59, 59, 999);
			}

			localStorage.setItem('xpd.admin.reports.reportsData.toDate', $scope.reportsData.toDate.toISOString());
			localStorage.setItem('xpd.admin.reports.reportsData.fromDate', $scope.reportsData.fromDate.toISOString());

		}

		// --implements--
		function getWellList() {
			wellSetupAPIService.getList(function(wells) {
				getWellSuccessCallback(wells);
			}, getWellErrorCallback);
		}

		function getWellSuccessCallback(result) {
			$scope.reportsData.wellList = result;

			for (const i in result) {
				if (result[i].current) {
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

			for (let i = operationList.length - 1; i >= 0; i--) {
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
				{ type: 'VRE', url: '#/vre' },
				{ type: 'VRE x Consistence', url: '#/vre-score' },
				{ type: 'Histogram', url: '#/histogram' },
				{ type: 'Needle Report', url: '#/needle-report' },
				{ type: 'Failures/NPT', url: '#/failures-npt' },
				{ type: 'Lessons Learned', url: '#/lessons-learned' },
				// {type:'VRE', url:'#/operation/'+operationId},
				// {type:"Daily", url:"#/operation/"+operationId+"/daily"},
				// {type:'Connections', url:'#/operation/'+operationId+'/connections'},
				// {type:'Trips', url:'#/operation/'+operationId+'/trips'},
				// {type:'Time vs Depth', url:'#/time-vs-depth'},
				// {type:'Time vs Depth', url:'#/operation/'+operationId+'/time-vs-depth'},
				// {type:"Failures", url:"#/operation/"+operationId+"/failures"},
				// {type:"Improvements", url:"#/operation/"+operationId+"/improvements"},
			];

			if (currentWell) {
				$scope.reportsData.reportList.push({ type: 'Bit Depth x Time', url: '#/bit-depth-time/' + currentWell.id });
			}
		}

		function getFailuresOnInterval(startTime, endTime) {

			$scope.reportsData.failuresOnInterval = null;

			const startInterval = new Date(startTime).getTime();
			const endInterval = new Date(endTime).getTime();

			if (startTime && endTime) {
				$scope.reportsData.failuresOnInterval = checkNptOnInterval(startInterval, endInterval);
			}

			setCurrentDate();

		}

		function checkNptOnInterval(startInterval, endInterval) {

			const failureList = operationDataFactory.operationData.failureContext.failureList;
			const failuresOnInterval = [];

			for (const i in failureList) {
				const failure = failureList[i];

				if (failure.npt) {
					const failureStartTime = new Date(failure.startTime).getTime();
					const failureEndTime = new Date(failure.endTime).getTime();

					const onGoingCondition = (failure.onGoing && (failureStartTime <= endInterval));

					if ((failureEndTime >= startInterval) && (failureStartTime <= endInterval) || onGoingCondition) {
						failuresOnInterval.push(failure);
					}
				}
			}

			return failuresOnInterval;
		}
	}
})();
