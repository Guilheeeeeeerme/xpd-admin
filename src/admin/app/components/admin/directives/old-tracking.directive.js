(function () {
	'use strict';

	angular.module('xpd.admin').directive('oldTracking', oldTracking);

	function oldTracking() {
		return {
			scope: {},
			controller: 'TrackingController',
			controllerAs: 'atController',
			restrict: 'AE',
			templateUrl: 'app/components/admin/directives/old-tracking.template.html',
			link: link
		};

		function link(scope, element, attrs) {

		}
	}
})();