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

		function workerCommand(name, data) {
			return {
				cmd: name,
				data: data
			};
		}

		function getRandomArbitrary(min, max) {
			return Math.floor(Math.random() * (max - min) + min);
		}

		function link(scope, element, attrs) {

			var oldWorker = scope.oldWorker = new Worker('../assets/js/dmec-worker.js');
			var newWorker = scope.newWorker = new Worker('../assets/js/dmec-worker.js');

			oldWorker.postMessage(workerCommand('start'));
			newWorker.postMessage(workerCommand('start'));

			var chartId = scope.chartId = getRandomArbitrary(100, 999) + '-' + getRandomArbitrary(100, 999) + '-' + getRandomArbitrary(100, 999);

			var threads = 4;
			var d3 = null;
			var colorScale = null;
			var format = null;
			var bisect = null;

			scope.horizontal = (attrs.horizontal == true || attrs.horizontal == 'true');

			$interval(getTick, 1000);

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

			$interval(scrollIfNeeded, 1000);
			d3Service.d3().then(d3Done);

			scope.openScaleModal = openScaleModal;

			function openScaleModal() {
				$modal.open({
					animation: false,
					keyboard: false,
					backdrop: 'static',
					templateUrl: 'app/components/dmec-log/change-scale.template.html',
					controller: 'ModalUpdateDmecTracks',
					windowClass: 'change-scale-modal',
					resolve: {
						tracks: getTracks
					}
				});

				function getTracks() {
					return scope.tracks;
				}
			}

			function d3Done(_d3) {
				d3 = _d3;
				listenToMouseMove();

				colorScale = d3.scale.category10();
				format = d3.format('.1f');
				bisect = d3.bisector(function (datum) { return datum.x; }).right;

				scope.$watch('startAt', function (startAt) {
					resize();
				});

				scope.$watch('endAt', function (endAt) {
					resize();
				});

				scope.$watch('zoomStartAt', function (zoomStartAt) {
					resize();
				});

				scope.$watch('zoomEndAt', function (zoomEndAt) {
					resize();
				});

				scope.$watch('readings', function (readings) {
					if (readings) {
						readingsFromDatabase(readings);
					}
				});

				scope.$watch('oldPoints', function (oldPoints) {
					if (oldPoints) {
						applyOverflow('oldPoints');
					}
				});

			}

			function listenToMouseMove() {

				d3.selectAll('.overlay')
					.on('mousemove', function () {
						var timestamp = null;
						if (!scope.horizontal) {
							timestamp = scope.timeScale.invert(d3.mouse(this)[1]);
						} else {
							timestamp = scope.timeScale.invert(d3.mouse(this)[0]);
						}
						mousemove(timestamp);
					});

			}

			function mousemove(timestamp) {

				d3.selectAll('#crosshair')
					.attr(((!scope.horizontal) ? 'y1' : 'x1'), scope.timeScale(timestamp))
					.attr(((!scope.horizontal) ? 'y2' : 'x2'), scope.timeScale(timestamp));

				for (var $index in scope.tracks) {

					try {

						var track = scope.tracks[$index];
						var bubble = d3.selectAll('#bubble-' + $index);
						var tooltip = d3.selectAll('#text-' + $index);

						var i = null;
						var startDatum = null;
						var endDatum = null;

						if (scope.newPoints && scope.newPoints[track.param] && scope.newPoints[track.param][0] && scope.newPoints[track.param][0].x <= timestamp) {
							i = bisect(scope.newPoints[track.param], timestamp);

							startDatum = scope.newPoints[track.param][i - 1];
							endDatum = scope.newPoints[track.param][i];

						} else if (scope.oldPoints && scope.oldPoints[track.param]) {
							i = bisect(scope.oldPoints[track.param], timestamp);

							startDatum = scope.oldPoints[track.param][i - 1];
							endDatum = scope.oldPoints[track.param][i];
						}

						var datum = [startDatum, endDatum].filter(function (_datum) {
							return (_datum && _datum.y);
						});

						var point = datum.sort(function (a, b) {
							return Math.abs(a.x - timestamp) - Math.abs(b.x - timestamp);
						})[0];


						if (point && point.y != null) {

							bubble.attr('style', null);
							if (!scope.horizontal)
								bubble.attr('transform', 'translate(' + track.trackScale(point.y) + ', ' + scope.timeScale(timestamp) + ')');
							else
								bubble.attr('transform', 'translate(' + scope.timeScale(timestamp) + ', ' + track.trackScale(point.y) + ')');

							tooltip
								.attr((!scope.horizontal) ? 'x' : 'y', track.trackScale(track.max) - track.trackScale(point.y))
								.attr((!scope.horizontal) ? 'y' : 'x', (track.labelPosition * 15));

							if (point.actual != null) {
								tooltip.text(format(point.actual) + ' (' + track.unitMeasure + ')');
							}

						}

					} catch (e) {
						bubble.attr('style', 'display: none');
					}

				}
			}

			function applyOverflow(trackName) {

				// document.getElementById('result').textContent = e.data;
				if (trackName == 'newPoints') {
					scope.newWorker.postMessage(workerCommand('applyOverflow', scope.tracks));
					scope.newWorker.addEventListener('message', function (e) {
						console.log({
							trackName: trackName,
							path: e.data
						});
					}, false);
				} else {
					scope.oldWorker.postMessage(workerCommand('applyOverflow', scope.tracks));
					scope.oldWorker.addEventListener('message', function (e) {
						console.log({
							trackName: trackName,
							path: e.data
						});
					}, false);
				}

				// scope.tracks.map(function (track) {

				// 	if (!scope[trackName]) {
				// 		scope[trackName] = {};
				// 	}
				// 	if (!scope[trackName + 'Path']) {
				// 		scope[trackName + 'Path'] = {};
				// 	}

				// 	if (scope[trackName] && scope[trackName][track.param]) {
				// 		scope[trackName][track.param] = handleOverflow(scope[trackName][track.param], track);
				// 		scope[trackName + 'Path'][track.param] = track.lineFunction(scope[trackName][track.param]);
				// 	}

				// });
			}

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

			function readingsFromDatabase(readings) {

				var oldPoints = {};

				var lastReadingTime = scope.lastReadingTime = null;

				scope.tracks.map(preparePoints);

				scope.lastReadingTime = lastReadingTime;

				function preparePoints(track) {

					oldPoints[track.param] = readings.map(convertToXY);

					function convertToXY(point) {

						if (!lastReadingTime || lastReadingTime < point.timestamp) {
							lastReadingTime = point.timestamp;
						}

						return {
							x: point.timestamp,
							y: point[track.param] || null,
							actual: point[track.param] || null
						};
					}

					return track;
				}

				scope.oldPoints = oldPoints;

				resize();
			}

			function getTick() {
				if (scope.lastReadingTime != null) {
					readingSetupAPIService.getTick(scope.lastReadingTime, onNewReading);
					scope.lastReadingTime += 1000;
					scope.endAt = new Date(scope.lastReadingTime);
				}
			}

			function onNewReading(currentReading) {

				if (scope.tracks)
					scope.tracks.map(preparePoints);

				applyOverflow('newPoints');

				function preparePoints(track) {

					if (!scope.newPoints) {
						scope.newPoints = {};
					}

					if (!scope.newPoints[track.param]) {
						scope.newPoints[track.param] = [];
					}

					scope.newPoints[track.param].push({
						x: currentReading.timestamp,
						y: currentReading[track.param] || null,
						actual: currentReading[track.param] || null
					});

					return track;
				}

				resize();

			}

			function resize() {

				var zoomStartAt = (scope.zoomStartAt) ? scope.zoomStartAt : scope.startAt;
				var zoomEndAt = (scope.zoomEndAt) ? scope.zoomEndAt : scope.endAt;

				var viewWidth = element[0].clientWidth;
				var viewHeight = element[0].offsetHeight;

				var zoomScale = d3.scale.linear()
					.domain([
						zoomStartAt.getTime(),
						zoomEndAt.getTime(),
					])
					.range([
						0,
						scope.horizontal ? viewWidth : viewHeight
					]);

				var timeAxisSize = zoomScale(scope.endAt.getTime()) - zoomScale(scope.startAt.getTime());

				scope.timeScale = d3.scale.linear()
					.domain([
						scope.startAt.getTime(),
						scope.endAt.getTime(),
					])
					.range([
						0,
						timeAxisSize * 0.95
					]);

				scope.svg = {
					viewWidth: (scope.horizontal) ? timeAxisSize : viewWidth,
					viewHeight: (scope.horizontal) ? viewHeight : timeAxisSize,
					xTicks: scope.timeScale.ticks()
				};

				scope.tracks = scope.tracks.map(createPath);

				applyOverflow('oldPoints');
				applyOverflow('newPoints');
			}



			function trackXPosition(trackIndex) {

				var numberOfTracks = scope.tracks.length;
				var tracksPerThread = Math.ceil(numberOfTracks / threads);
				var relative = Math.floor(trackIndex / tracksPerThread) / threads;

				return (relative * ((scope.horizontal) ? scope.svg.viewHeight : scope.svg.viewWidth));
			}

			function createPath(track, index) {

				track.color = colorScale(index);

				var trackIndex = index;
				var startAt = trackXPosition(trackIndex);
				var endAt = trackXPosition(++trackIndex);

				while (startAt == endAt) {
					endAt = trackXPosition(++trackIndex);
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
					if (!scope.horizontal)
						return trackScale(d.y);
					else
						return scope.timeScale(d.x);
				}

				function scaleTime(d) {
					if (!scope.horizontal)
						return scope.timeScale(d.x);
					else
						return trackScale(d.y);
				}

				return track;
			}

			function scrollIfNeeded() {

				var container = document.getElementById(chartId);
				container.addEventListener('scroll', moveLegend);

				if (!scope.horizontal) {
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

				moveLegend();
			}

			function moveLegend() {
				var container = document.getElementById(chartId);
				var legend = d3.selectAll('.label');

				if (!scope.horizontal) {
					legend.attr('transform', 'translate(0, ' + container.scrollTop + ')');
				} else {
					legend.attr('transform', 'translate(' + container.scrollLeft + ', 0)');
				}
			}

		}

	}
	function ModalUpdateDmecTracks($scope, $modalInstance, tracks) {

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

			$modalInstance.close();
		}

		function actionButtonClose() {
			$modalInstance.close();
		}
	}

})();