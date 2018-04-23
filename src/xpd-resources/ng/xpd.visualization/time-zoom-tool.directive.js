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
			scope.startPipeSelected = false;
			scope.endPipePositionSelected = false;

			var isHorizontal = scope.horizontal = (attrs.horizontal == true || attrs.horizontal == 'true');

			d3Service.d3().then(d3Done);

			function d3Done(d3) {

				var selectedElementId = null;
				var selectedElement = null;
				var overlay = null;
				var startNavigatorElement = d3.select('#start-navigator');
				var endNavigatorElement = d3.select('#end-navigator');
				var startTimestamp = null;
				var endTimestamp = null;

				scope.$watch('startAt', onDateRangeChange);
				scope.$watch('endAt', onDateRangeChange);

				startNavigatorElement.on('mousedown', mouseDown);
				startNavigatorElement.on('mouseup', mouseUp);

				endNavigatorElement.on('mousedown', mouseDown);
				endNavigatorElement.on('mouseup', mouseUp);

				function mouseDown() {
					selectedElement = d3.select(this);
					selectedElementId = d3.select(this).attr('id');

					selectedElement.classed('active', true);

					overlay = d3.select('.overlay')
						.on('mousemove', mouseMove)
						.on('mouseup', mouseUp);
				}

				function mouseMove() {
					if (selectedElementId == 'start-navigator') {
						scope.startPipePosition = d3.mouse(this)[0];
						startTimestamp = scope.timeScale.invert(d3.mouse(this)[1]);
					} else {
						scope.endPipePosition = d3.mouse(this)[0];
						endTimestamp = scope.timeScale.invert(d3.mouse(this)[1]);
					}
				}

				function mouseUp() {
										
					if (selectedElementId == 'start-navigator') {
						scope.zoomStartAt = startTimestamp;
					} else {
						scope.zoomEndAt = endTimestamp;
					}



					selectedElement.classed('active', false);
					overlay.on('mousemove', null).on('mouseup', null);
				}

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
						console.log(scope.xTicks)

						scope.endPipePosition = scope.timeScale(new Date(endAt));
						scope.startPipePosition = scope.timeScale(new Date(endAt) - 2000000 );

					} catch (e) {
						console.error(e);
					}
				}
			}

		}

	}

})();