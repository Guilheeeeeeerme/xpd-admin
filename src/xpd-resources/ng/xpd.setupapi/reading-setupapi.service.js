(function () {
	'use strict';

	angular.module('xpd.setupapi').service('readingSetupAPIService', readingSetupAPIService);

	readingSetupAPIService.$inject = ['$http', 'xpdAccessFactory', 'setupAPIService'];

	function readingSetupAPIService($http, xpdAccessFactory, setupAPIService) {

		var BASE_URL = xpdAccessFactory.getSetupURL() + 'setup/reading';

		var vm = this;

		vm.getAllReadingSince = getAllReadingSince;
		vm.getTick = getTick;
		vm.getAllReadingByStartEndTime = getAllReadingByStartEndTime;

		function getAllReadingSince(from, successCallback, errorCallback) {
			var req = {
				method: 'GET',
				url: BASE_URL + '/from/' + from,
				headers: {
					'Content-Type': 'application/json'
				}
			};

			$http(req).then(
				function (response) {
					successCallback && successCallback(response.data.data);
				},
				function (error) {
					setupAPIService.generateToast(error.data, true);
					errorCallback && errorCallback(error);
				}
			);
		}

		function getTick(tick, successCallback, errorCallback) {
			var req = {
				method: 'GET',
				url: BASE_URL + '/tick/' + tick,
				headers: {
					'Content-Type': 'application/json'
				}
			};

			$http(req).then(
				function (response) {
					successCallback && successCallback(response.data.data);
				},
				function (error) {
					setupAPIService.generateToast(error.data, true);
					errorCallback && errorCallback(error);
				}
			);
		}

		function getAllReadingByStartEndTime(from, to, successCallback, errorCallback) {
			var req = {
				method: 'GET',
				url: BASE_URL + '/from/' + from + ((to) ? ('/to/' + to) : ''),
				headers: {
					'Content-Type': 'application/json'
				}
			};

			$http(req).then(
				function (response) {
					successCallback && successCallback(response.data.data);
				},
				function (error) {
					setupAPIService.generateToast(error.data, true);
					errorCallback && errorCallback(error);
				}
			);
		}
	}

})();
