(function () {
	'use strict';

	angular.module('xpd.visualization')
		.directive('performanceParameterBar', performanceParameterBar);

	performanceParameterBar.$inject = ['d3Service'];

	function performanceParameterBar(d3Service) {
		return {
			templateUrl: '../xpd-resources/ng/xpd.visualization/performance-parameter-bar.template.html',
			restrict: 'A',
			scope: {
				color: '@',
				title: '@'
			},
			link: link
		};

		function link(scope, element, attrs) {
		}
	}
})();