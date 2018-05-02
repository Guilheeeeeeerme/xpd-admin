(function () {
	'use strict';

	angular.module('xpd.admin').directive('dmecTracking', dmecTrackingDirective);

	dmecTrackingDirective.$inject = ['readingSetupAPIService', '$timeout', '$interval', '$q'];

	function dmecTrackingDirective(readingSetupAPIService, $timeout, $interval, $q) {
		return {
			scope: {
				bitDepthByEvents: '=',
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

				}

			}

			function getAllReadingSince(startTime) {

				startTime = new Date(startTime);
				var operationStartDate = new Date(scope.operationData.operationContext.currentOperation.startDate);

				if (startTime.getTime() < operationStartDate.getTime()) {
					startTime = operationStartDate;
				}

				scope.onReadingSince = $q(function (resolve, reject) {
					readingSetupAPIService.getAllReadingSince(startTime.getTime(), resolve, reject);
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


		}
	}
})();