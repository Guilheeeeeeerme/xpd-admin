(function() {
	'use strict';

	angular.module('xpd.reports')
		.controller('SlipsToSlipsController', slipsToSlipsController);

	slipsToSlipsController.$inject = ['$scope', '$routeParams', 'eventlogSetupAPIService'];

	function slipsToSlipsController($scope, $routeParams, eventlogSetupAPIService) {
		let vm = this;

		$scope.slipsToSlipsData = {
			connectionTimes: null,
			fromDate: null,
			toDate: null,
			type: null,
		};

		let operationId = $routeParams.operationId;
		let eventType = $routeParams.type;

		getEventTimes();
		vm.onChangePeriod = onChangePeriod;

		function getEventTimes() {

			if (operationId != null) {

				((eventType == 'connections') ? $scope.slipsToSlipsData.type = 'CONN' : $scope.slipsToSlipsData.type = 'TRIP');

				eventlogSetupAPIService.listByFilters($scope.slipsToSlipsData.type, operationId, null, null, null,
					   getEventTimesSuccessCallback,
					   getEventTimesErrorCallback,
				);
			}
		}

		function getEventTimesSuccessCallback(times) {
			if (times == null || times.length == 0) { return; }

   times.reverse();

			$scope.slipsToSlipsData.fromDate = new Date(times[0].startTime);
			$scope.slipsToSlipsData.toDate = new Date(times[times.length - 1].startTime);

			$scope.slipsToSlipsData.minDate = new Date(times[0].startTime);
			$scope.slipsToSlipsData.maxDate = new Date(times[times.length - 1].startTime);

   $scope.slipsToSlipsData.connectionTimes = times;
		}

		function getEventTimesErrorCallback(error) {
			console.log(error);
		}

		function onChangePeriod(fromDate , toDate) {

			if (operationId != null) {
			    eventlogSetupAPIService.listByFilters('CONN', operationId, null, $scope.slipsToSlipsData.fromDate, $scope.slipsToSlipsData.toDate,
			    		onChangePeriodSuccessCallback,
			    		onChangePeriodErrorCallback,
		    		);
			}
		}

		function onChangePeriodSuccessCallback(times) {
			times.reverse();
			$scope.slipsToSlipsData.connectionTimes = times;
		}

		function onChangePeriodErrorCallback(error) {
			console.log(error);
		}
	}
})();
