(function () {
	'use strict';

	angular.module('xpd.visualization').directive('dmecTracking', dmecTrackingDirective);

	dmecTrackingDirective.$inject = ['dmecService'];

	function dmecTrackingDirective(dmecService) {
		return {
			scope: {
				connectionEvents: '=',
				tripEvents: '=',
				timeEvents: '=',
				currentOperation: '=',
				currentEvent: '=',
				currentTick: '=',
				currentBlockPosition: '=',
				currentReading: '=',
				selectedTimestamp: '='
			},
			restrict: 'AE',
			templateUrl: '../xpd-resources/ng/xpd.visualization/dmec-tracking.template.html',
			link: link
		};

		function link(scope) {

			scope.getReadingTimestamp = getReadingTimestamp;

			dmecService.dmec(scope, 
				'xpd.admin.dmec.dmecInputRangeForm',
				function () {
					return scope.currentOperation;
				},
				function () {
					return scope.currentReading;
				}
			);

			function getReadingTimestamp(timestamp) {
				scope.selectedTimestamp(timestamp);
			}
		}

	}

})();