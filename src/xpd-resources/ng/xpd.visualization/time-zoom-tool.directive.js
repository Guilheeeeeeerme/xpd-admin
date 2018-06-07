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
				bitDepthPoints: '=',
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

				var clickedElement;
				var clickedElementId;
				var firstClickPosition;
				var startNavigatorInitialPosition;
				var endNavigatorInitialPosition;

				scope.getBitDepth = getBitDepth;

				scope.$watch('zoomStartAt', onZoomStartAt);
				scope.$watch('zoomEndAt', onZoomEndAt);

				getZoomAreaElement().on('mousedown', mouseDown);
				getZoomAreaElement().on('mouseup', mouseUp);

				getStartZoomElement().on('mousedown', mouseDown);
				getStartZoomElement().on('mouseup', mouseUp);

				getEndZoomElement().on('mousedown', mouseDown);
				getEndZoomElement().on('mouseup', mouseUp);

				getOverlayElement().on('dblclick', dblclick);

				scope.$watch('bitDepthPoints', drawBitDepthPoints, true);

				buildTimeAxis();

				function mouseDown() {
					//console.log('mouseDown');

					firstClickPosition = d3.mouse(this)[0];

					clickedElement = d3.select(this);
					clickedElementId = d3.select(this).attr('id');

					var startt = d3.transform(getStartZoomElementTransform());
					startNavigatorInitialPosition = startt.translate[0];

					var endt = d3.transform(getEndZoomElementTransform());
					endNavigatorInitialPosition = endt.translate[0];

					clickedElement.classed('active', true);

					getOverlayElement().on('mousemove', mouseMove).on('mouseup', mouseUp);
					getZoomAreaElement().on('mousemove', mouseMove).on('mouseup', mouseUp);
				}

				function onZoomStartAt(zoom) {
					// console.log('onZoomStartAt');

					if (!zoom || clickedElement) {
						return;
					}

					moveZoomElement();

				}

				function onZoomEndAt(zoom) {
					// console.log('onZoomEndAt');

					if (!zoom || clickedElement) {
						return;
					}

					moveZoomElement();

				}

				function moveZoomElement() {
					//console.log('moveZoomElement');

					if (clickedElement) {
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

				function mouseMove() {
					//console.log('mouseMove');

					var mousePosition = d3.mouse(this)[0];

					if (clickedElementId == 'start-navigator') {
						scope.startPipePosition = mousePosition;
						setStartZoomElementTransformTranslate(mousePosition, 0);
					} else if (clickedElementId == 'end-navigator') {
						scope.endPipePosition = mousePosition;
						setEndZoomElementTransformTranslate(mousePosition, 0);
					} else {
						var zoomAreaDisplacement = mousePosition - firstClickPosition;
						setStartZoomElementTransformTranslate((startNavigatorInitialPosition + zoomAreaDisplacement), 0);
						setEndZoomElementTransformTranslate((endNavigatorInitialPosition + zoomAreaDisplacement), 0);
					}

					moveZoomArea();

				}

				function moveZoomArea() {
					//console.log('moveZoomArea');

					var zoomArea = getZoomAreaElement();

					var startt = d3.transform(getStartZoomElementTransform()),
						startx = startt.translate[0];

					var endt = d3.transform(getEndZoomElementTransform()),
						endx = endt.translate[0];

					zoomArea.attr('x', Math.min(startx, endx));
					zoomArea.attr('width', Math.abs(startx - endx));

				}

				function mouseUp() {
					//console.log('mouseUp');

					var startt = d3.transform(getStartZoomElementTransform()),
						startNavigatorFinalPosition = scope.timeScale.invert(startt.translate[0]);

					var endt = d3.transform(getEndZoomElementTransform()),
						endNavigatorFinalPostion = scope.timeScale.invert(endt.translate[0]);

					scope.setZoomStartAt(new Date(Math.min(endNavigatorFinalPostion, startNavigatorFinalPosition)));
					scope.setZoomEndAt(new Date(Math.max(endNavigatorFinalPostion, startNavigatorFinalPosition)));

					clickedElement.classed('active', false);

					getOverlayElement().on('mousemove', null).on('mouseup', null);
					getZoomAreaElement().on('mousemove', null).on('mouseup', null);

					clickedElement = null;

				}

				function dblclick() {
					//console.log('dblclick');

					var mouseXPosition = d3.mouse(this)[0];

					scope.mindate = scope.timeScale.invert(mouseXPosition - 40);
					scope.maxdate = scope.timeScale.invert(mouseXPosition + 40);

					scope.setZoomStartAt(scope.mindate);
					scope.setZoomEndAt(scope.maxdate);
				}

				function getOverlayElement() {
					//console.log('getOverlayElement');
					return d3.select(scope.element).selectAll('.overlay');
				}

				function setStartZoomElementTransformTranslate(x, y) {
					//console.log('setStartZoomElementTransformTranslate');
					getStartZoomElement().attr('transform', 'translate(' + x + ', ' + y + ')');
					getStartZoomTextElement().attr('transform', 'translate(' + x + ', ' + y + ')');
					getStartZoomTextElement().text($filter('date')(scope.timeScale.invert(x), 'short'));
				}

				function setEndZoomElementTransformTranslate(x, y) {
					//console.log('setEndZoomElementTransformTranslate');
					getEndZoomElement().attr('transform', 'translate(' + x + ', ' + y + ')');
					getEndZoomTextElement().attr('transform', 'translate(' + x + ', ' + y + ')');
					getEndZoomTextElement().text($filter('date')(scope.timeScale.invert(x), 'short'));
				}

				function getEndZoomElementTransform() {
					//console.log('getEndZoomElementTransform');
					return getEndZoomElement().attr('transform');
				}

				function getStartZoomElementTransform() {
					//console.log('getStartZoomElementTransform');
					return getStartZoomElement().attr('transform');
				}

				function getStartZoomTextElement() {
					//console.log('getStartZoomTextElement');
					return d3.select(scope.element).selectAll('#start-navigator-text');
				}

				function getEndZoomTextElement() {
					//console.log('getEndZoomTextElement');
					return d3.select(scope.element).selectAll('#end-navigator-text');
				}

				function getStartZoomElement() {
					//console.log('getStartZoomElement');
					return d3.select(scope.element).selectAll('#start-navigator');
				}

				function getEndZoomElement() {
					//console.log('getEndZoomElement');
					return d3.select(scope.element).selectAll('#end-navigator');
				}

				function getZoomAreaElement() {
					//console.log('getZoomAreaElement');
					return d3.select(scope.element).selectAll('#zoom-area');
				}

				function buildTimeAxis() {
					//console.log('buildTimeAxis');

					if (clickedElement) {
						return;
					}

					try {

						var zoomStartAt = new Date(scope.zoomStartAt);
						var zoomEndAt = new Date(scope.zoomEndAt);

						var diff = Math.abs(zoomEndAt.getTime() - zoomStartAt.getTime()) / 2;

						var startAt = new Date(zoomStartAt.getTime() - diff);
						var endAt = new Date(zoomEndAt.getTime() + diff);

						var viewWidth = scope.element.clientWidth;
						var viewHeight = scope.element.offsetHeight;

						scope.timeScale = d3.time.scale()
							.domain([
								startAt,
								endAt,
							])
							.range([
								0,
								viewWidth
							]);

						scope.svg = {
							viewWidth: viewWidth,
							viewHeight: viewHeight
						};

						scope.xTicks = scope.timeScale.ticks();

						drawBitDepthPoints();

					} catch (e) {
						console.error(e);
					}
				}

				function getBitDepth(tick) {
					tick = new Date(tick).getTime();
					return (scope.bitDepthIndex && scope.bitDepthIndex[tick]) ? scope.bitDepthIndex[tick] : null;
				}

				function drawBitDepthPoints() {
					//console.log('drawBitDepthPoints');

					try {

						var bitDepthPoints = angular.copy(scope.bitDepthPoints) || [];

						if (bitDepthPoints.length > 0) {

							bitDepthPoints.unshift({
								x: bitDepthPoints[0].x,
								y: scope.maxDepth
							});

							bitDepthPoints.push({
								x: bitDepthPoints[bitDepthPoints.length - 1].x,
								y: scope.maxDepth
							});

						}

						var depthScale = d3.scale.linear()
							.domain([scope.minDepth, scope.maxDepth])
							.range([
								0,
								scope.svg.viewHeight
							]);

						var lineFunction = d3.svg.line()
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

						var index = 0;

						scope.xTicks.map(function (tick) {

							tick = new Date(tick).getTime();

							if (!scope.bitDepthIndex) {
								scope.bitDepthIndex = {};
							}

							if (!scope.bitDepthIndex[tick]) {

								for (; index < bitDepthPoints.length; index++) {

									var point = bitDepthPoints[index];

									if (tick < point.x) {
										break;
									}

									scope.bitDepthIndex[tick] = point.y;
								}

							}

						});

					} catch (e) {
						console.error(e);
					}
				}

			}

		}

	}

})();