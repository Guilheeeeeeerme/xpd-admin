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
				zoomStartAt: '=',
				onEndAtChange: '=',
				zoomEndAt: '=',
				readings: '=',
				autoScroll: '='
			},
			link: link
		};		

		function BTree(){
			this.values = [];
		}

		BTree.prototype.insert(point, index){

			if(index == null){
				index = 0;
			}

			if(!this.values || this,values.length == 0){
				this.values = [point];
			}else if(this.values[index] == null || point.x == this.values[index].x){
				this.values[index] = point;
			}else if(point.x > this.values[index].x){
				this.insert(point, ((index * 2) + 2) )
			}else{
				this.insert(point, ((index * 2) + 1) )
			}
		}

		function getRandomArbitrary(min, max) {
			return Math.floor(Math.random() * (max - min) + min);
		}

		function link(scope, element, attrs) {

			scope.element = element[0];

			var bTree = {};
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

				$interval(getTick, updateLatency);
				$interval(scrollIfNeeded, updateLatency, isHorizontal);

				scope.$watch('startAt', onDateRangeChange);
				scope.$watch('endAt', onDateRangeChange);
				scope.$watch('zoomStartAt', onDateRangeChange);
				scope.$watch('zoomEndAt', onDateRangeChange);

				scope.$watch('readings', recomputeOldPoints);

				scope.openScaleModal = openScaleModal;
				scope.listenToMouseMove = listenToMouseMove;
				scope.updateTracks = updateTracks;

				function onDateRangeChange(newDate, oldDate) {
					//console.log('On Date Range Change');
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

						scope.lastReadingTime += updateLatency;

						if (!scope.endAt || new Date(scope.endAt) < scope.lastReadingTime) {
							scope.endAt = scope.lastReadingTime;
							scope.onEndAtChange && scope.onEndAtChange(scope.endAt);
						}
					}
				}

				function onCurrentReading(currentReading) {

					try {
						scope.currentReadings.push(currentReading);
					} catch (e) {
						scope.currentReadings = [currentReading];
					}

					scope.newPoints = readingsToPoints(scope.currentReadings, scope.tracks);
					applyOverflow('newPoints');

				}

				function recomputeOldPoints() {

					if (scope.readings) {
						scope.readings.map(function (reading) {
							if (!scope.lastReadingTime || scope.lastReadingTime < reading.timestamp) {
								scope.lastReadingTime = reading.timestamp;
							}
							return reading;
						});
					}

					scope.oldPoints = readingsToPoints(scope.readings, scope.tracks);
					applyOverflow('oldPoints');
				}

				function resize(horizontal) {
					//console.log('Resize');

					try {

						var zoomStartAt = (scope.zoomStartAt) ? scope.zoomStartAt : scope.startAt;
						var zoomEndAt = (scope.zoomEndAt) ? scope.zoomEndAt : scope.endAt;

						zoomStartAt = new Date(zoomStartAt);
						zoomEndAt = new Date(zoomEndAt);

						var viewWidth = scope.element.clientWidth;
						var viewHeight = scope.element.offsetHeight;

						var zoomScale = d3.time.scale()
							.domain([
								zoomStartAt,
								zoomEndAt,
							])
							.range([
								0,
								horizontal ? viewWidth : viewHeight
							]);

						var timeAxisSize = zoomScale(new Date(scope.endAt)) - zoomScale(new Date(scope.startAt));

						scope.timeScale = d3.time.scale()
							.domain([
								new Date(scope.startAt),
								new Date(scope.endAt),
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
						console.error(e);
					}
				}

				function readingsToPoints(readings, tracks) {

					var points = {};

					if (!tracks || !readings) {
						return points;
					}

					readings.map(preparePoints);

					tracks.map(function (track) {

						if(!bTree[track.param]){
							bTree[track.param] = new BTree();
						}

						bTree[track.param].insert(points[track.param]);

						// bTree[track.param] = d3.scale.linear()
						// 	.domain(points[track.param].map(function (point) {
						// 		return point.timestamp;
						// 	}))
						// 	.range(points[track.param]);

					});

					function preparePoints(point) {

						tracks.map(convertToXY);

						function convertToXY(track) {

							if (!points[track.param]) {
								points[track.param] = [];
							}

							points[track.param].push({
								x: point.timestamp,
								y: point[track.param] || null,
								actual: point[track.param] || null
							});

						}

					}

					return points;
				}

				function listenToMouseMove(horizontal) {
					console.log('listenToMouseMove');

					d3.select(scope.element).selectAll('.overlay')
						// .on('mouseup', mouseEvent)
						// .on('mouseover', mouseEvent)
						// .on('mouseenter', mouseEvent)
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

						// onMousemove(timestamp, position);

					}

					function onMousemove(timestamp, position) {

						scope.tracks.map(function (track, trackIndex) {

							try {

								var bubble = d3.select(scope.element).selectAll('#bubble-' + trackIndex);
								var tooltip = d3.select(scope.element).selectAll('#text-' + trackIndex);
								var point = null;

								if (scope.newPoints && scope.newPoints[track.param] && scope.newPoints[track.param][0] && scope.newPoints[track.param][0].x <= timestamp) {
									point = scope.newPoints.bTree[track.param](timestamp);
								} else if (scope.oldPoints && scope.oldPoints[track.param]) {
									point = scope.oldPoints.bTree[track.param](timestamp);
								}

								console.log(point);

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

								}else{
									bubble.attr('style', 'display: none');
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
					track.labelStartAt = startAt;
					track.labelEndAt = endAt;

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