(function () {
	'use strict';

	angular.module('xpd.admin').directive('dmecTracking', dmecTrackingDirective);

	dmecTrackingDirective.$inject = ['readingSetupAPIService', '$timeout', '$interval', '$q'];

	function dmecTrackingDirective(readingSetupAPIService, $timeout, $interval, $q) {
		return {
			scope: {
				// bitDepthByEvents: '=',
				connectionEvents: '=',
				tripEvents: '=',
				timeEvents: '='
			},
			controller: 'TrackingController',
			controllerAs: 'atController',
			restrict: 'AE',
			templateUrl: 'app/components/admin/directives/dmec-tracking.template.html',
			link: link
		};

		function link(scope, element, attrs) {

			var ONE_HOUR = 3600000;
			var ONE_DAY = 24 * ONE_HOUR;
			var updateLatency = 1000;
			var getTickInterval;

			setTimeout(function () {
				location.reload();
			}, (ONE_HOUR / 2) );

			scope.zoomIsLocked = false;
			scope.isZooming = isZooming;
			scope.actionButtonUseOperationStartDate = actionButtonUseOperationStartDate;
			scope.actionButtonSubmitDmecRange = actionButtonSubmitDmecRange;
			scope.initializeComponent = initializeComponent;

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
					getTickInterval = undefined;
				}

				getTickInterval = $interval(getTick, updateLatency);

			}

			function isZooming(lockZoom){
				scope.zoomIsLocked = lockZoom;
			}
	

			function moveZoomRealtime() {
				var now = new Date();
				var zoom = new Date(scope.zoomEndAt).getTime() - new Date(scope.zoomStartAt).getTime();

				scope.zoomStartAt = new Date(now.getTime() - zoom);
				scope.zoomEndAt = now;
			}

			function actionButtonUseOperationStartDate(startDate) {

				if (scope.inputRangeForm.useOperationStartDate) {
					scope.inputRangeForm.startTime = new Date(startDate);
					scope.inputRangeForm.startTime.setMilliseconds(0);
					scope.inputRangeForm.startTime.setSeconds(0);
				}

			}

			function actionButtonSubmitDmecRange() {
				localStorage.setItem('dmecTrackingInputRangeForm', JSON.stringify(scope.inputRangeForm));
				location.reload();
			}

			function getTick() {

				if (scope.inputRangeForm.realtime) {

					var now = new Date().getTime();
					scope.dmecTrackingEndAt = now;

					if(scope.inputRangeForm.keepZoomAtTheEnd){
						if(!scope.zoomIsLocked){
							moveZoomRealtime();
						}
					}

					scope.onReading = $q(function (resolve, reject) {
						readingSetupAPIService.getTick((now - updateLatency), resolve, reject);
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

			function getAllReadingSince(startTime) {

				startTime = new Date(startTime);

				var operationStartDate = new Date(scope.operationData.operationContext.currentOperation.startDate);

				if (startTime.getTime() < operationStartDate.getTime()) {
					startTime = operationStartDate;
				}


				var loopLimit = new Date();
				var loopStartTime = new Date(startTime);
				var loopEndTime = new Date(startTime);

				var promiseList = [];

				while (loopEndTime.getTime() < loopLimit.getTime()) {

					loopEndTime.setHours(loopStartTime.getHours() + 12);

					if (loopEndTime.getTime() > loopLimit.getTime()) {
						loopEndTime = loopLimit;
					}

					promiseList.push($q(function (resolve, reject) {
						readingSetupAPIService.getAllReadingByStartEndTime(loopStartTime.getTime(), loopEndTime.getTime(), resolve, reject);
					}));

					loopStartTime = new Date(loopEndTime);
				}

				scope.onReadingSince = $q(function (resolve, reject) {

					$q.all(promiseList).then(function (readings) {

						var parsedReadings = [];

						for (var i in readings) {

							if(readings[i] && readings[i][0] && readings[i][0].timestamp){
								parsedReadings.push({
									timestamp: readings[i][0].timestamp
								});
							}
							
							parsedReadings = parsedReadings.concat(readings[i]);
						}

						resolve(parsedReadings);
					});

				});

				scope.bitDepthPoints = null;
				scope.maxDepth = null;

				scope.onReadingSince.then(function (data) {
					scope.bitDepthPoints = generateBitDepthPoints(data);
				});

				return startTime;
			}

			function getInputRangeForm() {

				var inputRangeForm;

				try {
					inputRangeForm = JSON.parse(localStorage.getItem('dmecTrackingInputRangeForm'));
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


			function generateBitDepthPoints(readings) {
				var points = [];

				readings.map(function (reading) {

					if (reading.bitDepth) {
						if (scope.maxDepth == null) {
							scope.maxDepth = reading.bitDepth;
						} else {
							scope.maxDepth = Math.max(scope.maxDepth, reading.bitDepth);
						}
					}

					points.push({
						x: reading.timestamp,
						y: reading.bitDepth || null
					});

				});

				return points;
			}
		}
	}
})();