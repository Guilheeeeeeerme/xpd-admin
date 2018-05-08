(function () {
	'use strict';

	var module = angular.module('xpd.visualization');
	var worker = new Worker('../assets/js/dmec-worker.js');

	module.directive('d3DmecChart', d3DmecChart);

	d3DmecChart.$inject = ['d3Service', '$interval', '$q', '$uibModal'];

	function d3DmecChart(d3Service, $interval, $q, $modal) {
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

			d3Service.d3().then(d3Done);

			function d3Done(d3) {

				var tracks = getDefaultTracks();

				var threads = (!isNaN(Number(attrs.threads))) ? Number(attrs.threads) : 4;
				var colorScale = d3.scale.category10();
				var format = d3.format('.1f');
				var isHorizontal = scope.horizontal = (attrs.horizontal == true || attrs.horizontal == 'true');

				scope.svg = {
					viewWidth: element[0].clientWidth,
					viewHeight: element[0].offsetHeight
				};

				scope.timeScale = d3.time.scale()
					.domain([
						new Date(scope.startAt),
						new Date(scope.endAt),
					])
					.range([
						0,
						isHorizontal ? (scope.svg.viewWidth) : (scope.svg.viewHeight)
					]);

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
				scope.$watch('zoomStartAt', handleZoom, true);
				scope.$watch('zoomEndAt', handleZoom, true);

				scope.openScaleModal = openScaleModal;
				scope.listenToMouseMove = listenToMouseMove;

				buildTracksAxis();

				/**
				 * Real Time Readings
				 */
				function onReadingChange(onReading) {

					if (onReading) {

						onReading.then(function (currentReading) {

							if (!scope.currentReadings) {
								scope.currentReadings = [];
							}

							scope.currentReadings.push(currentReading);

							readingsToPoints(scope.currentReadings, tracks).then(function (points) {
								scope.newPoints = points;
								draw('newPoints');
							});

						});
					}
				}

				/**
				 * Real History
				 */
				function onReadingSinceChange(onReadingSince) {
					if (onReadingSince) {
						onReadingSince.then(function (readings) {

							readingsToPoints(readings, tracks).then(function (points) {
								scope.oldPoints = points;
								draw('oldPoints');
							});

						});
					}
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

					if (isHorizontal) {
						scope.viewBox = scope.timeScale(scope.zoomStartAt) + ' 0 ' + scope.zoomArea + ' ' + scope.svg.viewHeight;
					} else {
						scope.viewBox = '0 ' + scope.timeScale(scope.zoomStartAt) + ' ' + scope.svg.viewWidth + ' ' + scope.zoomArea;
					}

					scope.timeTicks = scope.zoomScale.ticks(6);

				}

				function buildTracksAxis() {

					if (!localStorage.dmecTracks) {
						localStorage.dmecTracks = JSON.stringify(getDefaultTracks());
					}

					tracks = JSON.parse(localStorage.dmecTracks);

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

						var trackScale = d3.scale.linear()
							.domain([track.min, track.max])
							.range([
								labelStartAt + ((labelEndAt - labelStartAt) * 0.01),
								labelEndAt - ((labelEndAt - labelStartAt) * 0.01)
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

				function draw(trackName) {

					if (scope[trackName]) {

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

							tracks.map(function (track) {
								d3.select(element[0])
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

					d3.select(element[0]).selectAll('.overlay')
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

						d3.select(element[0]).selectAll('#crosshair')
							.attr(((!isHorizontal) ? 'y1' : 'x1'), position)
							.attr(((!isHorizontal) ? 'y2' : 'x2'), position);

						onMousemove(timestamp, position);

					}

					function onMousemove(timestamp, position) {

						worker.postMessage({
							cmd: 'find-point',
							timestamp: timestamp,
							tracks: tracks.map(function (t) { return { param: t.param }; }),
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

							tracks.map(function (track) {

								var bubble = d3.select(element[0]).selectAll('#bubble-' + track.param);
								var tooltip = d3.select(element[0]).selectAll('#text-' + track.param);

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
										// tooltip.attr('y', position );
									} else {
										bubble.attr('transform', 'translate(' + position + ', ' + track.trackScale(point.y) + ')');
										// tooltip.attr('x', position );
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
								return tracks;
							},
							onTracksChange: function () {
								return function () {
									buildTracksAxis();
									draw('newPoints');
									draw('oldPoints');
								};
							},
						}
					});
				}
			}

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

			localStorage.dmecTracks = JSON.stringify(tracks);

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