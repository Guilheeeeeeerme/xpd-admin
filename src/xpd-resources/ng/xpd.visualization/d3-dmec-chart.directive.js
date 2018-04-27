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
				zoomStartAt: '=',
				endAt: '=',
				onReading: '=',
				zoomEndAt: '=',
				readings: '=',
				autoScroll: '=',
				connectionEvents: '=',
				tripEvents: '=',
				timeEvents: '='
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

				$interval(regularVerifications, updateLatency, isHorizontal);

				scope.openScaleModal = openScaleModal;
				scope.listenToMouseMove = listenToMouseMove;
				scope.updateTracks = updateTracks;
				
				/** Realtime */
				scope.$watch('onReading', onReadingChange);

				function onReadingChange(onReading) {
					if (onReading) {
						onReading.then(onCurrentReading);
					}
				}

				function onCurrentReading(currentReading) {

					if(!scope.currentReadings){
						scope.currentReadings = [];
					}

					scope.currentReadings.push(currentReading);

					drawNewPoints();
				}

				function drawNewPoints() {
					readingsToPoints(scope.currentReadings, scope.tracks).then(function (newPoints) {
						scope.newPoints = newPoints;

						// if(!scope.newPoints){
						// 	scope.newPoints = newPoints;
						// }

						// for(var attr in newPoints){
						// 	if(!scope.newPoints[attr]){
						// 		scope.newPoints[attr] = newPoints[attr];
						// 	}else{
						// 		scope.newPoints[attr].push(newPoints[attr].pop());
						// 	}
						// }

						draw('newPoints');
					
					});
				}

				/** 
				 * Readings history 
				 */
				scope.$watch('readings', onReadingsListReady);

				function onReadingsListReady() {
					drawOldPoints();
				}

				function drawOldPoints() {

					readingsToPoints(scope.readings, scope.tracks).then(function (oldPoints) {
						scope.oldPoints = oldPoints;
						draw('oldPoints');
					});
				}

				/** 
				 * Atemporal 
				 */
				scope.$watch('zoomStartAt', onZoomChange);
				scope.$watch('zoomEndAt', onZoomChange);
				scope.$watch('startAt', onDateRangeChange);
				scope.$watch('endAt', onDateRangeChange);

				function onZoomChange() {
					onDateRangeChange();
				}

				function onDateRangeChange(newDate, oldDate) {
					buildTimeAxis(isHorizontal);
				}

				/**
				 * When Tracks Change
				 */
				scope.$watch('tracks', updateTracks);

				function buildTimeAxis(horizontal) {

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

					var timeAxisSize = timeScale(endAt) - timeScale(startAt);

					scope.svg = {
						viewWidth: (horizontal) ? timeAxisSize : viewWidth,
						viewHeight: (horizontal) ? viewHeight : timeAxisSize
					};

					scope.timeScale = timeScale;
					scope.xTicks = timeScale.ticks(6);

					updateTracks();
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

				function updateTracks() {

					if(!scope.tracks){
						return;
					}

					scope.$tracks = scope.tracks.map(function (track, index) {
						return configTrackProperties(track, index, isHorizontal);
					});
					
					try { draw('oldPoints'); } catch(e){  }
					try { draw('newPoints'); } catch(e){  }

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
							.interpolate('linear');

						track.id = index;
						track.lineFunction = lineFunction;
						track.trackScale = trackScale;
						track.ticks = trackScale.ticks(5);

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

							var viewWidth = scope.element.clientWidth;
							var viewHeight = scope.element.offsetHeight;

							var numberOfTracks = scope.tracks.length;
							var tracksPerThread = Math.ceil(numberOfTracks / threads);
							var relative = Math.floor(trackIndex / tracksPerThread) / threads;
							var result = (relative * ((horizontal) ? viewHeight : viewWidth));
							return result;
						}

						return track;
					}
				}

				function draw(trackName) {

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

						var promise = new Promise(function (resolve, reject) {
							worker.addEventListener('message', function (event) {
								if (event.data.cmd == 'handle-overflow') {
									resolve(event.data);
								}
							}, false);
						});


						promise.then(function (data) {

							var points = data.points;
							var processedTrackName = data.trackName;

							scope.tracks.map(function (track) {
								d3.select(scope.element)
									.selectAll('.' + processedTrackName)
									.selectAll('#' + track.param)
									.attr('d', track.lineFunction(points[track.param]));
							});

						});

					}

				}

				function listenToMouseMove(horizontal) {
					// console.log('listenToMouseMove');

					d3.select(scope.element).selectAll('.overlay')
						.on('mousemove', mousemove);

					function mousemove() {

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

						worker.postMessage({
							cmd: 'find-point',
							timestamp: timestamp,
							tracks: scope.tracks.map(function (t) { return { param: t.param }; }),
							oldPoints: scope.oldPoints,
							newPoints: scope.newPoints
						});

						var promise = new Promise(function (resolve, reject) {
							worker.addEventListener('message', function (event) {
								if (event.data.cmd == 'find-point') {
									var reading = event.data.points;
									resolve(event.data.points);
								}
							}, false);
						});

						promise.then(function (reading) {

							scope.tracks.map(function (track, trackIndex) {

								var bubble = d3.select(scope.element).selectAll('#bubble-' + trackIndex);
								var tooltip = d3.select(scope.element).selectAll('#text-' + trackIndex);

								bubble.attr('style', 'display: none');
								tooltip.attr('style', 'display: none');

								var point = reading[track.param];

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

							});
						});

					}

				}

				function getScrollContainer() {
					return document.getElementById(chartId);
				}

				function regularVerifications(horizontal) {
					scrollIfNeeded(horizontal);
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

			$modalInstance.close();
		}

		function actionButtonClose() {
			$modalInstance.close();
		}
	}

})();