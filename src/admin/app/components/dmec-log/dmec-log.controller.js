
(function () {
	'use strict';

	angular.module('xpd.dmeclog')
		.controller('DMecLogController', DMecLogController);

	DMecLogController.$inject = ['$scope', '$timeout', '$interval', '$q', 'readingSetupAPIService'];

	function DMecLogController(scope, $timeout, $interval, $q, readingSetupAPIService) {

		var ONE_HOUR = 3600000;
		var updateLatency = 5000;
		var getTickInterval;

		var resetPage = $timeout(reload, (ONE_HOUR / 2));

		scope.$on('$destroy', destroy);

		scope.actionButtonSubmitDmecRange = actionButtonSubmitDmecRange;
		scope.setZoomStartAt = setZoomStartAt;
		scope.setZoomEndAt = setZoomEndAt;

		initializeComponent();

		function destroy() {
			if (resetPage) {
				$timeout.cancel(resetPage);
			}
			if (getTickInterval) {
				$interval.cancel(getTickInterval);
			}
		}

		function reload() {
			location.reload();
		}

		function initializeComponent() {

			var endAtMillis = new Date().getTime();
			var intervalToShow = 0;
			var inputRangeForm = scope.inputRangeForm = getInputRangeForm();

			if (inputRangeForm.realtime) {
				intervalToShow = (+inputRangeForm.last * +inputRangeForm.toMilliseconds);
				scope.dmecTrackingStartAt = getAllReadingSince(new Date(endAtMillis - intervalToShow));
			} else {
				scope.dmecTrackingStartAt = getAllReadingSince(new Date(inputRangeForm.startTime));
			}

			intervalToShow = endAtMillis - new Date(scope.dmecTrackingStartAt).getTime();

			setZoomStartAt(new Date(endAtMillis - (intervalToShow / 2)));
			setZoomEndAt(new Date(endAtMillis));

		}

		function actionButtonSubmitDmecRange() {
			localStorage.setItem('xpd.admin.dmec.dmecInputRangeForm', JSON.stringify(scope.inputRangeForm));
			location.reload();
		}

		function getTick() {

			if (scope.inputRangeForm.realtime) {

				var now = new Date().getTime();

				scope.onReading = $q(function (resolve, reject) {
					readingSetupAPIService.getTick((now - updateLatency), resolve, reject);
				});

			}

		}

		function getAllReadingByStartEndTime(startTime, endTime) {
			return function (resolve, reject) {
				readingSetupAPIService.getAllReadingByStartEndTime(startTime, endTime, resolve, reject);
			};
		}

		function setZoomStartAt(zoomStartAt) {
			scope.zoomStartAt = new Date(zoomStartAt);
		}

		function setZoomEndAt(zoomEndAt) {
			scope.zoomEndAt = new Date(zoomEndAt);
		}

		function getAllReadingSince(startTime) {

			startTime = new Date(startTime);

			var loopLimit = new Date();
			var loopStartTime = new Date(startTime);
			var loopEndTime = new Date(startTime);

			loopStartTime.setMinutes(0);
			loopStartTime.setSeconds(0);
			loopStartTime.setMilliseconds(0);

			if (loopStartTime.getHours() < 12) {
				loopStartTime.setHours(0);
			} else {
				loopStartTime.setHours(12);
			}

			var promiseList = [];

			while (loopEndTime.getTime() < loopLimit.getTime()) {

				loopEndTime.setHours(loopStartTime.getHours() + 12);
				var loopEndTimestamp = loopEndTime.getTime();

				if (loopEndTime.getTime() > loopLimit.getTime()) {
					loopEndTimestamp = null;
				}

				promiseList.push(getAllReadingByStartEndTime(loopStartTime.getTime(), loopEndTimestamp));

				loopStartTime = new Date(loopEndTime);
			}


			scope.onReadingSince = $q(function (resolve, reject) {

				var parsedReadings = {};

				function mergeParsedReadings() {

					if (!promiseList || promiseList.length == 0) {
						resolve(parsedReadings);
					} else {
						var promise = promiseList.shift();

						promise(function (readings) {

							for (var i in readings) {
								if (!parsedReadings[i]) {
									parsedReadings[i] = readings[i];
								} else {
									parsedReadings[i] = parsedReadings[i].concat(readings[i]);
								}
							}

							mergeParsedReadings();

						}, function () {
							mergeParsedReadings();
						});
					}
				}

				mergeParsedReadings();


			});

			scope.onReadingSince.then(function () {

				if (angular.isDefined(getTickInterval)) {
					$interval.cancel(getTickInterval);
					getTickInterval = undefined;
				}

				getTickInterval = $interval(getTick, updateLatency);

			});

			return startTime;
		}

		function getInputRangeForm() {

			var inputRangeForm;

			try {
				inputRangeForm = JSON.parse(localStorage.getItem('xpd.admin.dmec.dmecInputRangeForm'));
			} catch (e) {
				inputRangeForm = null;
			}

			if (!inputRangeForm) {
				inputRangeForm = {
					realtime: true,
					last: 30,
					toMilliseconds: '60000',
				};
			}

			if (inputRangeForm && inputRangeForm.startTime) {
				inputRangeForm.startTime = new Date(inputRangeForm.startTime);
			}

			return inputRangeForm;
		}

	}

})();

