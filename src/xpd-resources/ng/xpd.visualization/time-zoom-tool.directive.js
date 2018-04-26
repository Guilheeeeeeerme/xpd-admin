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
				bitDepthList: '=',
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
				var clickedPosition;
				var clickedPositionStartx;
				var clickedPositionEndx;

				scope.$watch('startAt', onDateRangeChange);
				scope.$watch('endAt', onDateRangeChange);

				scope.$watch('zoomStartAt', moveZoomElement);
				scope.$watch('zoomEndAt', moveZoomElement);

				getZoomAreaElement().on('mousedown', mouseDown);
				getZoomAreaElement().on('mouseup', mouseUp);

				getStartZoomElement().on('mousedown', mouseDown);
				getStartZoomElement().on('mouseup', mouseUp);

				getEndZoomElement().on('mousedown', mouseDown);
				getEndZoomElement().on('mouseup', mouseUp);

				getOverlayElement().on('dblclick', dblclick);

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

					// getElementById('start-date-navigator').attr('transform', 'translate( ' + scope.timeScale(zoomStartAt) + ', -5 )');

					getStartZoomElement().attr('transform', 'translate( ' + scope.timeScale(zoomStartAt) + ', 0 )');
					getEndZoomElement().attr('transform', 'translate( ' + scope.timeScale(zoomEndAt) + ', 0 )');

					moveZoomArea();

				}

				function mouseDown() {

					clickedPosition = d3.mouse(this)[0];
					selectedElement = d3.select(this);
					selectedElementId = d3.select(this).attr('id');

					var startt = d3.transform(getStartZoomElement().attr('transform'));
					clickedPositionStartx = startt.translate[0];

					var endt = d3.transform(getEndZoomElement().attr('transform'));
					clickedPositionEndx = endt.translate[0];

					selectedElement.classed('active', true);

					getOverlayElement()
						.on('mousemove', mouseMove)
						.on('mouseup', mouseUp);
					getZoomAreaElement()
						.on('mousemove', mouseMove)
						.on('mouseup', mouseUp);
				}

				function mouseMove() {

					if (selectedElementId == 'start-navigator') {
						scope.startPipePosition = d3.mouse(this)[0];
						getStartZoomElement().attr('transform', 'translate( ' + d3.mouse(this)[0] + ', 0 )');
						// getElementById('start-date-navigator').attr('transform', 'translate( ' + d3.mouse(this)[0] + ', 10 )');
					} else if (selectedElementId == 'end-navigator') {
						scope.endPipePosition = d3.mouse(this)[0];
						getEndZoomElement().attr('transform', 'translate( ' + d3.mouse(this)[0] + ', 0 )');
					} else {
						var diff = d3.mouse(this)[0] - clickedPosition;
						getStartZoomElement().attr('transform', 'translate( ' + (clickedPositionStartx + diff) + ', 0 )');
						getEndZoomElement().attr('transform', 'translate( ' + (clickedPositionEndx + diff) + ', 0 )');
					}

					moveZoomArea();

				}

				function moveZoomArea() {

					var zoomArea = getZoomAreaElement();

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
					getOverlayElement().on('mousemove', null).on('mouseup', null);
					getZoomAreaElement().on('mousemove', null).on('mouseup', null);
					selectedElement = null;

					moveZoomElement();
				}

				function dblclick() {

					var currentPosition = d3.mouse(this)[0];
					scope.mindate = scope.timeScale.invert(d3.mouse(this)[0] - 40);
					scope.maxdate = scope.timeScale.invert(d3.mouse(this)[0] + 40);

					scope.zoomStartAt = scope.mindate;
					scope.zoomEndAt = scope.maxdate;
				}

				function onDateRangeChange(newDate, oldDate) {
					resize();
					moveZoomElement();
				}

				function getOverlayElement() {
					return d3.select(scope.element).selectAll('.overlay');
				}

				// function getElementById(id) {
				// 	return d3.select(scope.element).selectAll('#' + id);
				// }

				function getStartZoomElement() {
					return d3.select(scope.element).selectAll('#start-navigator');
				}

				function getEndZoomElement() {
					return d3.select(scope.element).selectAll('#end-navigator');
				}

				function getZoomAreaElement() {
					return d3.select(scope.element).selectAll('#zoom-area');
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

						scope.xTicks = scope.timeScale.ticks(6);

						var minDepth = 0;
						var maxDepth = 0;

						var bitDepthList = scope.bitDepthList || [];

						for (var i in bitDepthList) {
							if (bitDepthList[i].y != null) {
								if (bitDepthList[i].y > maxDepth) {
									maxDepth = bitDepthList[i].y;
								}
								if (bitDepthList[i].y < minDepth) {
									minDepth = bitDepthList[i].y;
								}
							}
						}

						var depthScale = d3.scale.linear()
							.domain([minDepth, maxDepth])
							.range([
								0,
								viewHeight
							]);

						var lineFunction = d3.svg.line()
							// .defined(function (d) {				
							// 	return (angular.isNumber(d.y) && angular.isNumber(d.x));
							// })
							.x(function (d) {
								return scope.timeScale(d.x);
							})
							.y(function (d) {
								if (d.y == null)
									return depthScale(maxDepth);
								return depthScale(d.y);
							})
							.interpolate('linear');

						var d = lineFunction(bitDepthList);

						d3.select(scope.element)
							.selectAll('#bit-depth-path')
							.attr('d', d);


					} catch (e) {
						console.error(e);
					}
				}
			}

		}

	}

})();