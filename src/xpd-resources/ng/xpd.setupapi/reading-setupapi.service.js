(function () {
	'use strict';

	angular.module('xpd.setupapi').service('readingSetupAPIService', readingSetupAPIService);

	readingSetupAPIService.$inject = ['xpdAccessFactory', 'setupAPIService'];

	function readingSetupAPIService(xpdAccessFactory, setupAPIService) {

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

			setupAPIService.doRequest(req, successCallback, errorCallback);
		}

		function getTick(tick, successCallback, errorCallback) {
			var req = {
				method: 'GET',
				url: BASE_URL + '/tick/' + tick,
				headers: {
					'Content-Type': 'application/json'
				}
			};

			setupAPIService.doRequest(req, successCallback, errorCallback);
		}

		function getAllReadingByStartEndTime(from, to, successCallback, errorCallback) {
			var req = {
				method: 'GET',
				url: BASE_URL + '/from/' + from + ((to) ? ('/to/' + to) : ''),
				// cache: (to) ? true : false,
				headers: {
					'Content-Type': 'application/json'
				}
			};

			setupAPIService.doRequest(req, successCallback, errorCallback);
		}
	}

})();
