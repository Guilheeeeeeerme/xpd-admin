(function () {
	'use strict';

	angular.module('xpd.visualization')
		.directive('memberPerformance', memberPerformance);

	memberPerformance.$inject = ['d3Service'];

	function memberPerformance(d3Service) {
		return {
			templateUrl: '../xpd-resources/ng/xpd.visualization/member-performance.template.html',
			restrict: 'A',
			scope: {
				member: '=',
			},
			link: link
		};

		function link(scope, element, attrs) {
			/*scope.svg = {
             height: element[0].clientHeight,
             width: element[0].offsetWidth
             };*/
			element[0].className = element[0].className + ' member-perfomance-container';

			var verticalPadding = parseFloat(window.getComputedStyle(element[0]).paddingTop) + parseFloat(window.getComputedStyle(element[0]).paddingBottom);

			scope.svg = {
				height: element[0].offsetHeight - verticalPadding,
				width: element[0].clientWidth
			};

			scope.svg.viewBoxHeight = (scope.svg.height * 192) / scope.svg.width;
			scope.svg.viewBox = '0 0 192 ' + scope.svg.viewBoxHeight;

		}
	}
})();