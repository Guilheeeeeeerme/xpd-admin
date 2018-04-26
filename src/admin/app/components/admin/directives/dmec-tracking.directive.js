(function () {
	'use strict';

	angular.module('xpd.admin').directive('dmecTracking', dmecTrackingDirective);

	dmecTrackingDirective.$inject = ['readingSetupAPIService', '$timeout', '$interval'];

	function dmecTrackingDirective(readingSetupAPIService, $timeout, $interval) {
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


			var ONE_DAY = (1 * 24 * 3600000);
			var updateLatency = 1000;
			var getTickInterval;

			setTimeout(function(){
				location.reload();
			}, (ONE_DAY / 48) );

			scope.actionButtonUseOperationStartDate = actionButtonUseOperationStartDate;
			scope.actionButtonSubmitDmecRange = actionButtonSubmitDmecRange;
			scope.initializeComponent = initializeComponent;

			function initializeComponent() {

				var endAt = new Date().getTime();
				var intervalToShow = 0;
				var inputRangeForm = scope.inputRangeForm = getInputRangeForm();
				scope.readings = [];

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

			function moveZoomRealtime(newZoomEndAt) {

				if (scope.inputRangeForm && scope.inputRangeForm.realtime) {
					var timeDiff = new Date(newZoomEndAt).getTime() - new Date(scope.zoomEndAt).getTime();
					scope.zoomStartAt = new Date(new Date(scope.zoomStartAt).getTime() + timeDiff);
					scope.zoomEndAt = new Date(new Date(scope.zoomEndAt).getTime() + timeDiff);
				}

			}

			function actionButtonUseOperationStartDate(startDate) {

				if (scope.inputRangeForm.useOperationStartDate) {
					scope.inputRangeForm.startTime = new Date(startDate);
					scope.inputRangeForm.startTime.setMilliseconds(0);
					scope.inputRangeForm.startTime.setSeconds(0);
				}

			}

			function actionButtonSubmitDmecRange() {
				localStorage.setItem('dmecTrackingInputRangeForm', JSON.stringify(scope.inputRangeForm) );
				initializeComponent();
			}

			function getTick() {

				var now = new Date().getTime();
				scope.dmecTrackingEndAt = now;
				moveZoomRealtime(scope.dmecTrackingEndAt);

				scope.onReading = new Promise(function (resolve, reject) {
					readingSetupAPIService.getTick((now - updateLatency), resolve, reject);
				});

			}

			function getAllReadingSince(startTime) {

				startTime = new Date(startTime);
				var operationStartDate = new Date(scope.operationData.operationContext.currentOperation.startDate);

				if (startTime.getTime() < operationStartDate.getTime()) {
					startTime = operationStartDate;
				}

				readingSetupAPIService.getAllReadingSince(startTime.getTime(), setReadings);

				return startTime;
			}

			function setReadings(readings) {
				scope.readings = readings || [];
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

				if(inputRangeForm && inputRangeForm.startTime){
					inputRangeForm.startTime = new Date(inputRangeForm.startTime);
				}

				return inputRangeForm;
			}


		}
	}
})();