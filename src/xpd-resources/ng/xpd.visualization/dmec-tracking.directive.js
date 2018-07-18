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

			scope.setSelectedPoint = setSelectedPoint;

			dmecService.dmec(scope, 
				'xpd.admin.dmec.dmecInputRangeForm',
				function () {
					return scope.currentOperation;
				},
				function () {
					return scope.currentReading;
				}
			);

			function setSelectedPoint(position) {
				scope.selectedPoint(position);
			}
		}

	}

})();