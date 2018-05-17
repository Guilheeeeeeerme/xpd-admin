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

		vm.getScheduleById = getScheduleById;
		vm.getMemberById = getMemberById;
		vm.getFunctionById = getFunctionById;

		vm.insertSchedule = insertSchedule;
		vm.updateSchedule = updateSchedule;
		vm.removeSchedule = removeSchedule;

		vm.insertFunction = insertFunction;
		vm.removeFunction = removeFunction;
		vm.updateFunction = updateFunction;

		vm.insertMember = insertMember;
		vm.removeMember = removeMember;
		vm.updateMember = updateMember;

		/**
		 * Function
		 * setup/function
		 */
		function getFunctionById(id, successCallback, errorCallback) {

			var modelURL = 'setup/function';

			$http.get(xpdAccessFactory.getSetupURL() + modelURL + '/' + id)
				.then(
					function (response) {
						successCallback && successCallback(response.data.data);
					},
					function (error) {
						setupAPIService.generateToast(error.data, true);
						errorCallback && errorCallback(error);
					}
				);

		}

		function insertFunction(object, successCallback, errorCallback) {

			var modelURL = 'setup/function';

			var req = {
				method: 'POST',
				url: xpdAccessFactory.getSetupURL() + modelURL,
				headers: {
					'Content-Type': 'application/json'
				},
				data: object
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

		function updateFunction(object, successCallback, errorCallback) {

			var modelURL = 'setup/function';

			var req = {
				method: 'PUT',
				url: xpdAccessFactory.getSetupURL() + modelURL + '/' + object.id,
				headers: {
					'Content-Type': 'application/json'
				},
				data: object
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

		function removeFunction(object, successCallback, errorCallback) {

			var modelURL = 'setup/function';

			var req = {
				method: 'PUT',
				url: xpdAccessFactory.getSetupURL() + modelURL + '/' + object.id,
				headers: {
					'Content-Type': 'application/json'
				},
				data: object
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

		/**
		 * Member
		 * setup/member
		 */
		function updateMember(object, successCallback, errorCallback) {

			var modelURL = 'setup/member';

			var req = {
				method: 'PUT',
				url: xpdAccessFactory.getSetupURL() + modelURL + '/' + object.id,
				headers: {
					'Content-Type': 'application/json'
				},
				data: object
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

		function getMemberById(id, successCallback, errorCallback) {

			var modelURL = 'setup/member';

			$http.get(xpdAccessFactory.getSetupURL() + modelURL + '/' + id)
				.then(
					function (response) {
						successCallback && successCallback(response.data.data);
					},
					function (error) {
						setupAPIService.generateToast(error.data, true);
						errorCallback && errorCallback(error);
					}
				);

		}

		function indentificationExists(id, identification, successCallback, errorCallback) {

			var req = {
				method: 'GET',
				url: apiUrl + 'setup/member/identification-exists/' + identification
			};

			if (id) {
				req.url += '/exclude-member/' + id;
			}

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

		function insertMember(object, successCallback, errorCallback) {

			var modelURL = 'setup/member';

			var req = {
				method: 'POST',
				url: xpdAccessFactory.getSetupURL() + modelURL,
				headers: {
					'Content-Type': 'application/json'
				},
				data: object
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

		function removeMember(object, successCallback, errorCallback) {

			var modelURL = 'setup/member';

			var req = {
				method: 'PUT',
				url: xpdAccessFactory.getSetupURL() + modelURL + '/' + object.id,
				headers: {
					'Content-Type': 'application/json'
				},
				data: object
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

		/**
		 * Schedule
		 * setup/schedule
		 */
		function getScheduleById(id, successCallback, errorCallback) {

			var modelURL = 'setup/schedule';

			$http.get(xpdAccessFactory.getSetupURL() + modelURL + '/' + id)
				.then(
					function (response) {
						successCallback && successCallback(response.data.data);
					},
					function (error) {
						setupAPIService.generateToast(error.data, true);
						errorCallback && errorCallback(error);
					}
				);
		}

		function removeSchedule(object, successCallback, errorCallback) {

			var modelURL = 'setup/schedule';

			var req = {
				method: 'PUT',
				url: xpdAccessFactory.getSetupURL() + modelURL + '/' + object.id,
				headers: {
					'Content-Type': 'application/json'
				},
				data: object
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

		function cleanList(memberId, fromDate, toDate, successCallback, errorCallback) {

			var req = {
				method: 'GET',
				url: apiUrl + 'setup/schedule/clean-list?memberId=' + memberId + '&fromDate=' + fromDate + '&toDate=' + toDate
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
		function insertSchedule(object, successCallback, errorCallback) {

			var modelURL = 'setup/schedule';

			var req = {
				method: 'POST',
				url: xpdAccessFactory.getSetupURL() + modelURL,
				headers: {
					'Content-Type': 'application/json'
				},
				data: object
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

		function updateSchedule(object, successCallback, errorCallback) {

			var modelURL = 'setup/schedule';

			var req = {
				method: 'PUT',
				url: xpdAccessFactory.getSetupURL() + modelURL + '/' + object.id,
				headers: {
					'Content-Type': 'application/json'
				},
				data: object
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

		function getOnlyScheduled(fromDate, toDate, successCallback, errorCallback) {

			var url = apiUrl + 'setup/schedule/schedule-by-range-date?';
			url += 'fromDate=' + fromDate + '&';
			url += 'toDate=' + toDate;

			$http.get(url)
				.then(
					function (response) {
						successCallback && successCallback(response.data.data);
					},
					function (error) {
						setupAPIService.generateToast(error.data, true);
						errorCallback && errorCallback(error);
					}
				);
		}

		function fullScheduleByRangeDate(fromDate, toDate, successCallback, errorCallback) {

			var url = apiUrl + 'setup/schedule/full-schedule-by-range-date?';
			url += 'fromDate=' + fromDate + '&';
			url += 'toDate=' + toDate;

			$http.get(url)
				.then(
					function (response) {
						successCallback && successCallback(response.data.data);
					},
					function (error) {
						setupAPIService.generateToast(error.data, true);
						errorCallback && errorCallback(error);
					}
				);
		}

		function getCleanListBySchedule(schedule, successCallback, errorCallback) {

			var req = {
				method: 'POST',
				url: apiUrl + 'setup/schedule/clean-list-by-schedule',
				headers: {
					'Content-Type': 'application/json'
				},
				data: schedule
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
