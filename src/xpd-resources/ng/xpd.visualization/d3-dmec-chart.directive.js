(function () {
	'use strict';

	var module = angular.module('xpd.visualization');

	module.directive('d3DmecChart', d3DmecChart);
	module.controller('ModalUpdateDmecTracks', ModalUpdateDmecTracks);

	ModalUpdateDmecTracks.$inject = ['$scope', '$uibModalInstance', 'tracks'];
	d3DmecChart.$inject = ['d3Service', '$interval', '$timeout', 'readingSetupAPIService', '$uibModal'];

	function d3DmecChart(d3Service, $interval, $timeout, readingSetupAPIService, $modal) {
		return {
			restrict: 'E',
			templateUrl: '../xpd-resources/ng/xpd.visualization/d3-dmec-chart.template.html',
			scope: {
				startAt: '=',
				endAt: '=',
				zoomStartAt: '=',
				zoomEndAt: '=',
				readings: '=',
				autoScroll: '='
			},
			link: link
		};

		function getRandomArbitrary(min, max) {
			return Math.floor(Math.random() * (max - min) + min);
		}

		function link(scope, element, attrs) {

			scope.element = element[0];

			var threads = 4;
			var updateLatency = 1000;
			var chartId = scope.chartId = getRandomArbitrary(100, 999) + '-' + getRandomArbitrary(100, 999) + '-' + getRandomArbitrary(100, 999);
			var isHorizontal = scope.horizontal = (attrs.horizontal == true || attrs.horizontal == 'true');

			var defaultTracks = [{
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

			if (!localStorage.dmecTracks) {
				localStorage.dmecTracks = JSON.stringify(defaultTracks);
			}

			scope.tracks = JSON.parse(localStorage.dmecTracks);

			d3Service.d3().then(d3Done);

			function d3Done(d3) {

				var colorScale = d3.scale.category10();
				var format = d3.format('.1f');
				var bisect = d3.bisector(function (datum) { return datum.x; }).right;

				$interval(getTick, updateLatency);
				$interval(scrollIfNeeded, updateLatency, isHorizontal);

				scope.$watch('startAt', onDateRangeChange);
				scope.$watch('endAt', onDateRangeChange);
				scope.$watch('zoomStartAt', onDateRangeChange);
				scope.$watch('zoomEndAt', onDateRangeChange);

				scope.$watch('readings', recomputeOldPoints);

				scope.openScaleModal = openScaleModal;
				scope.listenToMouseMove = listenToMouseMove;

				function onDateRangeChange(newDate, oldDate) {
					console.log('On Date Range Change');
					resize(isHorizontal);
				}

				function updateTracks() {

					scope.tracks = scope.tracks.map(function (track, index) {
						return configTrackProperties(track, index, isHorizontal);
					});

					recomputeOldPoints();
				}

				function getTick() {
					if (scope.lastReadingTime != null) {
						readingSetupAPIService.getTick(scope.lastReadingTime, onCurrentReading);
						if(!scope.endAt || scope.endAt && new Date(scope.endAt).getTime() < scope.lastReadingTime ){
							scope.endAt = scope.lastReadingTime;
						}
						scope.lastReadingTime += updateLatency;
					}
				}

				function onCurrentReading(currentReading) {

					try {
						scope.currentReadings.push(currentReading);
					} catch (e) {
						scope.currentReadings = [currentReading];
					}

					scope.newPoints = readingsToPoints(scope.currentReadings, scope.tracks);
					// console.log(scope.newPoints);
					applyOverflow('newPoints');

				}

				function recomputeOldPoints() {
					console.log('Recompute Old Points');
					scope.lastReadingTime = null;

					if(scope.readings){
						scope.lastReadingTime = new Date(scope.readings[scope.readings.length - 1].timestamp).getTime();
					}

					scope.oldPoints = readingsToPoints(scope.readings, scope.tracks);
					// console.log(scope.oldPoints);
					applyOverflow('oldPoints');
				}

				function resize(horizontal) {
					console.log('Resize');

					try {

						var zoomStartAt = (scope.zoomStartAt) ? scope.zoomStartAt : scope.startAt;
						var zoomEndAt = (scope.zoomEndAt) ? scope.zoomEndAt : scope.endAt;

						zoomStartAt = new Date(zoomStartAt);
						zoomEndAt = new Date(zoomEndAt);

						var viewWidth = scope.element.clientWidth;
						var viewHeight = scope.element.offsetHeight;

						var zoomScale = d3.scale.linear()
							.domain([
								zoomStartAt.getTime(),
								zoomEndAt.getTime(),
							])
							.range([
								0,
								horizontal ? viewWidth : viewHeight
							]);

						var timeAxisSize = zoomScale(new Date(scope.endAt).getTime()) - zoomScale(new Date(scope.startAt).getTime());

						scope.timeScale = d3.scale.linear()
							.domain([
								new Date(scope.startAt).getTime(),
								new Date(scope.endAt).getTime(),
							])
							.range([
								0,
								timeAxisSize * 0.95
							]);

						scope.svg = {
							viewWidth: (horizontal) ? timeAxisSize : viewWidth,
							viewHeight: (horizontal) ? viewHeight : timeAxisSize
						};

						scope.xTicks = scope.timeScale.ticks();

						updateTracks();

					} catch (e) {
						console.log(e);
					}
				}

				function readingsToPoints(readings, tracks) {

					var points = {};

					if (!tracks || !readings) {
						return points;
					}

					tracks.map(preparePoints);

					function preparePoints(track) {

						points[track.param] = readings.map(convertToXY);

						function convertToXY(point) {

							return {
								x: point.timestamp,
								y: point[track.param] || null,
								actual: point[track.param] || null
							};
						}

						return track;
					}

					return points;
				}

				function listenToMouseMove(horizontal) {
					console.log('listenToMouseMove');

					d3.select(scope.element).selectAll('.overlay')
						.on('mousemove', function () {

							var timestamp = null;
							if (!horizontal) {
								timestamp = scope.timeScale.invert(d3.mouse(this)[1]);
							} else {
								timestamp = scope.timeScale.invert(d3.mouse(this)[0]);
							}
							mousemove(timestamp);

						});

					function mousemove(timestamp) {

						d3.select(scope.element).selectAll('#crosshair')
							.attr(((!horizontal) ? 'y1' : 'x1'), scope.timeScale(timestamp))
							.attr(((!horizontal) ? 'y2' : 'x2'), scope.timeScale(timestamp));

						scope.tracks.map(function (track, trackIndex) {

							try {

								var bubble = d3.select(scope.element).selectAll('#bubble-' + trackIndex);
								var tooltip = d3.select(scope.element).selectAll('#text-' + trackIndex);

								var pointIndex = null;
								var startDatum = null;
								var endDatum = null;

								if (scope.newPoints && scope.newPoints[track.param] && scope.newPoints[track.param][0] && scope.newPoints[track.param][0].x <= timestamp) {
									pointIndex = bisect(scope.newPoints[track.param], timestamp);

									startDatum = scope.newPoints[track.param][pointIndex - 1];
									endDatum = scope.newPoints[track.param][pointIndex];

								} else if (scope.oldPoints && scope.oldPoints[track.param]) {
									pointIndex = bisect(scope.oldPoints[track.param], timestamp);

									startDatum = scope.oldPoints[track.param][pointIndex - 1];
									endDatum = scope.oldPoints[track.param][pointIndex];
								}

								var datum = [startDatum, endDatum].filter(function (_datum) {
									return (_datum && _datum.y);
								});

								var point = datum.sort(function (a, b) {
									return Math.abs(a.x - timestamp) - Math.abs(b.x - timestamp);
								})[0];


								if (point && point.y != null) {

									bubble.attr('style', null);
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

								}

							} catch (e) {
								bubble.attr('style', 'display: none');
							}

						});

					}

				}

				function applyOverflow(trackName) {

					scope.tracks.map(function (track) {

						if (!scope[trackName]) {
							scope[trackName] = {};
						}
						if (!scope[trackName + 'Path']) {
							scope[trackName + 'Path'] = {};
						}

						if (scope[trackName] && scope[trackName][track.param]) {
							scope[trackName][track.param] = handleOverflow(scope[trackName][track.param], track);
							scope[trackName + 'Path'][track.param] = track.lineFunction(scope[trackName][track.param]);
						}

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

				function configTrackProperties(track, index, horizontal) {

					track.color = colorScale(index);

					var trackIndex = index;
					var startAt = trackPosition(trackIndex);
					var endAt = trackPosition(++trackIndex);

					while (startAt == endAt) {
						endAt = trackPosition(++trackIndex);
					}

					track.labelPosition = index % (scope.tracks.length / threads);
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

					function isNumber(d) {
						return (angular.isNumber(d.y) && angular.isNumber(d.x));
					}

					function scaleValue(d) {
						if (!horizontal)
							return trackScale(d.y);
						else
							return scope.timeScale(d.x);
					}

					function scaleTime(d) {
						if (!horizontal)
							return scope.timeScale(d.x);
						else
							return trackScale(d.y);
					}

					function trackPosition(trackIndex) {

						var numberOfTracks = scope.tracks.length;
						var tracksPerThread = Math.ceil(numberOfTracks / threads);
						var relative = Math.floor(trackIndex / tracksPerThread) / threads;
						var result = (relative * ((horizontal) ? scope.svg.viewHeight : scope.svg.viewWidth));

						// console.log('f(%s) = %s', trackIndex, result);

						return result;
					}

					return track;
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
								return scope.tracks;
							},
							updateTracks: function () {
								return updateTracks;
							}
						}
					});
				}
			}

		}

	}

	function ModalUpdateDmecTracks($scope, $modalInstance, tracks, updateTracks) {

		$scope.viewData = {
			trackList: []
		};

		$scope.viewData.trackList = angular.copy(tracks);

		$scope.actionButtonConfirm = actionButtonConfirm;
		$scope.actionButtonClose = actionButtonClose;

		function actionButtonConfirm() {

			// updating tracks
			for (var i in $scope.viewData.trackList) {
				if (+tracks[i].min != +$scope.viewData.trackList[i].min) {
					tracks[i].min = +$scope.viewData.trackList[i].min;
				}

				if (+tracks[i].max != +$scope.viewData.trackList[i].max) {
					tracks[i].max = +$scope.viewData.trackList[i].max;
				}
			}

			localStorage.dmecTracks = JSON.stringify(tracks);

			updateTracks();

			$modalInstance.close();
		}

		function actionButtonClose() {
			$modalInstance.close();
		}
	}

})();