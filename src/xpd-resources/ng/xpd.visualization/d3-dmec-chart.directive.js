(function () {
	'use strict';

	angular.module('xpd.visualization')
		.directive('d3DmecChart', d3DmecChart);

	d3DmecChart.$inject = ['highchartsService', 'd3Service'];

	function d3DmecChart(highchartsService, d3Service) {
		return {
			restrict: 'E',
			templateUrl: '../xpd-resources/ng/xpd.visualization/d3-dmec-chart.template.html',
			scope: {
				startTime: '=',
				threshold: '=',
				oldPoints: '=',
				newPoints: '=',
				tracks: '=',
				autoScroll: '='
			},
			link: link
		};

		function link(scope, element, attrs) {

			var d3 = null;
			var bisect = null;
			var colorScale = null;
			var height = null;
			var timeScale = null;
			var format = null;
			var startTime = null;
			var endTime = null;
			var threads = attrs.threads = Number(attrs.threads) || 4;
			var viewWidth = element[0].clientWidth;
			var viewHeight = element[0].offsetHeight;

			scope.trackXPosition = trackXPosition;
			scope.handleOverflow = handleOverflow;
			scope.listenToMouseMove = listenToMouseMove;

			setInterval(scrollIfNeeded, 1000);

			d3Service.d3().then(d3Done);

			function d3Done(_d3) {
				d3 = _d3;
				colorScale = d3.scale.category10();
				bisect = d3.bisector(function (datum) { return datum.x; }).right;
				format = d3.format('.1f');

				scope.$watch('tracks', onTracksChange, true);
				scope.$watch('threshold', onThresholdChange);
			}

			function onTracksChange() {
				scope.dmecTracks = angular.copy(scope.tracks);
				buildXAxis(+scope.threshold);
				buildYAxis();
			}

			function onThresholdChange() {
				try {
					buildXAxis(+scope.threshold);
					buildYAxis();
				} catch (e) {
					console.error(e);
				}
			}

			function applyOverflow(trackName) {

				scope.$tracks.map(function (track) {

					if (!scope['$' + trackName]) {
						scope['$' + trackName] = {};
					}
					if (!scope['$' + trackName + 'Path']) {
						scope['$' + trackName + 'Path'] = {};
					}

					if (scope[trackName] && scope[trackName][track.param]) {
						scope['$' + trackName][track.param] = handleOverflow(scope[trackName][track.param], track);
						scope['$' + trackName + 'Path'][track.param] = track.lineFunction(scope['$' + trackName][track.param]);
					}

				});
			}

			function handleOverflow(points, track) {

				let result = [];
				let distance = 0;
				let lastPoint = null;

				while ((track.min + distance) <= track.max) {
					distance++;
				}

				points.map(function (pt) {

					const point = angular.copy(pt);

					const empty = {
						x: point.x,
						y: null,
						actual: null
					};

					point.overflow = 0;

					if (point.y != null) {

						for (let i = 0; i < 2; i++) {

							if (point.y < track.min) {

								while (point.y < track.min) {
									point.overflow++;
									point.y += distance;
								}

							}

							if (point.y > track.max) {

								while (point.y > track.max) {
									point.overflow--;
									point.y -= distance;
								}

							}

						}

					}

					if (lastPoint != null && lastPoint.overflow != point.overflow) {
						result.push(empty);
					}

					lastPoint = point;

					result.push(point);

				});

				return result;
			}

			function buildXAxis(threshold) {

				threads = attrs.threads = Number(attrs.threads) || 4;

				viewWidth = element[0].clientWidth;
				viewHeight = element[0].offsetHeight;

				startTime = scope.startTime.getTime();
				endTime = new Date().getTime() + (threshold / 2);

				var viewScale = d3.scale.linear()
					.domain([
						0,
						threshold
					])
					.range([
						0,
						viewHeight
					]);

				height = viewScale(endTime) - viewScale(startTime);

				scope.timeScale = timeScale = d3.scale.linear()
					.domain([
						startTime,
						endTime
					])
					.range([
						0,
						height
					]);

				if (!scope.svg) {
					scope.svg = {};
				}

				scope.svg.xTicks = timeScale.ticks(((endTime - startTime) / threshold) * 5);
				scope.svg.threads = threads;
				scope.svg.viewWidth = viewWidth;
				scope.svg.viewHeight = viewHeight;
				scope.svg.startTime = startTime;
				scope.svg.endTime = endTime;
				scope.svg.height = height;

			}

			function scrollIfNeeded() {

				const container = document.getElementById('dmec-scroll');
				container.addEventListener('scroll', moveLegendToTop);

				if (scope.autoScroll == true) {
					container.scrollTop = container.scrollHeight;
				} else {
					scope.autoScroll = false;
				}

				moveLegendToTop();
			}

			function moveLegendToTop() {
				const container = document.getElementById('dmec-scroll');
				const legend = d3.selectAll('.label');
				legend.attr('transform', 'translate(0, ' + container.scrollTop + ')');
			}

			function buildYAxis() {

				var promises = [];

				for (var i in scope.dmecTracks) {
					let track = scope.dmecTracks[i];
					promises.push(createPathAsync(track, i));
				}

				Promise.all(promises).then(function () {
					scope.$tracks = scope.dmecTracks;

					scope.$watch('newPoints', function () {
						applyOverflow('newPoints');
					}, true);

					scope.$watch('oldPoints', function () {
						applyOverflow('oldPoints');
					});

				});

			}

			function createPathAsync(track, index) {

				return new Promise(function (resolve, reject) {

					setTimeout(function () {

						track.color = colorScale(index);

						var trackIndex = index;
						var startAt = trackXPosition(trackIndex);
						var endAt = trackXPosition(++trackIndex);

						while (startAt == endAt) {
							endAt = trackXPosition(++trackIndex);
						}

						track.labelPosition = index % (scope.dmecTracks.length / threads);
						track.labelXMin = startAt;
						track.labelXMax = endAt;

						var trackScale = d3.scale.linear()
							.domain([track.min, track.max])
							.range([
								startAt + ((endAt - startAt) * 0.05),
								endAt, - ((endAt - startAt) * 0.05)
							]);

						var lineFunction = d3.svg.line()
							.defined(isNumber)
							.x(scaleValue)
							.y(scaleTime)
							.interpolate('linear');

						track.id = index;
						track.lineFunction = lineFunction;
						track.trackScale = trackScale;
						track.ticks = trackScale.ticks(5);

						resolve();

						function isNumber(d) {
							return (angular.isNumber(d.y) && angular.isNumber(d.x));
						}

						function scaleValue(d) {
							return trackScale(d.y);
						}

						function scaleTime(d) {
							return timeScale(d.x);
						}

					}, 1000);

				});
			}

			function trackXPosition(trackIndex) {

				var numberOfTracks = scope.dmecTracks.length;
				var tracksPerThread = Math.ceil(numberOfTracks / threads);
				var relative = Math.floor(trackIndex / tracksPerThread) / threads;

				return (relative * viewWidth);
			}

			function listenToMouseMove() {

				d3.selectAll('.overlay')
					.on('mousemove', function () {
						const timestamp = timeScale.invert(d3.mouse(this)[1]);
						mousemove(timestamp);
					});

			}


			function mousemove(timestamp) {

				d3.selectAll('#crosshair')
					.attr('y1', timeScale(timestamp))
					.attr('y2', timeScale(timestamp));

				for (let $index in scope.dmecTracks) {

					try {

						var track = scope.dmecTracks[$index];
						var bubble = d3.selectAll('#bubble-' + $index);
						var tooltip = d3.selectAll('#text-' + $index);

						let i = null;
						let startDatum = null;
						let endDatum = null;

						if (scope.$newPoints && scope.$newPoints[track.param] && scope.$newPoints[track.param][0] && scope.$newPoints[track.param][0].x <= timestamp) {
							i = bisect(scope.$newPoints[track.param], timestamp);

							startDatum = scope.$newPoints[track.param][i - 1];
							endDatum = scope.$newPoints[track.param][i];

						} else if (scope.$oldPoints && scope.$oldPoints[track.param]) {
							i = bisect(scope.$oldPoints[track.param], timestamp);

							startDatum = scope.$oldPoints[track.param][i - 1];
							endDatum = scope.$oldPoints[track.param][i];
						}

						const datum = [startDatum, endDatum].filter(function (_datum) {
							return (_datum && _datum.y);
						});

						let point = datum.sort(function (a, b) {
							return Math.abs(a.x - timestamp) - Math.abs(b.x - timestamp);
						})[0];


						if (point && point.y != null) {

							bubble.attr('style', null);
							bubble.attr('transform', 'translate(' + track.trackScale(point.y) + ', ' + timeScale(timestamp) + ')');

							tooltip
								.attr('x', track.trackScale(track.max) - track.trackScale(point.y))
								.attr('y', (track.labelPosition * 15));

							if (point.actual != null) {
								tooltip.text(format(point.actual) + ' (' + track.unitMeasure + ')');
							}

						}

					} catch (e) {
						bubble.attr('style', 'display: none');
						console.log(e);
					}

				}
			}

		}

	}

})();