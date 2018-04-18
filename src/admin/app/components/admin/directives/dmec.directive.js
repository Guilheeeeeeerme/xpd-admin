(function () {
	'use strict';

	angular.module('xpd.admin').directive('dmec', dmec);

	function dmec() {
		return {
			scope: {
				connectionTimes: '=',
				tripTimes: '='
			},
			controller: 'TrackingController',
			controllerAs: 'atController',
			restrict: 'AE',
			templateUrl: 'app/components/admin/directives/dmec.template.html',
			link: link
		};

		function link(scope, element, attrs) {

		}
	}
})();