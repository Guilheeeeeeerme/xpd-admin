(function () {
	'use strict';

	var module = angular.module('xpd.visualization');

	module.directive('timeZoomTool', timeZoomTool);

	timeZoomTool.$inject = ['d3Service'];

	function timeZoomTool(d3Service) {
		return {
			restrict: 'E',
			templateUrl: '../xpd-resources/ng/xpd.visualization/time-zoom-tool.template.html',
			scope: {
				startAt: '=',
				endAt: '=',
				zoomStartAt: '=',
				zoomEndAt: '=',
			},
			link: link
		};

		function link(scope, element, attrs) {

			scope.element = element[0];

			var isHorizontal = scope.horizontal = (attrs.horizontal == true || attrs.horizontal == 'true');

			d3Service.d3().then(d3Done);

			function d3Done(d3) {

				scope.$watch('startAt', onDateRangeChange);
				scope.$watch('endAt', onDateRangeChange);

				function onDateRangeChange(newDate, oldDate) {
					resize(isHorizontal);
				}

				function resize(horizontal) {

					try {

						var startAt = new Date(scope.startAt);
						var endAt = new Date(scope.endAt);

						var viewWidth = scope.element.clientWidth;
						var viewHeight = scope.element.offsetHeight;

						scope.timeScale = d3.time.scale()
							.domain([
								startAt,
								endAt,
							])
							.range([
								0,
								horizontal ? (viewWidth * 0.95 ) : ( viewHeight * 0.95 )
							]);

						scope.svg = {
							viewWidth: viewWidth,
							viewHeight: viewHeight
						};

						scope.xTicks = scope.timeScale.ticks();

					} catch (e) {
						console.error(e);
					}
				}
			}

		}

	}

})();