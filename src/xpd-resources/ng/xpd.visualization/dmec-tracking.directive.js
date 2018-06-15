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
				currentReading: '='
			},
			restrict: 'AE',
			templateUrl: '../xpd-resources/ng/xpd.visualization/dmec-tracking.template.html',
			link: link
		};

		function link(scope) {
			dmecService.dmec(scope, 
				'xpd.admin.dmec.dmecInputRangeForm',
				function () {
					return scope.currentOperation;
				},
				function () {
					return scope.currentReading;
				}
			);
		}

	}

})();