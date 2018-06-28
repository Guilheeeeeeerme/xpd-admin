(function () {
	'use strict';

	var module = angular.module('xpd.visualization');

	module.directive('d3DmecChart', d3DmecChart);

	d3DmecChart.$inject = ['$interval', '$q', '$uibModal', 'd3Service'];

	function d3DmecChart($interval, $q, $modal, d3Service) {
		return {
			restrict: 'E',
			templateUrl: '../xpd-resources/ng/xpd.visualization/d3-dmec-chart.template.html',
			scope: {
				actualStartAt: '=',
				zoomStartAt: '=',
				zoomEndAt: '=',
				onReading: '=',
				onReadingSince: '='
			},
			link: link
		};

		function link(scope, element, attrs) {

			var worker = new Worker('../assets/js/dmec-worker.js');

			if (!localStorage.getItem('xpd.admin.dmec.dmecTracks')) {
				localStorage.setItem('xpd.admin.dmec.dmecTracks', JSON.stringify(getDefaultTracks()));
			}

			var tracks = JSON.parse(localStorage.getItem('xpd.admin.dmec.dmecTracks'));
			var threads = (!isNaN(Number(attrs.threads))) ? Number(attrs.threads) : 4;
			threads = Math.min(Math.abs(threads), tracks.length);

			var isHorizontal = scope.horizontal = (attrs.horizontal == true || attrs.horizontal == 'true');

			/** 
			 * Readings history 
			 */
			scope.$watch('onReadingSince', onReadingSinceChange);


			/**
			 * Real History
			 */
			function onReadingSinceChange(onReadingSince) {
				if (onReadingSince) {

					onReadingSince.then(function (readings) {

						d3Service.d3().then(function (d3) {

							createChart(d3, readings);

						});

					});
				}
			}

			function waitTheWorker(subject, callback) {

				worker[subject] = callback;

				if (!worker.isListening) {

					worker.isListening = true;

					worker.addEventListener('message', function (message) {
						worker[message.data.cmd](message);
					}, false);

				}

			}

			function createChart(d3, initialPoints) {

				var readings = [];
				var colorScale = d3.scale.category10();
				var format = d3.format('.1f');

				scope.svg = {
					viewWidth: element[0].clientWidth || 200,
					viewHeight: element[0].offsetHeight || 200
				};

				scope.openScaleModal = openScaleModal;
				scope.listenToMouseMove = listenToMouseMove;

				scope.timeScale = d3.time.scale()
					.domain([
						new Date(scope.actualStartAt),
						new Date(),
					])
					.range([
						0,
						isHorizontal ? (scope.svg.viewWidth) : (scope.svg.viewHeight)
					]);

				/** 
				 * Atemporal 
				 */
				scope.$watch('zoomStartAt', handleZoom, true);
				scope.$watch('zoomEndAt', handleZoom, true);

				/** 
				 * Readings history 
				 */
				scope.$watch('onReading', onReadingChange);

				configTracks(tracks);
				draw('oldPoints', initialPoints);

				/**
				 * Real History
				 */
				function onReadingChange(onReading) {
					if (onReading) {

						onReading.then(function (reading) {

							if (!readings) {
								readings = [];
							}

							readings.push(reading);

							readingsToPoints(readings, tracks).then(function (points) {
								scope.newPoints = points;
								draw('newPoints', points);
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

							waitTheWorker('reading-to-points', function (message) {
								resolve(message.data.points);
							}, false);

						}

					});

				}

				function handleZoom() {

					scope.zoomScale = d3.time.scale()
						.domain([
							new Date(scope.zoomStartAt),
							new Date(scope.zoomEndAt),
						])
						.range([
							0,
							isHorizontal ? (scope.svg.viewWidth) : (scope.svg.viewHeight)
						]);

					scope.zoomArea = (scope.timeScale(scope.zoomEndAt) - scope.timeScale(scope.zoomStartAt));

					var viewBox;

					if (isHorizontal) {
						viewBox = scope.timeScale(scope.zoomStartAt) + ' 0 ' + scope.zoomArea + ' ' + scope.svg.viewHeight;
					} else {
						viewBox = '0 ' + scope.timeScale(scope.zoomStartAt) + ' ' + scope.svg.viewWidth + ' ' + scope.zoomArea;
					}

					d3.select(element[0])
						.selectAll('.zoom-view-box-container')
						.attr('viewBox', viewBox);

					scope.timeTicks = scope.zoomScale.ticks();

				}

				function configTracks(tracks) {

					scope.$tracks = tracks.map(function (track, index) {
						return configTrackProperties(track, index, isHorizontal);
					});

					function configTrackProperties(track, index, isHorizontal) {
						
						track.color = colorScale(index);

						var trackIndex = index;
						var labelStartAt = trackPosition(trackIndex);
						var labelEndAt = trackPosition(++trackIndex);

						while (labelStartAt == labelEndAt) {
							labelEndAt = trackPosition(++trackIndex);
						}

						track.labelPosition = index % (tracks.length / threads);
						track.labelStartAt = labelStartAt;
						track.labelEndAt = labelEndAt;

						var trackScale;
						var margin = 0;

						if (isHorizontal) {

							trackScale = d3.scale.linear()
								.domain([
									track.min,
									track.max
								])
								.range([
									Math.max(labelEndAt, labelStartAt) - (Math.abs(labelEndAt - labelStartAt) * margin),
									Math.min(labelEndAt, labelStartAt) + (Math.abs(labelEndAt - labelStartAt) * margin)
								]);

						} else {

							trackScale = d3.scale.linear()
								.domain([
									track.min,
									track.max
								])
								.range([
									Math.min(labelEndAt, labelStartAt) + (Math.abs(labelEndAt - labelStartAt) * margin),
									Math.max(labelEndAt, labelStartAt) - (Math.abs(labelEndAt - labelStartAt) * margin)
								]);

						}

						var lineFunction = d3.svg.line()
							.defined(isNumber)
							.x(scaleValue)
							.y(scaleTime)
							.interpolate('step-after');

						track.id = index;
						track.lineFunction = lineFunction;
						track.trackScale = trackScale;
						track.ticks = [track.max, track.min];

						function isNumber(d) {

							var isDefined = (d.y != null && d.x != null);
							var isNumber = (angular.isNumber(d.y) && angular.isNumber(d.x));

							return isDefined && isNumber;
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

							var numberOfTracks = tracks.length;
							var tracksPerThread = Math.ceil(numberOfTracks / threads);
							var relative = Math.floor(trackIndex / tracksPerThread) / threads;
							var result = (relative * ((isHorizontal) ? viewHeight : viewWidth));

							return result;
						}

						return track;
					}
				}

				function draw(trackName, points) {

					worker.postMessage({
						cmd: 'handle-overflow',
						tracks: tracks.map(function (track) {

							return {
								param: track.param,
								min: track.min,
								max: track.max
							};
						}),
						trackName: trackName,
						points: points
					});

					var promise = $q(function (resolve, reject) {
						waitTheWorker('handle-overflow', function (event) {
							resolve(event.data);
						}, false);
					});

					promise.then(function (data) {

						var points = data.points;
						var processedTrackName = data.trackName;

						tracks.map(function (track) {
							d3.select(element[0])
								.selectAll('.' + processedTrackName)
								.selectAll('#' + track.param)
								.attr('d', track.lineFunction(points[track.param]));
						});

					});

				}

				function listenToMouseMove() {

					//	'click'{
					//	'mousemove'

					d3.select(element[0]).selectAll('.overlay')
						.on('click', function () {
							moveCrosshair(d3.mouse(this)[0], d3.mouse(this)[1]);
							highligthPoints(d3.mouse(this)[0], d3.mouse(this)[1]);
						}).on('mousemove', function () {
							moveCrosshair(d3.mouse(this)[0], d3.mouse(this)[1]);
						});

				}

				function highligthPoints(mouseXPosition, mouseYPosition) {

					var timeAxisPosition = null;
					var timestamp = null;
					var avgPoint;
					var avgSize;

					if (!isHorizontal) {
						timeAxisPosition = mouseYPosition;
						timestamp = scope.zoomScale.invert(mouseYPosition);
					} else {
						timeAxisPosition = mouseXPosition;
						timestamp = scope.zoomScale.invert(mouseXPosition);
					}

					if (isHorizontal) {
						avgSize = scope.svg.viewWidth / 3;

						if (timeAxisPosition > scope.svg.viewWidth / 2)
							avgPoint = (0 + timeAxisPosition) / 2;
						else
							avgPoint = (scope.svg.viewWidth + timeAxisPosition) / 2;

					} else {
						avgSize = scope.svg.viewHeight / 3;

						if (timeAxisPosition > scope.svg.viewHeight / 2)
							avgPoint = (0 + timeAxisPosition) / 2;
						else
							avgPoint = (scope.svg.viewHeight + timeAxisPosition) / 2;
					}

					d3.select(element[0]).selectAll('#crosshair1')
						.attr('stroke-width', avgSize)
						.attr(((!isHorizontal) ? 'y1' : 'x1'), avgPoint)
						.attr(((!isHorizontal) ? 'y2' : 'x2'), avgPoint);

					findPoint(timestamp, timeAxisPosition, avgPoint);

				}

				function moveCrosshair(mouseXPosition, mouseYPosition) {

					var timeAxisPosition = null;

					if (!isHorizontal) {
						timeAxisPosition = mouseYPosition;
					} else {
						timeAxisPosition = mouseXPosition;
					}

					d3.select(element[0]).selectAll('#crosshair')
						.attr(((!isHorizontal) ? 'y1' : 'x1'), timeAxisPosition)
						.attr(((!isHorizontal) ? 'y2' : 'x2'), timeAxisPosition);

				}

				function findPoint(timestamp, position, avgPoint) {

					function findPointAVL(t) {

						worker.postMessage({
							cmd: 'find-point-avl',
							timestamp: timestamp,
							param: t.param,
							oldPoints: initialPoints,
							newPoints: scope.newPoints
						});

						waitTheWorker('find-point-avl', function (message) {

							var point = message.data.point.point;
							var param = message.data.param;
							var track;

							for (var i in tracks) {
								if (tracks[i].param == param) {
									track = tracks[i];
									break;
								}
							}

							var bubble = d3.select(element[0]).selectAll('#bubble-' + param);
							var tooltip = d3.select(element[0]).selectAll('#text-' + param);
							var tooltiplabel = d3.select(element[0]).selectAll('#text-label-' + param);

							bubble.attr('style', 'display: none');
							tooltip.attr('style', 'display: none');

							if (point && point.y != null) {

								var distance = Math.abs(track.max - track.min);

								while (point.y < track.min) {
									point.y += distance;
								}

								while (point.y > track.max) {
									point.y -= distance;
								}

								bubble.attr('style', null);
								tooltip.attr('style', null);

								if (!isHorizontal) {
									bubble.attr('transform', 'translate(' + track.trackScale(point.y) + ', ' + position + ')');
									// tooltip.attr('x', track.trackScale(point.y) );
									tooltip.attr('y', avgPoint);
									tooltiplabel.attr('y', avgPoint);
								} else {
									bubble.attr('transform', 'translate(' + position + ', ' + track.trackScale(point.y) + ')');
									tooltip.attr('x', avgPoint);
									tooltiplabel.attr('x', avgPoint);
									// tooltip.attr('y', track.trackScale(point.y) );
								}

								if (point.actual != null) {
									tooltip.text(format(point.actual) + ' (' + track.unitMeasure + ')');
								}

							} else {
								bubble.attr('style', 'display: none');
							}

						}, false);

					}

					tracks.map(findPointAVL);

				}

				function findPointOld(timestamp, position, avgPoint) {

					worker.postMessage({
						cmd: 'find-point',
						timestamp: timestamp,
						tracks: tracks.map(function (t) { return { param: t.param }; }),
						oldPoints: initialPoints,
						newPoints: scope.newPoints
					});

					var promise = $q(function (resolve, reject) {
						waitTheWorker('find-point', function (message) {
							if (message.data.cmd == 'find-point') {
								var reading = message.data.points;
								resolve(message.data.points);
							}
						}, false);
					});

					promise.then(function (reading) {

						tracks.map(function (track) {

							var bubble = d3.select(element[0]).selectAll('#bubble-' + track.param);
							var tooltip = d3.select(element[0]).selectAll('#text-' + track.param);
							var tooltiplabel = d3.select(element[0]).selectAll('#text-label-' + track.param);

							bubble.attr('style', 'display: none');
							tooltip.attr('style', 'display: none');

							var point = reading[track.param];

							if (point && point.y != null) {

								var distance = Math.abs(track.max - track.min);

								while (point.y < track.min) {
									point.y += distance;
								}

								while (point.y > track.max) {
									point.y -= distance;
								}

								bubble.attr('style', null);
								tooltip.attr('style', null);

								if (!isHorizontal) {
									bubble.attr('transform', 'translate(' + track.trackScale(point.y) + ', ' + position + ')');
									// tooltip.attr('x', track.trackScale(point.y) );
									tooltip.attr('y', avgPoint);
									tooltiplabel.attr('y', avgPoint);
								} else {
									bubble.attr('transform', 'translate(' + position + ', ' + track.trackScale(point.y) + ')');
									tooltip.attr('x', avgPoint);
									tooltiplabel.attr('x', avgPoint);
									// tooltip.attr('y', track.trackScale(point.y) );
								}

								if (point.actual != null) {
									tooltip.text(format(point.actual) + ' (' + track.unitMeasure + ')');
								}

							} else {
								bubble.attr('style', 'display: none');
							}

						});

					});

					return promise;

				}

				function openScaleModal() {
					$modal.open({
						animation: false,
						keyboard: false,
						backdrop: 'static',
						templateUrl: '../xpd-resources/ng/xpd.visualization/d3-dmec-chart-modal.template.html',
						controller: 'ModalUpdateDmecTracks',
						windowClass: 'change-scale-modal',
						resolve: {
							tracks: function () {
								return tracks;
							},
							onTracksChange: function () {
								return function () {
									location.reload();
								};
							},
						}
					});
				}
			}

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

	}

	module.controller('ModalUpdateDmecTracks', ModalUpdateDmecTracks);

	ModalUpdateDmecTracks.$inject = ['$scope', '$uibModalInstance', 'tracks', 'onTracksChange'];

	function ModalUpdateDmecTracks($scope, $modalInstance, tracks, onTracksChange) {

		$scope.viewData = {
			trackList: []
		};

		$scope.viewData.trackList = angular.copy(tracks);

		$scope.actionButtonConfirm = actionButtonConfirm;
		$scope.actionButtonClose = actionButtonClose;

		function actionButtonConfirm() {

			var trackChanged = false;

			// updating tracks
			for (var i in $scope.viewData.trackList) {
				if (+tracks[i].min != +$scope.viewData.trackList[i].min) {
					trackChanged = true;
					tracks[i].min = +$scope.viewData.trackList[i].min;
				}

				if (+tracks[i].max != +$scope.viewData.trackList[i].max) {
					trackChanged = true;
					tracks[i].max = +$scope.viewData.trackList[i].max;
				}
			}

			localStorage.setItem('xpd.admin.dmec.dmecTracks', JSON.stringify(tracks));

			if (trackChanged) {
				onTracksChange();
			}

			$modalInstance.close();
		}

		function actionButtonClose() {
			$modalInstance.close();
		}
	}

})();