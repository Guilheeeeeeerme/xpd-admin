(function () {
	'use strict';

	angular.module('xpd.admin').directive('dmecTracking', dmecTrackingDirective);

	dmecTrackingDirective.$inject = ['readingSetupAPIService', '$timeout'];

	function dmecTrackingDirective(readingSetupAPIService, $timeout) {
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

			/**
			 * Util para não precisar ficar calculando esse inferno
			 */
			var ONE_DAY = (1 * 24 * 3600000);
			var now = new Date().getTime();

			scope.zoomEndAt = new Date( now ); 
			scope.zoomStartAt = new Date( now - ONE_DAY / 24 );

			var reloadTimeout = null;
			scope.getAllReadingSince = getAllReadingSince;
			scope.onEndAtChange = onEndAtChange;
			scope.showDrillingMecChart = true;
			scope.actionButtonUseOperationStartDate = actionButtonUseOperationStartDate;

			var inputRangeForm;

			try{
				inputRangeForm = JSON.parse(localStorage.getItem('dmecTrackingInputRangeForm'));
			}catch(e){
				inputRangeForm = null;
			}

			if(!inputRangeForm){
				inputRangeForm = {
					realtime: true,
					last: 1,
					toMilliseconds: '3600000',
				}
			}

			scope.inputRangeForm = inputRangeForm;

			function actionButtonUseOperationStartDate(startDate){
				if(scope.inputRangeForm.useOperationStartDate){
					scope.inputRangeForm.startTime = new Date(startDate);
					scope.inputRangeForm.startTime.setMilliseconds(0);
					scope.inputRangeForm.startTime.setSeconds(0);
				}
			}

			/**
			 * Quando 'showDrillingMecChart' é true a diretiva aparece
			 * o ng-init na diretiva dispara o 'getAllReadingSince'
			 * com o start date da operação
			 */
			function getAllReadingSince(startTime) {

				startTime = new Date(startTime);

				if (reloadTimeout) {
					clearTimeout(reloadTimeout);
				}

				reloadTimeout = $timeout(function () {
					scope.showDrillingMecChart = false;

					$timeout(function () {
						scope.showDrillingMecChart = true;
					}, 5000);

				}, ONE_DAY / 2);


				readingSetupAPIService.getAllReadingSince(startTime.getTime(), function (readings) {
					scope.readings = readings;
				});
			}

			/**
			 * Toda vez que o DMEC avança por causa do tempo real
			 * @param {Date} milliseconds 
			 */
			function onEndAtChange(milliseconds) {
				scope.endAt = milliseconds;
			}

		}
	}
})();