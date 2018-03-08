(function () {
	'use strict';

	angular.module('xpd.setupapi')
		.service('scheduleSetupAPIService', scheduleSetupAPIService);

	scheduleSetupAPIService.$inject = ['$http', 'xpdAccessFactory', 'setupAPIService'];

	function scheduleSetupAPIService($http, xpdAccessFactory, setupAPIService) {
		var vm = this;
		var apiUrl = xpdAccessFactory.getSetupURL();

		vm.getOnlyScheduled = getOnlyScheduled;
		vm.cleanList = cleanList;
		vm.fullScheduleByRangeDate = fullScheduleByRangeDate;
		vm.getCleanListBySchedule = getCleanListBySchedule;
		vm.insertScheduleList = insertScheduleList;
		vm.indentificationExists = indentificationExists;

		function indentificationExists(id, identification, successCallback, errorCallback){

			var req = {
				method: 'GET',
				url: apiUrl + 'setup/member/identification-exists/' + identification
			};
			
			if(id){
				req.url += '/exclude-member/'+id;
			}

			$http(req).then(
	            function(response) {
	                successCallback && successCallback(response.data.data);
	            },
	            function(error){
	                errorCallback && errorCallback(error);
	                setupAPIService.generateToast(error.data, true);
	            }
			);
			
		}

		function cleanList(memberId, fromDate, toDate, successCallback, errorCallback) {
			//dialogFactory.showLoadingDialog();

			var req = {
				method: 'GET',
				url: apiUrl + 'setup/schedule/clean-list?memberId=' + memberId + '&fromDate=' + fromDate + '&toDate=' + toDate
			};

			$http(req).then(
	            function(response) {
	                successCallback && successCallback(response.data.data);
	            },
	            function(error){
	                errorCallback && errorCallback(error);
	                setupAPIService.generateToast(error.data, true);
	            }
			);

		}

		function getCleanListBySchedule(schedule, successCallback, errorCallback) {
			//dialogFactory.showLoadingDialog();

			var req = {
				method: 'POST',
				url: apiUrl + 'setup/schedule/clean-list-by-schedule',
				headers: {
					'Content-Type': 'application/json'
				},
				data: schedule
			};

			$http(req).then(
	            function(response) {
	                // setupAPIService.generateToast(response.data, false);
	                successCallback && successCallback(response.data.data);
	            },
	            function(error){
	                errorCallback && errorCallback(error);
	                setupAPIService.generateToast(error.data, true);
	            }
			);

		}

		function getOnlyScheduled(fromDate, toDate, successCallback) {
			//dialogFactory.showLoadingDialog();

			var url = apiUrl + 'setup/schedule/schedule-by-range-date?';
			url += 'fromDate=' + fromDate + '&';
			url += 'toDate=' + toDate;

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

		function fullScheduleByRangeDate(fromDate, toDate, successCallback) {
			//dialogFactory.showLoadingDialog();

			var url = apiUrl + 'setup/schedule/full-schedule-by-range-date?';
			url += 'fromDate=' + fromDate + '&';
			url += 'toDate=' + toDate;

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

		function defaultErrorCallback(error) {
			if (error != null && error.status != null && error.status == -1) {
				console.log('Unable to reach XPD server, please check your connectivity');
				//dialogFactory.showMessageDialog('Unable to reach XPD server, please check your connectivity', 'Network Error');
			} else {
				//dialogFactory.showMessageDialog(error, 'Error');
				console.log('Schedule Setup API Transaction Error!');
				console.log(error);
			}

		}

		function insertScheduleList(objectList, successCallback, errorCallback) {

			var req = {
				method: 'POST',
				url: apiUrl + 'setup/schedule/insert-list',
				headers: {
					'Content-Type': 'application/json'
				},
				data: objectList
			};

			$http(req).then(
	            function(data) {
	                successCallback && successCallback(data.data);
	                setupAPIService.generateToast(data.data, false);
	            },
	            function(error){
	                errorCallback && errorCallback(error);
	                setupAPIService.generateToast(error.data, true);
	            }
			);

		}
	}

})();
