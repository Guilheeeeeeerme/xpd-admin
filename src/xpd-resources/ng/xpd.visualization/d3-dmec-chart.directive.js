(function () {
	'use strict';

	var module = angular.module('xpd.visualization');
	var worker = new Worker('../assets/js/dmec-worker.js');

	module.directive('d3DmecChart', d3DmecChart);
	module.controller('ModalUpdateDmecTracks', ModalUpdateDmecTracks);

	ModalUpdateDmecTracks.$inject = ['$scope', '$uibModalInstance', 'tracks'];
	d3DmecChart.$inject = ['d3Service', '$q', '$interval', '$timeout', 'readingSetupAPIService', '$uibModal'];

	function d3DmecChart(d3Service, $q, $interval, $timeout, readingSetupAPIService, $modal) {
		return {
			restrict: 'E',
			templateUrl: '../xpd-resources/ng/xpd.visualization/d3-dmec-chart.template.html',
			scope: {
				startAt: '=',
				zoomStartAt: '=',
				onEndAtChange: '=',
				zoomEndAt: '=',
				readings: '=',
				autoScroll: '='
			},
			link: link
		};



		function getRandomArbitrary(min, max) {
			return Math.floor(Math.random() * (max - min) + min);
		}

		function getDefaultTracks(min, max) {
			return [{
				label: 'BLOCK POSITION',
				min: -10,
				max: 50,
				unitMeasure: 'm',
				param: 'blockPosition',
				nextParam: true
			}, {
				label: 'RATE OF PENETRATION',
				min: 0,
				max: 100,
				unitMeasure: 'm/hr',
				param: 'rop',
				nextParam: false
			}, {
				label: 'WOB',
				min: -10,
				max: 40,
				unitMeasure: 'klbf',
				param: 'wob',
				nextParam: true
			}, {
				label: 'HOOKLOAD',
				min: -10,
				max: 500,
				unitMeasure: 'klbf',
				param: 'hookload',
				nextParam: false
			}, {
				label: 'RPM',
				min: -10,
				max: 200,
				unitMeasure: 'c/min',
				param: 'rpm',
				nextParam: true
			}, {
				label: 'TORQUE',
				min: 0,
				max: 5000,
				unitMeasure: 'kft.lbf',
				param: 'torque',
				nextParam: false
			}, {
				label: 'FLOW',
				min: 0,
				max: 1200,
				unitMeasure: 'gal/min',
				param: 'flow',
				nextParam: true
			}, {
				label: 'STANDPIPE PRESSURE',
				min: 0,
				max: 5000,
				unitMeasure: 'psi',
				param: 'sppa',
				nextParam: false
			}];
		}

		function link(scope, element, attrs) {

			scope.element = element[0];

			var threads = 4;
			var updateLatency = 1000;
			var chartId = scope.chartId = getRandomArbitrary(100, 999) + '-' + getRandomArbitrary(100, 999) + '-' + getRandomArbitrary(100, 999);
			var isHorizontal = scope.horizontal = (attrs.horizontal == true || attrs.horizontal == 'true');

			if (!localStorage.dmecTracks) {
				localStorage.dmecTracks = JSON.stringify(getDefaultTracks());
			}

			scope.tracks = JSON.parse(localStorage.dmecTracks);

			d3Service.d3().then(d3Done);

			function d3Done(d3) {

				var colorScale = d3.scale.category10();
				var format = d3.format('.1f');

				$interval(getTick, updateLatency);
				$interval(scrollIfNeeded, updateLatency, isHorizontal);

				scope.$watch('zoomStartAt', onZoomChange);
				scope.$watch('zoomEndAt', onZoomChange);
				scope.$watch('startAt', onDateRangeChange);
				scope.$watch('endAt', onEndAtChange);

				scope.$watch('readings', onReadingsListReady);

				scope.openScaleModal = openScaleModal;
				scope.listenToMouseMove = listenToMouseMove;
				scope.updateTracks = updateTracks;
				scope.recomputeOldPoints = recomputeOldPoints;
				scope.recomputeNewPoints = recomputeNewPoints;

				function onDateRangeChange(newDate, oldDate) {
					// console.log('onDateRangeChange');
					resize(isHorizontal);
				}

				function onZoomChange() {
					onDateRangeChange();

					try { draw('oldPoints'); } catch (e) { };
					try { draw('newPoints'); } catch (e) { };
				}

				function onEndAtChange() {
					// console.log('onEndAtChange');
					scope.onEndAtChange && scope.onEndAtChange(scope.endAt);
					onDateRangeChange();
				}

				function onReadingsListReady() {
					// console.log('onReadingsListReady');
					recomputeOldPoints();
				}

				function getTick() {
					// console.log('getTick');
					var endAt = new Date().getTime();
					readingSetupAPIService.getTick((endAt - updateLatency), onCurrentReading);
					scope.endAt = endAt;
				}

				function recomputeOldPoints() {

					readingsToPoints(scope.readings, scope.tracks).then(function (oldPoints) {
						scope.oldPoints = oldPoints;
						draw('oldPoints');
					});
				}

				function recomputeNewPoints() {

					readingsToPoints(scope.currentReadings, scope.tracks).then(function (newPoints) {
						scope.newPoints = newPoints;
						draw('newPoints');
					});
				}

				function onCurrentReading(currentReading) {
					// console.log('onCurrentReading');

					try {
						scope.currentReadings.push(currentReading);
					} catch (e) {
						scope.currentReadings = [currentReading];
					}

					recomputeNewPoints();
				}

				function resize(horizontal) {
					// console.log('resize');

					try {


						var endAt = (scope.endAt) ? scope.endAt : new Date();
						var startAt = (scope.startAt) ? scope.startAt : new Date();

						var zoomStartAt = (scope.zoomStartAt) ? scope.zoomStartAt : startAt;
						var zoomEndAt = (scope.zoomEndAt) ? scope.zoomEndAt : endAt;

						startAt = new Date(startAt);
						endAt = new Date(endAt);

						zoomStartAt = new Date(zoomStartAt);
						zoomEndAt = new Date(zoomEndAt);

						var viewWidth = scope.element.clientWidth;
						var viewHeight = scope.element.offsetHeight;

						var timeScale = d3.time.scale()
							.domain([
								zoomStartAt,
								zoomEndAt,
							])
							.range([
								0,
								horizontal ? (viewWidth * 0.95) : (viewHeight * 0.95)
							]);

						var timeAxisSize = Math.abs(timeScale(endAt) - timeScale(startAt));

						scope.svg = {
							viewWidth: (horizontal) ? timeAxisSize : viewWidth,
							viewHeight: (horizontal) ? viewHeight : timeAxisSize
						};

						scope.timeScale = timeScale;
						scope.xTicks = timeScale.ticks();

						updateTracks();

					} catch (e) {
						console.error(e);
					}
				}

				function readingsToPoints(readings, tracks) {

					return $q(function (resolve, reject) {

						if (tracks != null && tracks.length > 0 && readings != null && readings.length > 0) {

							// var worker = new Worker('../assets/js/dmec-worker.js');

							worker.postMessage({
								cmd: 'reading-to-points',
								tracks: tracks.map(function (t) { return { param: t.param }; }),
								readings: readings
							});

							worker.addEventListener('message', function (event) {
								resolve(event.data.points);
							}, false);

						}

					});

				}

				function updateTracks() {

					scope.tracks = scope.tracks.map(function (track, index) {
						return configTrackProperties(track, index, isHorizontal);
					});

					function configTrackProperties(track, index, horizontal) {

						track.color = colorScale(index);

						var trackIndex = index;
						var labelStartAt = trackPosition(trackIndex);
						var labelEndAt = trackPosition(++trackIndex);

						while (labelStartAt == labelEndAt) {
							labelEndAt = trackPosition(++trackIndex);
						}

						track.labelPosition = index % (scope.tracks.length / threads);
						track.labelStartAt = labelStartAt;
						track.labelEndAt = labelEndAt;

						var x1 = (track.min);
						var x2 = (track.max);
						var y1 = (labelStartAt + ((labelEndAt - labelStartAt) * 0.05));
						var y2 = (labelEndAt - ((labelEndAt - labelStartAt) * 0.05));
						var m = (y2 - y1) / (x2 - x1);

						function trackScale(x) {
							return (m * (x - x1)) + y1;
						}

						var createTicks = d3.scale.linear()
							.domain([track.min, track.max])
							.range([
								labelStartAt + ((labelEndAt - labelStartAt) * 0.05),
								labelEndAt - ((labelEndAt - labelStartAt) * 0.05)
							]);

						var lineFunction = d3.svg.line()
							.defined(isNumber)
							.x(scaleValue)
							.y(scaleTime)
							.interpolate('linear');

						track.id = index;
						track.lineFunction = lineFunction;
						track.trackScale = trackScale;
						track.ticks = createTicks.ticks(5);

						function isNumber(d) {
							return (angular.isNumber(d.y) && angular.isNumber(d.x));
						}

						function scaleValue(d) {
							var x;
							if (!horizontal)
								x = trackScale(d.y);
							else
								x = scope.timeScale(d.x);

							return x;
						}

						function scaleTime(d) {
							var y;
							if (!horizontal)
								y = scope.timeScale(d.x);
							else
								y = trackScale(d.y);

							return y;
						}

						function trackPosition(trackIndex) {

							var numberOfTracks = scope.tracks.length;
							var tracksPerThread = Math.ceil(numberOfTracks / threads);
							var relative = Math.floor(trackIndex / tracksPerThread) / threads;
							var result = (relative * ((horizontal) ? scope.svg.viewHeight : scope.svg.viewWidth));
							return result;
						}

						return track;
					}
				}

				function listenToMouseMove(horizontal) {
					// console.log('listenToMouseMove');

					d3.select(scope.element).selectAll('.overlay')
						.on('mousemove', mouseEvent);

					function mouseEvent() {

						var position = null;
						var timestamp = null;

						if (!horizontal) {
							position = d3.mouse(this)[1];
							timestamp = scope.timeScale.invert(d3.mouse(this)[1]);
						} else {
							position = d3.mouse(this)[0];
							timestamp = scope.timeScale.invert(d3.mouse(this)[0]);
						}

						d3.select(scope.element).selectAll('#crosshair')
							.attr(((!horizontal) ? 'y1' : 'x1'), position)
							.attr(((!horizontal) ? 'y2' : 'x2'), position);

						onMousemove(timestamp, position);

					}

					function onMousemove(timestamp, position) {

						scope.tracks.map(function (track, trackIndex) {

							var point = null;
							var points = [];
							var bubble = d3.select(scope.element).selectAll('#bubble-' + trackIndex);
							var tooltip = d3.select(scope.element).selectAll('#text-' + trackIndex);

							bubble.attr('style', 'display: none');
							tooltip.attr('style', 'display: none');

							try {

								if (scope.oldPoints &&
									scope.oldPoints[track.param] &&
									scope.oldPoints[track.param].length &&
									scope.oldPoints[track.param][0].x <= timestamp &&
									scope.oldPoints[track.param][scope.oldPoints[track.param].length - 1].x >= timestamp) {

									points = scope.oldPoints[track.param];
								} else if (scope.newPoints &&
									scope.newPoints[track.param] &&
									scope.newPoints[track.param].length &&
									scope.newPoints[track.param][0].x <= timestamp &&
									scope.newPoints[track.param][scope.newPoints[track.param].length - 1].x >= timestamp) {

									points = scope.newPoints;
								}

								for (var i in points) {
									if ((points[i].x / 1000) >= (timestamp / 1000)) {
										point = points[i];
										break;
									}
								}

								if (point && point.y != null) {

									bubble.attr('style', null);
									tooltip.attr('style', null);

									if (!horizontal)
										bubble.attr('transform', 'translate(' + track.trackScale(point.y) + ', ' + scope.timeScale(timestamp) + ')');
									else
										bubble.attr('transform', 'translate(' + scope.timeScale(timestamp) + ', ' + track.trackScale(point.y) + ')');

									tooltip
										.attr((!horizontal) ? 'x' : 'y', track.trackScale(track.max) - track.trackScale(point.y))
										.attr((!horizontal) ? 'y' : 'x', (track.labelPosition * 15));

									if (point.actual != null) {
										tooltip.text(format(point.actual) + ' (' + track.unitMeasure + ')');
									}

								} else {
									bubble.attr('style', 'display: none');
								}

							} catch (e) {
								console.error(e);
								bubble.attr('style', 'display: none');
							}

						});

					}

				}

				function draw(trackName) {

					scope.tracks.map(function (track) {
						scope[trackName][track.param] = handleOverflow(scope[trackName][track.param], track);
						d3.select(scope.element)
							.selectAll('.' + trackName)
							.selectAll('#' + track.param)
							.attr('d', track.lineFunction(scope[trackName][track.param]));
					});

					function handleOverflow(points, track) {

						var result = [];
						var distance = 0;
						var lastPoint = null;

						while ((track.min + distance) <= track.max) {
							distance++;
						}

						points.map(function (pt) {

							var point = angular.copy(pt);

							var empty = {
								x: point.x,
								y: null,
								actual: null
							};

							point.overflow = 0;

							if (point.y != null) {

								for (var i = 0; i < 2; i++) {

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

				}

				function getScrollContainer() {
					return document.getElementById(chartId);
				}

				function scrollIfNeeded(horizontal) {

					var container = getScrollContainer();
					container.addEventListener('scroll', moveLegend);

					if (!horizontal) {
						if (scope.autoScroll == true) {
							container.scrollTop = container.scrollHeight;
						} else {
							scope.autoScroll = false;
						}
					} else {
						if (scope.autoScroll == true) {
							container.scrollLeft = container.scrollWidth;
						} else {
							scope.autoScroll = false;
						}
					}

					moveLegend(horizontal);
				}

				function moveLegend(horizontal) {
					var container = getScrollContainer();
					var legend = d3.select(scope.element).selectAll('.label');

					if (!horizontal) {
						legend.attr('transform', 'translate(0, ' + container.scrollTop + ')');
					} else {
						legend.attr('transform', 'translate(' + container.scrollLeft + ', 0)');
					}
				}

				function openScaleModal() {
					$modal.open({
						animation: false,
						keyboard: false,
						backdrop: 'static',
						templateUrl: 'app/components/dmec-log/change-scale.template.html',
						controller: 'ModalUpdateDmecTracks',
						windowClass: 'change-scale-modal',
						resolve: {
							tracks: function () {
								return scope;
							},
						}
					});
				}
			}

		}

	}

	function ModalUpdateDmecTracks($scope, $modalInstance, tracks) {

		$scope.viewData = {
			trackList: []
		};

		$scope.viewData.trackList = angular.copy(tracks.tracks);

		$scope.actionButtonConfirm = actionButtonConfirm;
		$scope.actionButtonClose = actionButtonClose;

		function actionButtonConfirm() {

			// updating tracks
			for (var i in $scope.viewData.trackList) {
				if (+tracks.tracks[i].min != +$scope.viewData.trackList[i].min) {
					tracks.tracks[i].min = +$scope.viewData.trackList[i].min;
				}

				if (+tracks.tracks[i].max != +$scope.viewData.trackList[i].max) {
					tracks.tracks[i].max = +$scope.viewData.trackList[i].max;
				}
			}

			localStorage.dmecTracks = JSON.stringify(tracks.tracks);

			tracks.updateTracks();
			tracks.recomputeOldPoints();
			tracks.recomputeNewPoints();

			$modalInstance.close();
		}

		function actionButtonClose() {
			$modalInstance.close();
		}
	}

})();