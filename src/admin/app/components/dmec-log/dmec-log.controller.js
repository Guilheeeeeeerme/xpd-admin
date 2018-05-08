
(function () {
	'use strict';

	angular.module('xpd.dmeclog')
		.controller('DMecLogController', DMecLogController);

	DMecLogController.$inject = ['$scope', '$timeout', '$interval', '$q', 'readingSetupAPIService'];

	function DMecLogController($scope, $timeout, $interval, $q, readingSetupAPIService) {

		var ONE_HOUR = 3600000;
		var ONE_DAY = 24 * ONE_HOUR;
		var updateLatency = 1000;
		var getTickInterval;

		var resetPage = $timeout(reload, (ONE_HOUR / 2) );
			
		$scope.$on('$destroy', destroy );

		$scope.zoomIsLocked = false;
		$scope.actionButtonSubmitDmecRange = actionButtonSubmitDmecRange;
		$scope.isZooming = isZooming;
		
		initializeComponent();

		function destroy() {
    		if (resetPage) {
        		$timeout.cancel(resetPage);
    		}
    		if (getTickInterval) {
        		$interval.cancel(getTickInterval);
    		}
		}

		function reload () {
			location.reload();
		}

		function initializeComponent() {
			
			var endAt = new Date().getTime();
			var intervalToShow = 0;
			var inputRangeForm = $scope.inputRangeForm = getInputRangeForm();

			if (inputRangeForm.realtime) {
				intervalToShow = (+inputRangeForm.last * +inputRangeForm.toMilliseconds);
				$scope.dmecTrackingStartAt = getAllReadingSince(new Date(endAt - intervalToShow));
			} else {
				$scope.dmecTrackingStartAt = getAllReadingSince(new Date(inputRangeForm.startTime));
			}

			intervalToShow = endAt - new Date($scope.dmecTrackingStartAt).getTime();
			$scope.dmecTrackingEndAt = new Date(endAt);
			$scope.zoomEndAt = new Date(endAt);
			$scope.zoomStartAt = new Date(endAt - (intervalToShow / 2));

			if (angular.isDefined(getTickInterval)) {
				$interval.cancel(getTickInterval);
				getTickInterval = undefined;
			}

			getTickInterval = $interval(getTick, updateLatency);

		}

		function isZooming(lockZoom){
			$scope.zoomIsLocked = lockZoom;
		}

		function moveZoomRealtime() {
						
			var now = new Date();
			var zoom = new Date($scope.zoomEndAt).getTime() - new Date($scope.zoomStartAt).getTime();

			$scope.zoomStartAt = new Date(now.getTime() - zoom);
			$scope.zoomEndAt = now;
		}

		function actionButtonSubmitDmecRange() {			
			localStorage.setItem('dmecInputRangeForm', JSON.stringify($scope.inputRangeForm));
			location.reload();
		}

		function getTick() {
			
			if ($scope.inputRangeForm.realtime) {

				var now = new Date().getTime();
				$scope.dmecTrackingEndAt = now;

				if($scope.inputRangeForm.keepZoomAtTheEnd){
					
					if(!$scope.zoomIsLocked){
						moveZoomRealtime();
					}
				}

				$scope.onReading = $q(function (resolve, reject) {
					readingSetupAPIService.getTick((now - updateLatency), resolve, reject);
				});

			}

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

				promiseList.push($q(function (resolve, reject) {
					readingSetupAPIService.getAllReadingByStartEndTime(loopStartTime.getTime(), loopEndTimestamp, resolve, reject);
				}));

				loopStartTime = new Date(loopEndTime);
			}


			$scope.onReadingSince = $q(function (resolve, reject) {

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

			return startTime;
		}

		function getInputRangeForm() {
			
			var inputRangeForm;

			try {
				inputRangeForm = JSON.parse(localStorage.getItem('dmecInputRangeForm'));
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

