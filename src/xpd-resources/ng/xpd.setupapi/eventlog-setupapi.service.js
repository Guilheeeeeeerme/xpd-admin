(function () {
	'use strict';

	angular.module('xpd.setupapi').service('eventlogSetupAPIService', eventlogSetupAPIService);

	eventlogSetupAPIService.$inject = ['xpdAccessFactory', 'setupAPIService', '$rootScope'];

	function eventlogSetupAPIService(xpdAccessFactory, setupAPIService, $rootScope) {

		var BASE_URL = xpdAccessFactory.getSetupURL() + 'setup/event';

		var vm = this;

		vm.listTrackingEventByOperation = listTrackingEventByOperation;
		vm.listByFilters = listByFilters;
		vm.getWithDetails = getWithDetails;


		function listTrackingEventByOperation(operationId, successCallback, errorCallback) {
			var url = BASE_URL + '/operation/' + operationId + '/tracking-events';

			var req = {
				method: 'GET',
				url: url
			};

			setupAPIService.doRequest(req, successCallback, errorCallback);
		}

		function listByFilters(eventType, operationId, limit, fromDate, toDate, successCallback, errorCallback) {
			var url = BASE_URL + '/list-by-type';

			var params = 0;

			if (eventType || operationId || limit || fromDate || fromDate) {
				url += '?';

				if (eventType) {
					url += 'type=' + eventType;
					params++;
				}

				if (operationId) {
					if (params > 0)
						url += '&';

					url += 'operation-id=' + operationId;
					params++;
				}

				if (limit) {
					if (params > 0)
						url += '&';

					url += 'limit=' + limit;
					params++;
				}

				if (fromDate) {
					if (params > 0)
						url += '&';

					url += 'from=' + fromDate.getTime();
					params++;
				}

				if (toDate) {
					if (params > 0)
						url += '&';

					url += 'to=' + toDate.getTime();
					params++;
				}

				if (params > 0)
					url += '&';

				url += 'xpdmodule=' + $rootScope.XPDmodule;
			}

			var req = {
				method: 'GET',
				url: url
			};

			setupAPIService.doRequest(req, successCallback, errorCallback);
		}

		function getWithDetails(eventId, successCallback, errorCallback) {
			var url = BASE_URL;
			url += '/' + eventId + '/details';

			var req = {
				method: 'GET',
				url: url
			};

			setupAPIService.doRequest(req, successCallback, errorCallback);
		}

	}

})();
