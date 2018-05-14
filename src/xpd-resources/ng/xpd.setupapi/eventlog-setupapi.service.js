(function () {
	'use strict';

	angular.module('xpd.setupapi').service('eventlogSetupAPIService', eventlogSetupAPIService);

	eventlogSetupAPIService.$inject = ['$http', 'xpdAccessFactory', 'setupAPIService', '$rootScope'];

	function eventlogSetupAPIService($http, xpdAccessFactory, setupAPIService, $rootScope) {

		var vm = this;

		vm.listByType = listByType;
		vm.listByDate = listByDate;
		vm.listByOperation = listByOperation;
		vm.listTrackingEventByOperation = listTrackingEventByOperation;
		vm.listTrackingParallelEventByOperation = listTrackingParallelEventByOperation;
		vm.getWithDetails = getWithDetails;

		function listByType(type, operationId, limit, successCallback, errorCallback) {
			var url = xpdAccessFactory.getSetupURL() + 'setup/event/list-by-type';
			var params = 0;

			if (type || operationId || limit) {
				url += '?';

				if (type) {
					url += 'type=' + type;
					params += 1;
				}

				if (operationId) {
					if (params > 0)
						url += '&';

					url += 'operation-id=' + operationId;
					params += 1;
				}

				if (limit) {
					if (params > 0)
						url += '&';

					url += 'limit=' + limit;
					params += 1;
				}

				if (params > 0)
					url += '&';

				url += 'xpdmodule=' + $rootScope.XPDmodule;
			}

			var req = {
				method: 'GET',
				url: url
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

		function listByDate(type, operationId, limit, fromDate, toDate, successCallback, errorCallback) {
			var url = xpdAccessFactory.getSetupURL() + 'setup/event/list-by-type';
			var params= 0;

			if(type || operationId || limit){
				url += '?';

				if(type){
					url += 'type=' + type;
					params += 1;
				}

				if(operationId){
					if(params>0)
						url+='&';

					url += 'operation-id='+operationId;
					params += 1;
				}

				if(limit){
					if(params>0)
						url+='&';
                    
					url += 'limit='+limit;
				}

				if (fromDate) {
					if (params > 0)
						url += '&';

					url += 'from='+fromDate.getTime();
				}

				if (toDate) {
					if (params > 0)
						url += '&';

					url += 'to='+toDate.getTime();
				}

				if (params > 0)
					url += '&';

				url += 'xpdmodule=' + $rootScope.XPDmodule;
			}

			var req = {
				method: 'GET',
				url: url
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

		function listByOperation(operationId, successCallback, errorCallback) {
			var url = xpdAccessFactory.getSetupURL() + 'setup/operation/';

			if(operationId){
				url += operationId;
				url += '/events';
			}

			var req = {
				method: 'GET',
				url: url
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

		function listTrackingParallelEventByOperation(operationId, successCallback, errorCallback){
			var url = xpdAccessFactory.getSetupURL() + 'setup/operation/';

			if (operationId) {
				url += operationId;
				url += '/tracking-parallel-events';
			}

			var req = {
				method: 'GET',
				url: url
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

		function listTrackingEventByOperation(operationId, successCallback, errorCallback) {
			var url = xpdAccessFactory.getSetupURL() + 'setup/operation/';

			if (operationId) {
				url += operationId;
				url += '/tracking-events';
			}

			var req = {
				method: 'GET',
				url: url
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

		function getWithDetails(eventId, successCallback, errorCallback) {
			var url = xpdAccessFactory.getSetupURL() + 'setup/event/';
			url += eventId + '/details';

			var req = {
				method: 'GET',
				url: url
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
