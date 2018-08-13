import * as angular from 'angular';
import { IModalService } from 'angular-ui-bootstrap';
import * as d3 from 'd3';
import modalTemplate from './d3-dmec-chart-modal.template.html';
import template from './d3-dmec-chart.template.html';

export class D3DMECChartDirective implements ng.IDirective {
	public static $inject = ['$q', '$window', '$uibModal'];

	public static Factory(): ng.IDirectiveFactory {
		return (
			$q: ng.IQService,
			$window: angular.IWindowService,
			$uibModal: IModalService) => new D3DMECChartDirective($q, $window, $uibModal);
	}
	public restrict = 'E';
	public template = template;
	public scope = {
		actualStartAt: '=',
		zoomStartAt: '=',
		zoomEndAt: '=',
		onReading: '=',
		onReadingSince: '=',
		setSelectedPoint: '=',
		lastSelectedPoint: '=',
		removeMarker: '=',
	};

	constructor(
		private $q: ng.IQService,
		private $window: angular.IWindowService,
		private $modal: IModalService) { }

	public link: ng.IDirectiveLinkFn = (
		scope: any,
		element: ng.IAugmentedJQuery,
		attrs: ng.IAttributes,
		ctrl: any,
	) => {
		const vm = this;

		const worker = new Worker('./d3-dmec-chart.worker/d3-dmec-chart.worker.js');

		if (!localStorage.getItem('xpd.admin.dmec.dmecTracks')) {
			localStorage.setItem('xpd.admin.dmec.dmecTracks', JSON.stringify(this.getDefaultTracks()));
		}

		const tracks = JSON.parse(localStorage.getItem('xpd.admin.dmec.dmecTracks'));
		let threads = (!isNaN(Number(attrs.threads))) ? Number(attrs.threads) : 4;
		threads = Math.min(Math.abs(threads), tracks.length);

		const isHorizontal = scope.horizontal = (attrs.horizontal === true || attrs.horizontal === 'true');

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

					createChart(readings);

				});
			}
		}

		function waitTheWorker(subject, callback) {

			worker[subject] = callback;

			if (!scope.workerIsListening) {

				scope.workerIsListening = true;

				worker.addEventListener('message', function (message) {
					worker[message.data.cmd](message);
				}, false);

			}

		}

		function createChart(initialPoints) {

			let readings = [];
			const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
			const format = d3.format('.1f');

			scope.svg = {
				viewWidth: element[0].clientWidth || 200,
				viewHeight: element[0].offsetHeight || 200,
			};

			scope.openScaleModal = openScaleModal;
			scope.listenToMouseMove = listenToMouseMove;

			scope.timeScale = d3.scaleTime()
				.domain([
					new Date(scope.actualStartAt),
					new Date(),
				])
				.range([
					0,
					isHorizontal ? (scope.svg.viewWidth) : (scope.svg.viewHeight),
				]);

			/**
			* selected Points
			*/
			scope.$watch('lastSelectedPoint', function (point) {

				if (!point) { return; }

				findPoint(point.timestamp, point.xPosition, null);

			}, true);

			scope.$watch('removeMarker', function (timestamp) {

				if (!timestamp) { return; }

				d3.select(element[0]).selectAll('.marker-' + timestamp).remove();
				d3.select(element[0]).selectAll('.line-' + timestamp).remove();

			}, true);

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

			// tslint:disable-next-line:no-shadowed-variable
			function readingsToPoints(readings, tracks) {

				return vm.$q(function (resolve, reject) {

					if (tracks != null && tracks.length > 0 && readings != null && readings.length > 0) {

						worker.postMessage({
							cmd: 'reading-to-points',
							tracks: tracks.map(function (t) { return { param: t.param }; }),
							readings,
						});

						waitTheWorker('reading-to-points', function (message) {
							resolve(message.data.points);
						});

					}

				});

			}

			function handleZoom() {

				scope.zoomScale = d3.scaleTime()
					.domain([
						new Date(scope.zoomStartAt),
						new Date(scope.zoomEndAt),
					])
					.range([
						0,
						isHorizontal ? (scope.svg.viewWidth) : (scope.svg.viewHeight),
					]);

				scope.zoomArea = (scope.timeScale(scope.zoomEndAt) - scope.timeScale(scope.zoomStartAt));

				let viewBox;

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

			// tslint:disable-next-line:no-shadowed-variable
			function configTracks(tracks) {

				scope.$tracks = tracks.map(function (track, index) {
					return configTrackProperties(track, index, isHorizontal);
				});

				// tslint:disable-next-line:no-shadowed-variable
				function configTrackProperties(track, index, isHorizontal) {

					track.color = colorScale(index);

					let trackIndex = index;
					const labelStartAt = trackPosition(trackIndex);
					let labelEndAt = trackPosition(++trackIndex);

					while (labelStartAt === labelEndAt) {
						labelEndAt = trackPosition(++trackIndex);
					}

					track.labelPosition = index % (tracks.length / threads);
					track.labelStartAt = labelStartAt;
					track.labelEndAt = labelEndAt;

					let trackScale;
					const margin = 0;

					if (isHorizontal) {

						trackScale = d3.scaleLinear()
							.domain([
								track.min,
								track.max,
							])
							.range([
								Math.max(labelEndAt, labelStartAt) - (Math.abs(labelEndAt - labelStartAt) * margin),
								Math.min(labelEndAt, labelStartAt) + (Math.abs(labelEndAt - labelStartAt) * margin),
							]);

					} else {

						trackScale = d3.scaleLinear()
							.domain([
								track.min,
								track.max,
							])
							.range([
								Math.min(labelEndAt, labelStartAt) + (Math.abs(labelEndAt - labelStartAt) * margin),
								Math.max(labelEndAt, labelStartAt) - (Math.abs(labelEndAt - labelStartAt) * margin),
							]);

					}

					const lineFunction = d3.line()
						.defined(isNumber)
						.x(scaleValue)
						.y(scaleTime)
						.curve(d3.curveStepAfter);

					track.id = index;
					track.lineFunction = lineFunction;
					track.trackScale = trackScale;
					track.ticks = [track.max, track.min];

					function isNumber(d) {

						const isDefined = (d.y != null && d.x != null);
						// tslint:disable-next-line:no-shadowed-variable
						const isNumber = (angular.isNumber(d.y) && angular.isNumber(d.x));

						return isDefined && isNumber;
					}

					function scaleValue(d) {
						let x;
						if (!isHorizontal) {
							x = trackScale(d.y);
						} else {
							x = scope.timeScale(d.x);
						}

						return x;
					}

					function scaleTime(d) {
						let y;
						if (!isHorizontal) {
							y = scope.timeScale(d.x);
						} else {
							y = trackScale(d.y);
						}

						return y;
					}

					// tslint:disable-next-line:no-shadowed-variable
					function trackPosition(trackIndex) {

						const viewWidth = scope.svg.viewWidth;
						const viewHeight = scope.svg.viewHeight;

						const numberOfTracks = tracks.length;
						const tracksPerThread = Math.ceil(numberOfTracks / threads);
						const relative = Math.floor(trackIndex / tracksPerThread) / threads;
						const result = (relative * ((isHorizontal) ? viewHeight : viewWidth));

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
							max: track.max,
						};
					}),
					trackName,
					points,
				});

				const promise = vm.$q(function (resolve, reject) {
					waitTheWorker('handle-overflow', function (event) {
						resolve(event.data);
					});
				});

				promise.then(function (data: any) {

					// tslint:disable-next-line:no-shadowed-variable
					const points = data.points;
					const processedTrackName = data.trackName;

					tracks.map(function (track) {
						d3.select(element[0])
							.selectAll('.' + processedTrackName)
							.selectAll('#' + track.param)
							.attr('d', track.lineFunction(points[track.param]));
					});

				});

			}

			function listenToMouseMove() {

				// 	'click'{
				// 	'mousemove'

				// TODO: TAVA DANDO ZICA NO TYPESCRIPT SEM O TRY

				d3.select(element[0]).selectAll('.overlay')
					.on('click', onClick)
					.on('mousemove', onMouseMove);

				function onClick() {
					// moveCrosshair(d3.mouse(this)[0], d3.mouse(this)[1]);
					// highligthPoints(d3.mouse(this)[0], d3.mouse(this)[1]);
					const selectedPoint = wrapSelectedPoint(d3.mouse(this)[0], d3.mouse(this)[1]);
					scope.setSelectedPoint(selectedPoint);
				}

				function onMouseMove() {
					moveCrosshair(d3.mouse(this)[0], d3.mouse(this)[1]);
				}

			}

			function wrapSelectedPoint(xPosition, yPosition) {
				return {
					xPosition: xPosition,
					yPosition: yPosition,
					timestamp: scope.zoomScale.invert(xPosition),
				};
			}

			// function highligthPoints(mouseXPosition, mouseYPosition) {

			// 	let timeAxisPosition = null;
			// 	let timestamp = null;
			// 	let avgPoint;
			// 	let avgSize;

			// 	if (!isHorizontal) {
			// 		timeAxisPosition = mouseYPosition;
			// 		timestamp = scope.zoomScale.invert(mouseYPosition);
			// 	} else {
			// 		timeAxisPosition = mouseXPosition;
			// 		timestamp = scope.zoomScale.invert(mouseXPosition);
			// 	}

			// 	if (isHorizontal) {
			// 		avgSize = scope.svg.viewWidth / 3;

			// 		if (timeAxisPosition > scope.svg.viewWidth / 2) {
			// 			avgPoint = (0 + timeAxisPosition) / 2;
			// 		} else {
			// 			avgPoint = (scope.svg.viewWidth + timeAxisPosition) / 2;
			// 		}

			// 	} else {
			// 		avgSize = scope.svg.viewHeight / 3;

			// 		if (timeAxisPosition > scope.svg.viewHeight / 2) {
			// 			avgPoint = (0 + timeAxisPosition) / 2;
			// 		} else {
			// 			avgPoint = (scope.svg.viewHeight + timeAxisPosition) / 2;
			// 		}
			// 	}

			// 	d3.select(element[0]).selectAll('#crosshair1')
			// 		.attr('stroke-width', avgSize)
			// 		.attr(((!isHorizontal) ? 'y1' : 'x1'), avgPoint)
			// 		.attr(((!isHorizontal) ? 'y2' : 'x2'), avgPoint);

			// 	findPoint(timestamp, timeAxisPosition, avgPoint);

			// }

			function moveCrosshair(mouseXPosition, mouseYPosition) {

				let timeAxisPosition = null;

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

				tracks.map(findPointAVL);

				function findPointAVL(t) {

					worker.postMessage({
						cmd: 'find-point-avl',
						timestamp,
						param: t.param,
						oldPoints: initialPoints,
						newPoints: scope.newPoints,
					});

					waitTheWorker('find-point-avl', function (message) {

						const point = message.data.point.point;
						const param = message.data.param;
						let track;

						for (const i in tracks) {
							if (tracks[i].param === param) {
								track = tracks[i];
								break;
							}
						}

						if (point && point.y != null) {
							drawBubbles();
						}

						function drawBubbles() {

							const bubbleContent = d3.select(element[0]).selectAll('.bubbles');
							const line = d3.select(element[0]).selectAll('.line-' + scope.lastSelectedPoint.timestamp).nodes();

							const groupBublle = bubbleContent.append('g')
								.attr('class', 'marker-' + scope.lastSelectedPoint.timestamp)
								.attr('transform', 'translate(' + position + ', ' + track.trackScale(point.y) + ')');

							groupBublle.append('circle')
								.attr('r', '5')
								.attr('fill', 'none')
								.attr('stroke-width', '2')
								.attr('stroke', track.color);

							// Garante que apenas uma linha de um ponto seja desenhada
							if (line.length === 0) {

								bubbleContent.append('line')
									.attr('class', 'line-' + scope.lastSelectedPoint.timestamp)
									.attr('x1', position)
									.attr('x2', position)
									.attr('y1', 0)
									.attr('y2', scope.svg.viewHeight)
									.attr('stroke', scope.lastSelectedPoint.color);
							}
						}

						// const bubble = d3.select(element[0]).selectAll('#bubble-' + param);
						// const tooltip = d3.select(element[0]).selectAll('#text-' + param);
						// const tooltiplabel = d3.select(element[0]).selectAll('#text-label-' + param);

						// bubble.attr('style', 'display: none');
						// tooltip.attr('style', 'display: none');

						// if (point && point.y != null) {

						// 	const distance = Math.abs(track.max - track.min);

						// 	while (point.y < track.min) {
						// 		point.y += distance;
						// 	}

						// 	while (point.y > track.max) {
						// 		point.y -= distance;
						// 	}

						// 	bubble.attr('style', null);
						// 	tooltip.attr('style', null);

						// 	if (!isHorizontal) {
						// 		bubble.attr('transform', 'translate(' + track.trackScale(point.y) + ', ' + position + ')');
						// 		// tooltip.attr('x', track.trackScale(point.y) );
						// 		tooltip.attr('y', avgPoint);
						// 		tooltiplabel.attr('y', avgPoint);
						// 	} else {
						// 		bubble.attr('transform', 'translate(' + position + ', ' + track.trackScale(point.y) + ')');
						// 		tooltip.attr('x', avgPoint);
						// 		tooltiplabel.attr('x', avgPoint);
						// 		// tooltip.attr('y', track.trackScale(point.y) );
						// 	}

						// 	if (point.actual != null) {
						// 		tooltip.text(format(point.actual) + ' (' + track.unitMeasure + ')');
						// 	}

						// } else {
						// 	bubble.attr('style', 'display: none');
						// }

					});

				}

			}

			function findPointOld(timestamp, position, avgPoint) {

				worker.postMessage({
					cmd: 'find-point',
					timestamp,
					tracks: tracks.map(function (t) { return { param: t.param }; }),
					oldPoints: initialPoints,
					newPoints: scope.newPoints,
				});

				const promise = vm.$q(function (resolve, reject) {
					waitTheWorker('find-point', function (message) {
						if (message.data.cmd === 'find-point') {
							const reading = message.data.points;
							resolve(message.data.points);
						}
					});
				});

				promise.then(function (reading) {

					tracks.map(function (track) {

						const bubble = d3.select(element[0]).selectAll('#bubble-' + track.param);
						const tooltip = d3.select(element[0]).selectAll('#text-' + track.param);
						const tooltiplabel = d3.select(element[0]).selectAll('#text-label-' + track.param);

						bubble.attr('style', 'display: none');
						tooltip.attr('style', 'display: none');

						const point = reading[track.param];

						if (point && point.y != null) {

							const distance = Math.abs(track.max - track.min);

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
				vm.$modal.open({
					animation: false,
					keyboard: false,
					backdrop: 'static',
					template: modalTemplate,
					controller: 'D3DMECChartModalController',
					windowClass: 'change-scale-modal',
					resolve: {
						tracks() {
							return tracks;
						},
						onTracksChange() {
							return () => {
								vm.$window.location.reload();
							};
						},
					},
				});
			}
		}

	}

	private getDefaultTracks() {

		return [{
			label: 'BLOCK POSITION',
			min: -10,
			max: 50,
			unitMeasure: 'm',
			param: 'blockPosition',
			nextParam: true,
		}, {
			label: 'RATE OF PENETRATION',
			min: 0,
			max: 100,
			unitMeasure: 'm/hr',
			param: 'rop',
			nextParam: false,
		}, {
			label: 'WOB',
			min: -10,
			max: 40,
			unitMeasure: 'klbf',
			param: 'wob',
			nextParam: true,
		}, {
			label: 'HOOKLOAD',
			min: -10,
			max: 500,
			unitMeasure: 'klbf',
			param: 'hookload',
			nextParam: false,
		}, {
			label: 'RPM',
			min: -10,
			max: 200,
			unitMeasure: 'c/min',
			param: 'rpm',
			nextParam: true,
		}, {
			label: 'TORQUE',
			min: 0,
			max: 5000,
			unitMeasure: 'kft.lbf',
			param: 'torque',
			nextParam: false,
		}, {
			label: 'FLOW',
			min: 0,
			max: 1200,
			unitMeasure: 'gal/min',
			param: 'flow',
			nextParam: true,
		}, {
			label: 'STANDPIPE PRESSURE',
			min: 0,
			max: 5000,
			unitMeasure: 'psi',
			param: 'sppa',
			nextParam: false,
		}];
	}

}
