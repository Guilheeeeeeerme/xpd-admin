(function () {
	'use strict';

	angular.module('xpd.setupapi').service('readingSetupAPIService', readingSetupAPIService);

	readingSetupAPIService.$inject = ['$http', 'xpdAccessFactory', 'setupAPIService'];

	function readingSetupAPIService($http, xpdAccessFactory, setupAPIService) {

		var vm = this;

		vm.getAllReadingSince = getAllReadingSince;
		vm.getTick = getTick;
		vm.getAllReadingByStartEndTime = getAllReadingByStartEndTime;

		function getAllReadingSince(from, successCallback, errorCallback) {
			var req = {
				method: 'GET',
				url: xpdAccessFactory.getSetupURL() + 'setup/reading/from/' + from,
				headers: {
					'Content-Type': 'application/json'
				}
			};

			$http(req).then(
	            function(response) {
	                successCallback && successCallback(response.data);
	            },
	            function(error){
	            	setupAPIService.generateToast(error.data, true);
	                errorCallback && errorCallback(error);
            	}
			);
		}

		function getTick(tick, successCallback, errorCallback) {
			var req = {
				method: 'GET',
				url: xpdAccessFactory.getSetupURL() + 'setup/reading/tick/' + tick,
				headers: {
					'Content-Type': 'application/json'
				}
			};

			$http(req).then(
	            function(response) {
	                successCallback && successCallback(response.data);
	            },
	            function(error){
	            	setupAPIService.generateToast(error.data, true);
	                errorCallback && errorCallback(error);
            	}
			);
		}

		function getAllReadingByStartEndTime(from, to, successCallback, errorCallback) {
			var req = {
				method: 'GET',
				url: xpdAccessFactory.getSetupURL() + 'setup/reading/from/' + from + ( (to)? ('/to/' + to) : ''),
				headers: {
					'Content-Type': 'application/json'
				}
			};

			$http(req).then(
				function (response) {
					successCallback && successCallback(response.data);
				},
				function (error) {
					setupAPIService.generateToast(error.data, true);
					errorCallback && errorCallback(error);
				}
			);
		}
	}

})();
