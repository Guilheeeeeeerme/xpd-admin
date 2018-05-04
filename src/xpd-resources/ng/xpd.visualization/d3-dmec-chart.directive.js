(function () {
	'use strict';

	var module = angular.module('xpd.visualization');
	var worker = new Worker('../assets/js/dmec-worker.js');

	module.directive('d3DmecChart', d3DmecChart);
	module.controller('ModalUpdateDmecTracks', ModalUpdateDmecTracks);

	ModalUpdateDmecTracks.$inject = ['$scope', '$uibModalInstance', 'tracks'];
	d3DmecChart.$inject = ['d3Service', '$q', '$interval', '$timeout', '$uibModal'];

	function d3DmecChart(d3Service, $q, $interval, $timeout, $modal) {
		return {
			restrict: 'E',
			templateUrl: '../xpd-resources/ng/xpd.visualization/d3-dmec-chart.template.html',
			scope: {
				startAt: '=',
				endAt: '=',
				zoomStartAt: '=',
				zoomEndAt: '=',
				onReading: '=',
				onReadingSince: '=',
				autoScroll: '=',
				connectionEvents: '=',
				tripEvents: '=',
				timeEvents: '='
			},
			link: link
		};

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

			var threads = (!isNaN(Number(attrs.threads))) ? Number(attrs.threads) : 4;
			var isHorizontal = scope.horizontal = (attrs.horizontal == true || attrs.horizontal == 'true');

			if (!localStorage.dmecTracks) {
				localStorage.dmecTracks = JSON.stringify(getDefaultTracks());
			}

			scope.tracks = JSON.parse(localStorage.dmecTracks);

			d3Service.d3().then(d3Done);

			function d3Done(d3) {

				var colorScale = d3.scale.category10();
				var format = d3.format('.1f');

				/** 
				 * Realtime 
				 */
				scope.$watch('onReading', onReadingChange);

				/** 
				 * Readings history 
				 */
				scope.$watch('onReadingSince', onReadingSinceChange);

				/** 
				 * Atemporal 
				 */
				scope.$watch('zoomStartAt', onZoomStartAtChange, true);
				scope.$watch('zoomEndAt', onZoomEndAtChange, true);
				scope.$watch('startAt', onStartAtChange, true);
				scope.$watch('endAt', onEndAtChange, true);

				scope.openScaleModal = openScaleModal;
				scope.listenToMouseMove = listenToMouseMove;
				scope.buildTracksAxis = buildTracksAxis;

				buildTimeAxis();
				buildTracksAxis();

				/**Real Time Readings */
				function onReadingChange(onReading) {
					if (onReading) {
						onReading.then(function (currentReading) {

							if (!scope.currentReadings) {
								scope.currentReadings = [];
							}

							scope.currentReadings.push(currentReading);

							readingsToPoints(scope.currentReadings, scope.tracks).then(function (newPoints) {
								scope.newPoints = newPoints;
								draw('newPoints');
							});

						});
					}
				}

				/**Readings history */
				function onReadingSinceChange(onReadingSince) {
					if (onReadingSince) {
						onReadingSince.then(function (readings) {
							scope.readings = readings;

							readingsToPoints(scope.readings, scope.tracks).then(function (oldPoints) {
								scope.oldPoints = oldPoints;
								draw('oldPoints');
							});
						});
					}
				}

				function onZoomStartAtChange(newDate, oldDate) {
					if (newDate && new Date(newDate).getTime() !== new Date(oldDate).getTime()) {
						handleZoom();
					}
				}

				function onZoomEndAtChange(newDate, oldDate) {
					if (newDate && new Date(newDate).getTime() !== new Date(oldDate).getTime()) {
						handleZoom();
					}
				}

				function onStartAtChange(newDate, oldDate) {
					if (newDate && new Date(newDate).getTime() !== new Date(oldDate).getTime()) {
						handleZoom();
					}
				}

				function onEndAtChange(newDate, oldDate) {
					if (newDate && new Date(newDate).getTime() !== new Date(oldDate).getTime()) {
						handleZoom();
					}
				}

				function buildTimeAxis() {

					if (!scope.startAt) {
						console.error('Missing Param "startAt" ');
						return;
					}

					if (!scope.endAt) {
						console.error('Missing Param "endAt" ');
						return;
					}

					var viewWidth = scope.element.clientWidth;
					var viewHeight = scope.element.offsetHeight;

					var timeScale = d3.time.scale()
						.domain([
							new Date(scope.startAt),
							new Date(scope.endAt),
						])
						.range([
							0,
							isHorizontal ? (viewWidth) : (viewHeight)
						]);

					if (!scope.svg) {
						scope.svg = {};
					}

					scope.svg.viewWidth = viewWidth;
					scope.svg.viewHeight = viewHeight;

					scope.zoomScale = scope.timeScale = timeScale;
				}

				function handleZoom() {

					var endAt = (new Date(scope.endAt) == 'Invalid Date') ? null : new Date(scope.endAt);
					var startAt = (new Date(scope.startAt) == 'Invalid Date') ? null : new Date(scope.startAt);

					var zoomStartAt = (new Date(scope.zoomStartAt) == 'Invalid Date') ? startAt : scope.zoomStartAt;
					var zoomEndAt = (new Date(scope.zoomEndAt) == 'Invalid Date') ? endAt : scope.zoomEndAt;

					if (endAt == null) {
						console.error('Missing Param "endAt" ');
						return;
					}

					if (startAt == null) {
						console.error('Missing Param "startAt" ');
						return;
					}

					if (zoomStartAt == null) {
						console.error('Missing Param "zoomStartAt" ');
						return;
					}

					if (zoomEndAt == null) {
						console.error('Missing Param "zoomEndAt" ');
						return;
					}

					scope.svg.startAt = scope.timeScale(zoomStartAt);
					scope.svg.zoomArea = (scope.timeScale(zoomEndAt) - scope.timeScale(zoomStartAt));

					if (isHorizontal) {
						scope.svg.viewBox = scope.timeScale(zoomStartAt) + ' 0 ' + scope.svg.zoomArea + ' ' + scope.svg.viewHeight;
					} else {
						scope.svg.viewBox = '0 ' + scope.timeScale(zoomStartAt) + ' ' + scope.svg.viewWidth + ' ' + scope.svg.zoomArea;
					}

					var zoomScale = d3.time.scale()
						.domain([
							new Date(zoomStartAt),
							new Date(zoomEndAt),
						])
						.range([
							0,
							isHorizontal ? (scope.svg.viewWidth) : (scope.svg.viewHeight)
						]);

					scope.xTicks = zoomScale.ticks(6);
					scope.zoomScale = zoomScale;

				}

				function buildTracksAxis() {

					scope.$tracks = scope.tracks.map(function (track, index) {
						return configTrackProperties(track, index, isHorizontal);
					});

					try { draw('newPoints'); } catch (e) {
						// faça nada
					}
					try { draw('oldPoints'); } catch (e) {
						// faça nada
					}

					function configTrackProperties(track, index, isHorizontal) {

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

						var trackScale = d3.scale.linear()
							.domain([track.min, track.max])
							.range([
								labelStartAt + ((labelEndAt - labelStartAt) * 0.05),
								labelEndAt - ((labelEndAt - labelStartAt) * 0.05)
							]);

						var lineFunction = d3.svg.line()
							.defined(isNumber)
							.x(scaleValue)
							.y(scaleTime)
							.interpolate('step-after');

						track.id = index;
						track.lineFunction = lineFunction;
						track.trackScale = trackScale;
						track.ticks = trackScale.ticks(4);

						function isNumber(d) {
							return (!isNaN(d.y) && !isNaN(d.x));
						}

						function scaleValue(d) {
							var x;
							if (!isHorizontal)
								x = trackScale(d.y);
							else
								x = scope.timeScale(d.x);

							return x;
						}

						function scaleTime(d) {
							var y;
							if (!isHorizontal)
								y = scope.timeScale(d.x);
							else
								y = trackScale(d.y);

							return y;
						}

						function trackPosition(trackIndex) {

							var viewWidth = scope.svg.viewWidth;
							var viewHeight = scope.svg.viewHeight;

							var numberOfTracks = scope.tracks.length;
							var tracksPerThread = Math.ceil(numberOfTracks / threads);
							var relative = Math.floor(trackIndex / tracksPerThread) / threads;
							var result = (relative * ((isHorizontal) ? viewHeight : viewWidth));

							return result;
						}

						return track;
					}
				}

				function draw(trackName) {
					
					// console.log('draw(%s)', trackName);

					if (scope[trackName]) {

						worker.postMessage({
							cmd: 'handle-overflow',
							tracks: scope.tracks.map(function (track) {

								return {
									param: track.param,
									min: track.min,
									max: track.max
								};
							}),
							trackName: trackName,
							points: scope[trackName]
						});

						var promise = $q(function (resolve, reject) {
							worker.addEventListener('message', function (event) {
								if (event.data.cmd == 'handle-overflow') {
									resolve(event.data);
								}
							}, false);
						});

						promise.then(function (data) {

							var points = data.points;
							var processedTrackName = data.trackName;

							console.log({
								points: points,
								processedTrackName: processedTrackName
							});

							scope.tracks.map(function (track) {
								d3.select(scope.element)
									.selectAll('.' + processedTrackName)
									.selectAll('#' + track.param)
									.attr('d', track.lineFunction(points[track.param]));
							});

						});

					}

				}

				function readingsToPoints(readings, tracks) {

					return $q(function (resolve, reject) {

						if (tracks != null && tracks.length > 0 && readings != null && readings.length > 0) {

							worker.postMessage({
								cmd: 'reading-to-points',
								tracks: tracks.map(function (t) { return { param: t.param }; }),
								readings: readings
							});

							worker.addEventListener('message', function (event) {
								if (event.data.cmd == 'reading-to-points') {
									resolve(event.data.points);
								}
							}, false);

						}

					});

				}

				function listenToMouseMove() {

					d3.select(scope.element).selectAll('.overlay')
						.on('mousemove', mousemove);

					function mousemove() {

						var position = null;
						var timestamp = null;

						if (!isHorizontal) {
							position = d3.mouse(this)[1];
							timestamp = scope.zoomScale.invert(d3.mouse(this)[1]);
						} else {
							position = d3.mouse(this)[0];
							timestamp = scope.zoomScale.invert(d3.mouse(this)[0]);
						}

						d3.select(scope.element).selectAll('#crosshair')
							.attr(((!isHorizontal) ? 'y1' : 'x1'), position)
							.attr(((!isHorizontal) ? 'y2' : 'x2'), position);

						onMousemove(timestamp, position);

					}

					function onMousemove(timestamp, position) {

						worker.postMessage({
							cmd: 'find-point',
							timestamp: timestamp,
							tracks: scope.tracks.map(function (t) { return { param: t.param }; }),
							oldPoints: scope.oldPoints,
							newPoints: scope.newPoints
						});

						var promise = $q(function (resolve, reject) {
							worker.addEventListener('message', function (event) {
								if (event.data.cmd == 'find-point') {
									var reading = event.data.points;
									resolve(event.data.points);
								}
							}, false);
						});

						promise.then(function (reading) {
							
							// console.log('------------------------------------');
							// console.log('------------------------------------');
							// console.log('------------------------------------');

							scope.tracks.map(function (track) {

								var bubble = d3.select(scope.element).selectAll('#bubble-' + track.param);
								var tooltip = d3.select(scope.element).selectAll('#text-' + track.param);

								bubble.attr('style', 'display: none');
								tooltip.attr('style', 'display: none');

								var point = reading[track.param];

								if (point && point.y != null) {

									// console.log(track.param, new Date(timestamp), point);

									bubble.attr('style', null);
									tooltip.attr('style', null);

									if (!isHorizontal)
										bubble.attr('transform', 'translate(' + track.trackScale(point.y) + ', ' + /*scope.timeScale(timestamp)*/ position + ')');
									else
										bubble.attr('transform', 'translate(' + /*scope.timeScale(timestamp)*/ position + ', ' + track.trackScale(point.y) + ')');

									tooltip
										.attr((!isHorizontal) ? 'x' : 'y', track.trackScale(track.max) - track.trackScale(point.y))
										.attr((!isHorizontal) ? 'y' : 'x', (track.labelPosition * 15));

									if (point.actual != null) {
										tooltip.text(format(point.actual) + ' (' + track.unitMeasure + ')');
									}

								} else {
									bubble.attr('style', 'display: none');
								}

							});
						});

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

			tracks.buildTracksAxis();

			$modalInstance.close();
		}

		function actionButtonClose() {
			$modalInstance.close();
		}
	}

})();