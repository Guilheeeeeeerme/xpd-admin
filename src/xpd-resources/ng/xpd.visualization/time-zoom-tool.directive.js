(function () {
	'use strict';

	var module = angular.module('xpd.visualization');

	module.directive('timeZoomTool', timeZoomTool);

	timeZoomTool.$inject = ['$timeout', '$interval', '$filter', 'd3Service'];

	function timeZoomTool($timeout, $interval, $filter, d3Service) {
		return {
			restrict: 'E',
			templateUrl: '../xpd-resources/ng/xpd.visualization/time-zoom-tool.template.html',
			scope: {
				isZoomingCallback: '=',
				bitDepthPoints: '=',
				startAt: '=',
				endAt: '=',
				zoomStartAt: '=',
				zoomEndAt: '=',
				setZoomStartAt: '=',
				setZoomEndAt: '=',
				minDepth: '=',
				maxDepth: '=',
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
				
				buildTimeAxis();

				// var resizeInterval = $interval(buildTimeAxis, 1000);

				// scope.$on('$destroy', function() {
				// 	if (resizeInterval) {
				// 		$interval.cancel(resizeInterval);
				// 	}
				// });

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

					setStartZoomElementTransformTranslate(scope.timeScale(zoomStartAt), 0);
					setEndZoomElementTransformTranslate(scope.timeScale(zoomEndAt), 0);

					moveZoomArea();

				}

				function mouseDown() {

					try {
						scope.isZoomingCallback(true);
					} catch (e) {
						// faça nada
					}

					clickedPosition = d3.mouse(this)[0];
					selectedElement = d3.select(this);
					selectedElementId = d3.select(this).attr('id');

					var startt = d3.transform(getStartZoomElementTransform());
					clickedPositionStartx = startt.translate[0];

					var endt = d3.transform(getEndZoomElementTransform());
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
						setStartZoomElementTransformTranslate(d3.mouse(this)[0], 0);
					} else if (selectedElementId == 'end-navigator') {
						scope.endPipePosition = d3.mouse(this)[0];
						setEndZoomElementTransformTranslate(d3.mouse(this)[0], 0);
					} else {
						var diff = d3.mouse(this)[0] - clickedPosition;
						setStartZoomElementTransformTranslate((clickedPositionStartx + diff), 0);
						setEndZoomElementTransformTranslate((clickedPositionEndx + diff), 0);
					}

					moveZoomArea();

				}

				function moveZoomArea() {

					var zoomArea = getZoomAreaElement();

					var startt = d3.transform(getStartZoomElementTransform()),
						startx = startt.translate[0];

					var endt = d3.transform(getEndZoomElementTransform()),
						endx = endt.translate[0];

					zoomArea.attr('x', Math.min(startx, endx));
					zoomArea.attr('width', Math.abs(startx - endx));

				}

				function mouseUp() {

					try {
						$timeout(scope.isZoomingCallback, 1000, false);
					} catch (e) {
						// faça nada
					}

					var startt = d3.transform(getStartZoomElementTransform()),
						startx = scope.timeScale.invert(startt.translate[0]);

					var endt = d3.transform(getEndZoomElementTransform()),
						endx = scope.timeScale.invert(endt.translate[0]);

					scope.setZoomStartAt(new Date(Math.min(endx, startx)));
					scope.setZoomEndAt(new Date(Math.max(endx, startx)));

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

					scope.setZoomStartAt(scope.mindate);
					scope.setZoomEndAt(scope.maxdate);
				}

				function onDateRangeChange(newDate, oldDate) {
					moveZoomElement();
				}

				function getOverlayElement() {
					return d3.select(scope.element).selectAll('.overlay');
				}

				function setStartZoomElementTransformTranslate(x, y) {
					getStartZoomElement().attr('transform', 'translate(' + x + ', ' + y + ')');
					getStartZoomTextElement().attr('transform', 'translate(' + x + ', ' + y + ')');
					getStartZoomTextElement().text($filter('date')(scope.timeScale.invert(x), 'short'));
				}

				function setEndZoomElementTransformTranslate(x, y) {
					getEndZoomElement().attr('transform', 'translate(' + x + ', ' + y + ')');
					getEndZoomTextElement().attr('transform', 'translate(' + x + ', ' + y + ')');
					getEndZoomTextElement().text($filter('date')(scope.timeScale.invert(x), 'short'));
				}

				function getEndZoomElementTransform() {
					return getEndZoomElement().attr('transform');
				}

				function getStartZoomElementTransform() {
					return getStartZoomElement().attr('transform');
				}

				function getStartZoomTextElement() {
					return d3.select(scope.element).selectAll('#start-navigator-text');
				}

				function getEndZoomTextElement() {
					return d3.select(scope.element).selectAll('#end-navigator-text');
				}

				function getStartZoomElement() {
					return d3.select(scope.element).selectAll('#start-navigator');
				}

				function getEndZoomElement() {
					return d3.select(scope.element).selectAll('#end-navigator');
				}

				function getZoomAreaElement() {
					return d3.select(scope.element).selectAll('#zoom-area');
				}


				function buildTimeAxis() {

					if (selectedElement) {
						return;
					}

					try {

						var startAt = new Date(scope.startAt);
						var endAt = new Date(scope.endAt);

						var zoomStartAt = new Date(scope.zoomStartAt);
						var zoomEndAt = new Date(scope.zoomEndAt);

						var startDiff = Math.abs( zoomStartAt.getTime() - startAt.getTime() ) / 2;
						var endDiff = Math.abs( zoomEndAt.getTime() - endAt.getTime() ) / 2;

						// if ( startAt.getTime() < ( zoomStartAt.getTime() - startDiff ) ){
						startAt = new Date( zoomStartAt.getTime() - startDiff );
						// }
						
						// if ( endAt.getTime() > ( zoomEndAt.getTime() + endDiff ) ){
						endAt = new Date( zoomEndAt.getTime() + endDiff );
						// }

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

						var bitDepthPoints = angular.copy(scope.bitDepthPoints) || [];

						if(bitDepthPoints.length > 0) {
							bitDepthPoints.unshift({
								x:bitDepthPoints[0].x,
								y: scope.maxDepth
							});

							bitDepthPoints.push({
								x: bitDepthPoints[bitDepthPoints.length-1].x,
								y: scope.maxDepth
							});
						}

						var depthScale = d3.scale.linear()
							.domain([scope.minDepth, scope.maxDepth])
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
									return depthScale(scope.maxDepth);
								return depthScale(d.y);
							})
							.interpolate('linear');

						var d = lineFunction(bitDepthPoints);

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