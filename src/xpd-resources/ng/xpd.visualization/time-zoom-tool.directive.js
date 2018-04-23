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

			d3Service.d3().then(d3Done);

			function d3Done(d3) {

				var selectedElement;
				var selectedElementId;
				var overlay;

				scope.$watch('startAt', onDateRangeChange);
				scope.$watch('endAt', onDateRangeChange);

				scope.$watch('zoomStartAt', moveZoomElement);
				scope.$watch('zoomEndAt', moveZoomElement);

				getStartZoomElement().on('mousedown', mouseDown);
				getStartZoomElement().on('mouseup', mouseUp);

				getEndZoomElement().on('mousedown', mouseDown);
				getEndZoomElement().on('mouseup', mouseUp);

				function moveZoomElement() {

					if (selectedElement) {
						return;
					}

					var now = new Date();
					var zoomStartAt = now;
					var zoomEndAt = now;

					if (scope.zoomStartAt) {
						zoomStartAt = new Date(scope.zoomStartAt);
					}

					if (scope.zoomEndAt) {
						zoomEndAt = new Date(scope.zoomEndAt);
					}

					zoomStartAt = new Date(Math.min(zoomStartAt.getTime(), zoomEndAt.getTime()));
					zoomEndAt = new Date(Math.max(zoomStartAt.getTime(), zoomEndAt.getTime()));

					getStartZoomElement().attr('transform', 'translate( ' + scope.timeScale(zoomStartAt) + ', 0 )');
					getEndZoomElement().attr('transform', 'translate( ' + scope.timeScale(zoomEndAt) + ', 0 )');

					moveZoomArea();

				}

				function mouseDown() {

					selectedElement = d3.select(this);
					selectedElementId = d3.select(this).attr('id');

					selectedElement.classed('active', true);

					overlay = d3.select(scope.element).selectAll('.overlay')
						.on('mousemove', mouseMove)
						.on('mouseup', mouseUp);
				}

				function mouseMove() {

					if (selectedElementId == 'start-navigator') {
						scope.startPipePosition = d3.mouse(this)[0];
						getStartZoomElement().attr('transform', 'translate( ' + d3.mouse(this)[0] + ', 0 )');
					} else {
						scope.endPipePosition = d3.mouse(this)[0];
						getEndZoomElement().attr('transform', 'translate( ' + d3.mouse(this)[0] + ', 0 )');
					}

					moveZoomArea();
				}

				function moveZoomArea() {

					var zoomArea = d3.select(scope.element).selectAll('#zoom-area');

					var startt = d3.transform(getStartZoomElement().attr('transform')),
						startx = startt.translate[0];

					var endt = d3.transform(getEndZoomElement().attr('transform')),
						endx = endt.translate[0];

					zoomArea.attr('x', Math.min(startx, endx));
					zoomArea.attr('width', Math.abs(startx - endx));

				}

				function mouseUp() {

					var startt = d3.transform(getStartZoomElement().attr('transform')),
						startx = scope.timeScale.invert(startt.translate[0]);

					var endt = d3.transform(getEndZoomElement().attr('transform')),
						endx = scope.timeScale.invert(endt.translate[0]);

					scope.zoomStartAt = new Date(Math.min(endx, startx));
					scope.zoomEndAt = new Date(Math.max(endx, startx));

					selectedElement.classed('active', false);
					overlay.on('mousemove', null).on('mouseup', null);
					selectedElement = null;

					moveZoomElement();
				}

				function onDateRangeChange(newDate, oldDate) {
					resize();
					moveZoomElement();
				}



				function getStartZoomElement() {
					var startZoomElement = d3.select(scope.element).selectAll('#start-navigator');
					return startZoomElement;
				}

				function getEndZoomElement() {
					var endZoomElement = d3.select(scope.element).selectAll('#end-navigator');
					return endZoomElement;
				}


				function resize() {

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
								viewWidth * 0.95
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