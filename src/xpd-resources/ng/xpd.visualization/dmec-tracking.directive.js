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
				selectedPoint: '=',
				lastSelectedPoint: '=',
				removeMarker: '='
			},
			restrict: 'AE',
			templateUrl: '../xpd-resources/ng/xpd.visualization/dmec-tracking.template.html',
			link: link
		};

		function link(scope) {

			scope.getSelectedPoint = getSelectedPoint;

			dmecService.dmec(scope, 
				'xpd.admin.dmec.dmecInputRangeForm',
				function () {
					return scope.currentOperation;
				},
				function () {
					return scope.currentReading;
				}
			);

			function getSelectedPoint(position) {
				scope.selectedPoint(position);
			}
		}

	}

})();