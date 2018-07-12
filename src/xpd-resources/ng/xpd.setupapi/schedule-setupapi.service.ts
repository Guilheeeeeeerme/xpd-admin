(function() {
	'use strict';

	angular.module('xpd.setupapi')
		.service('scheduleSetupAPIService', scheduleSetupAPIService);

	scheduleSetupAPIService.$inject = ['xpdAccessFactory', 'setupAPIService'];

	function scheduleSetupAPIService(xpdAccessFactory, setupAPIService) {
		let vm = this;
		let apiUrl = xpdAccessFactory.getSetupURL();

		vm.getOnlyScheduled = getOnlyScheduled;
		vm.fullScheduleByRangeDate = fullScheduleByRangeDate;
		vm.getCleanListBySchedule = getCleanListBySchedule;
		vm.indentificationExists = indentificationExists;
		vm.getMemberScore = getMemberScore;

		vm.getScheduleById = getScheduleById;
		vm.insertSchedule = insertSchedule;
		vm.updateSchedule = updateSchedule;
		vm.removeSchedule = removeSchedule;

		vm.getFunctionById = getFunctionById;
		vm.insertFunction = insertFunction;
		vm.removeFunction = removeFunction;
		vm.updateFunction = updateFunction;

		vm.getMemberById = getMemberById;
		vm.insertMember = insertMember;
		vm.removeMember = removeMember;
		vm.updateMember = updateMember;

		/**
		 * Function
		 * setup/function
		 */
		function getFunctionById(id, successCallback, errorCallback) {

			let modelURL = 'setup/function';

			let req = {
				method: 'GET',
				url: xpdAccessFactory.getSetupURL() + modelURL + '/' + id,
			};

			setupAPIService.doRequest(req, successCallback, errorCallback);

		}

		function insertFunction(object, successCallback, errorCallback) {

			let modelURL = 'setup/function';

			let req = {
				method: 'POST',
				url: xpdAccessFactory.getSetupURL() + modelURL,
				headers: {
					'Content-Type': 'application/json',
				},
				data: object,
			};

			setupAPIService.doRequest(req, successCallback, errorCallback);
		}

		function updateFunction(object, successCallback, errorCallback) {

			let modelURL = 'setup/function';

			let req = {
				method: 'PUT',
				url: xpdAccessFactory.getSetupURL() + modelURL + '/' + object.id,
				headers: {
					'Content-Type': 'application/json',
				},
				data: object,
			};

			setupAPIService.doRequest(req, successCallback, errorCallback);
		}

		function removeFunction(object, successCallback, errorCallback) {

			let modelURL = 'setup/function';

			let req = {
				method: 'DELETE',
				url: xpdAccessFactory.getSetupURL() + modelURL, // + '/' + object.id,
				headers: {
					'Content-Type': 'application/json',
				},
				data: {id: object.id },
			};

			setupAPIService.doRequest(req, successCallback, errorCallback);
		}

		/**
		 * Member
		 * setup/member
		 */
		function updateMember(object, successCallback, errorCallback) {

			let modelURL = 'setup/member';

			let req = {
				method: 'PUT',
				url: xpdAccessFactory.getSetupURL() + modelURL + '/' + object.id,
				headers: {
					'Content-Type': 'application/json',
				},
				data: object,
			};

			setupAPIService.doRequest(req, successCallback, errorCallback);
		}

		function getMemberById(id, successCallback, errorCallback) {

			let modelURL = 'setup/member';

			let req = {
				method: 'GET',
				url: xpdAccessFactory.getSetupURL() + modelURL + '/' + id,
			};

			setupAPIService.doRequest(req, successCallback, errorCallback);

		}

		function indentificationExists(id, identification, successCallback, errorCallback) {

			let req = {
				method: 'GET',
				url: apiUrl + 'setup/member/identification-exists/' + identification,
			};

			if (id) {
				req.url += '/exclude-member/' + id;
			}

			setupAPIService.doRequest(req, successCallback, errorCallback);

		}

		function insertMember(object, successCallback, errorCallback) {

			let modelURL = 'setup/member';

			let req = {
				method: 'POST',
				url: xpdAccessFactory.getSetupURL() + modelURL,
				headers: {
					'Content-Type': 'application/json',
				},
				data: object,
			};

			setupAPIService.doRequest(req, successCallback, errorCallback);
		}

		function removeMember(object, successCallback, errorCallback) {

			let modelURL = 'setup/member';

			let req = {
				method: 'DELETE',
				url: xpdAccessFactory.getSetupURL() + modelURL, // + '/' + object.id,
				headers: {
					'Content-Type': 'application/json',
				},
				data: {id: object.id },
			};

			setupAPIService.doRequest(req, successCallback, errorCallback);
		}

		function getMemberScore(successCallback, errorCallback) {

			let modelURL = 'setup/member';

			let req = {
				method: 'GET',
				url: xpdAccessFactory.getSetupURL() + modelURL + '/score/list',
				headers: {
					'Content-Type': 'application/json',
				},
			};

			setupAPIService.doRequest(req, successCallback, errorCallback);
		}

		/**
		 * Schedule
		 * setup/schedule
		 */
		function getScheduleById(id, successCallback, errorCallback) {

			let modelURL = 'setup/schedule';

			let req = {
				method: 'GET',
				url: xpdAccessFactory.getSetupURL() + modelURL + '/' + id,
			};

			setupAPIService.doRequest(req, successCallback, errorCallback);
		}

		function removeSchedule(object, successCallback, errorCallback) {

			let modelURL = 'setup/schedule';

			let req = {
				method: 'DELETE',
				url: xpdAccessFactory.getSetupURL() + modelURL, //  + '/' + object.id,
				headers: {
					'Content-Type': 'application/json',
				},
				data: {id: object.id },
			};

			setupAPIService.doRequest(req, successCallback, errorCallback);
		}

		function insertSchedule(object, successCallback, errorCallback) {

			let modelURL = 'setup/schedule';

			let req = {
				method: 'POST',
				url: xpdAccessFactory.getSetupURL() + modelURL,
				headers: {
					'Content-Type': 'application/json',
				},
				data: object,
			};

			setupAPIService.doRequest(req, successCallback, errorCallback);
		}

		function updateSchedule(object, successCallback, errorCallback) {

			let modelURL = 'setup/schedule';

			let req = {
				method: 'PUT',
				url: xpdAccessFactory.getSetupURL() + modelURL + '/' + object.id,
				headers: {
					'Content-Type': 'application/json',
				},
				data: object,
			};

			setupAPIService.doRequest(req, successCallback, errorCallback);
		}

		/**
		 * Busca toda a agenda de todos os membros QUE TEM ALGUMA SCHEDULE em um intervalo
		 * @param {millis} fromDate
		 * @param {millis} toDate
		 * @param {callback} successCallback
		 * @param {errorCallback} errorCallback
		 */
		function getOnlyScheduled(fromDate, toDate, successCallback, errorCallback) {

			let url = apiUrl + 'setup/schedule/schedule-by-range-date?';
			url += 'fromDate=' + fromDate + '&';
			url += 'toDate=' + toDate;

			let req = {
				method: 'GET',
				url,
			};

			setupAPIService.doRequest(req, successCallback, errorCallback);
		}

		/**
		 * Busca toda a agenda de todos os membros em um intervalo
		 * @param {millis} fromDate
		 * @param {millis} toDate
		 * @param {callback} successCallback
		 * @param {errorCallback} errorCallback
		 */
		function fullScheduleByRangeDate(fromDate, toDate, successCallback, errorCallback) {

			let url = apiUrl + 'setup/schedule/full-schedule-by-range-date?';
			url += 'fromDate=' + fromDate + '&';
			url += 'toDate=' + toDate;

			let req = {
				method: 'GET',
				url,
			};

			setupAPIService.doRequest(req, successCallback, errorCallback);
		}

		/**
		 * Sends afake schedule of a member, than the systems deletes ALL the schedules of this member
		 * and returns a list of id os those who were deleted
		 * @param {*} schedule
		 * @param {*} successCallback
		 * @param {*} errorCallback
		 */
		function getCleanListBySchedule(schedule, successCallback, errorCallback) {

			let req = {
				method: 'POST',
				url: apiUrl + 'setup/schedule/clean-list-by-schedule',
				headers: {
					'Content-Type': 'application/json',
				},
				data: schedule,
			};

			setupAPIService.doRequest(req, successCallback, errorCallback);

		}

	}

})();
