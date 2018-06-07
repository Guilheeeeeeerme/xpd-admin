(function () {
	'use strict';

	angular.module('xpd.admin').directive('dmecTracking', dmecTrackingDirective);

	dmecTrackingDirective.$inject = ['readingSetupAPIService', '$timeout', '$interval', '$q'];

	function dmecTrackingDirective(readingSetupAPIService, $timeout, $interval, $q) {
		return {
			scope: {
				connectionEvents: '=',
				tripEvents: '=',
				timeEvents: '=',
				currentOperation: '=',
				currentEvent: '=',
				currentTick: '=',
				currentBlockPosition: '=',
				currentReading: '='
			},
			restrict: 'AE',
			templateUrl: 'app/components/admin/directives/dmec-tracking.template.html',
			link: link
		};

		function link(scope, element, attrs) {

			var ONE_HOUR = 3600000;
			var ONE_DAY = 24 * ONE_HOUR;
			var updateLatency = 1000;
			var getTickInterval;

			var resetPage = $timeout(reload, (ONE_HOUR / 2));

			scope.$on('$destroy', destroy);

			scope.zoomIsLocked = false;
			scope.isZooming = isZooming;
			scope.actionButtonUseOperationStartDate = actionButtonUseOperationStartDate;
			scope.actionButtonSubmitDmecRange = actionButtonSubmitDmecRange;
			scope.initializeComponent = initializeComponent;

			scope.setZoomStartAt = setZoomStartAt;
			scope.setZoomEndAt = setZoomEndAt;

			function reload() {
				location.reload();
			}

			function destroy() {
				if (resetPage) {
					$timeout.cancel(resetPage);
				}
				if (getTickInterval) {
					$interval.cancel(getTickInterval);
				}
			}

			function setZoomStartAt(zoomStartAt) {
				scope.zoomStartAt = new Date(zoomStartAt);
			}

			function setZoomEndAt(zoomEndAt) {
				scope.zoomEndAt = new Date(zoomEndAt);
			}

			function initializeComponent() {

				var endAt = new Date().getTime();
				var intervalToShow = 0;
				var inputRangeForm = scope.inputRangeForm = getInputRangeForm();

				if (inputRangeForm.realtime) {
					intervalToShow = (+inputRangeForm.last * +inputRangeForm.toMilliseconds);
					scope.dmecTrackingStartAt = getAllReadingSince(new Date(endAt - intervalToShow));
				} else {
					scope.dmecTrackingStartAt = getAllReadingSince(new Date(inputRangeForm.startTime));
				}

				intervalToShow = endAt - new Date(scope.dmecTrackingStartAt).getTime();
				scope.dmecTrackingEndAt = new Date(endAt);
				scope.zoomEndAt = new Date(endAt);
				scope.zoomStartAt = new Date(endAt - (intervalToShow / 2));

				if (angular.isDefined(getTickInterval)) {
					$interval.cancel(getTickInterval);
				}

				getTickInterval = $interval(getTick, updateLatency);

			}

			function isZooming(lockZoom) {
				scope.zoomIsLocked = lockZoom;
			}

			function actionButtonUseOperationStartDate(startDate) {

				scope.inputRangeForm.startTime = new Date(startDate);
				scope.inputRangeForm.startTime.setMilliseconds(0);
				scope.inputRangeForm.startTime.setSeconds(0);

			}

			function actionButtonSubmitDmecRange() {
				localStorage.setItem('xpd.admin.tracking.dmecInputRangeForm', JSON.stringify(scope.inputRangeForm));
				location.reload();
			}

			function getTick() {

				if (scope.inputRangeForm.realtime) {

					var now = new Date().getTime();
					scope.dmecTrackingEndAt = now;
					setZoomEndAt(now);

					scope.onReading = $q(function (resolve, reject) {
						var currentReading = scope.currentReading;
						if (currentReading.timestamp && currentReading.timestamp) {
							currentReading.timestamp = new Date(currentReading.timestamp).getTime();
							resolve(currentReading);
						}
					});

					scope.onReading.then(function (data) {
						scope.maxDepth = Math.max(scope.maxDepth, data.bitDepth);

						if (scope.bitDepthPoints) {
							scope.bitDepthPoints.push({
								x: data.timestamp,
								y: data.bitDepth
							});
						}

					});

				}

			}

			function getAllReadingByStartEndTime(startTime, endTime) {
				return function (resolve, reject) {
					readingSetupAPIService.getAllReadingByStartEndTime(startTime, endTime, resolve, reject);
				};
			}

			function getAllReadingSince(startTime) {

				startTime = new Date(startTime);

				var operationStartDate = new Date(scope.currentOperation.startDate);

				if (startTime.getTime() < operationStartDate.getTime()) {
					startTime = operationStartDate;
				}

				var loopLimit = new Date();
				var loopStartTime = new Date(startTime);
				var loopEndTime = new Date(startTime);

				loopStartTime.setMinutes(0);
				loopStartTime.setSeconds(0);
				loopStartTime.setMilliseconds(0);

				var promiseList = [];

				while (loopEndTime.getTime() < loopLimit.getTime()) {

					loopEndTime.setHours( loopStartTime.getHours() + 1 );
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

								for(var i in readings){
									if(!parsedReadings[i]){
										parsedReadings[i] = readings[i];
									}else{
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

				scope.bitDepthPoints = null;
				scope.maxDepth = null;

				scope.onReadingSince.then(function (readings) {
					scope.bitDepthPoints = generateBitDepthPoints(readings.bitDepth);
				});

				return startTime;
			}

			function getInputRangeForm() {

				var inputRangeForm;

				try {
					inputRangeForm = JSON.parse(localStorage.getItem('xpd.admin.tracking.dmecInputRangeForm'));
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


			function generateBitDepthPoints(bitDepthList) {
				var points = [];

				bitDepthList.map(function (bitDepthPoint) {

					if (bitDepthPoint.actual) {
						if (scope.maxDepth == null) {
							scope.maxDepth = bitDepthPoint.actual;
						} else {
							scope.maxDepth = Math.max(scope.maxDepth, bitDepthPoint.actual);
						}
					}

					points.push({
						x: bitDepthPoint.x,
						y: bitDepthPoint.actual || null
					});

				});

				return points;
			}
		}
	}
})();