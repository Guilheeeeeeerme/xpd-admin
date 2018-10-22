import * as angular from 'angular';
import { IModalService } from 'angular-ui-bootstrap';
import * as d3 from 'd3';
import './dmec-chart.style.scss';

import modalTemplate from './dmec-chart-modal.template.html';
import template from './dmec-chart.template.html';

export class DMECChartDirective implements ng.IDirective {
	public static $inject = ['$q', '$window', '$uibModal'];

	public static Factory(): ng.IDirectiveFactory {
		return (
			$q: ng.IQService,
			$window: angular.IWindowService,
			$uibModal: IModalService) => new DMECChartDirective($q, $window, $uibModal);
	}
	public restrict = 'E';
	public template = template;
	public scope = {
		zoomStartAt: '=',
		zoomEndAt: '=',
		onReading: '=',
		onReadingSince: '=',
		setSelectedPoint: '&',
		lastSelectedPoint: '=',
		removeMarker: '=',
	};
	private dmecWorker: Worker;
	private workerIsListening: boolean = false;

	constructor(
		private $q: ng.IQService,
		private $window: angular.IWindowService,
		private $modal: IModalService) {

		this.dmecWorker = new Worker('./dmec-chart.worker/dmec-chart.worker.js');
	}

	public link: ng.IDirectiveLinkFn = (
		scope: any,
		element: ng.IAugmentedJQuery,
		attrs: ng.IAttributes,
		ctrl: any,
	) => {
		const vm = this;
		const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

		let readings = [];
		let oldPoints = null;
		let newPoints = null;

		if (!localStorage.getItem('xpd.admin.dmec.dmecTracks')) {
			localStorage.setItem('xpd.admin.dmec.dmecTracks', JSON.stringify(this.getDefaultTracks()));
		}

		const tracks = JSON.parse(localStorage.getItem('xpd.admin.dmec.dmecTracks'));
		let threads = (!isNaN(Number(attrs.threads))) ? Number(attrs.threads) : 4;
		threads = Math.min(Math.abs(threads), tracks.length);

		const isHorizontal = scope.horizontal = (attrs.horizontal === true || attrs.horizontal === 'true');
		const selectOnHover = (attrs.selectOnHover === true || attrs.selectOnHover === 'true');

		/**
		 * Real History
		 */
		const onReadingSinceChange = (onReadingSince) => {
			if (onReadingSince) {

				onReadingSince.then((points) => {
					oldPoints = points;
					draw('oldPoints', oldPoints);
				});

			}

		};

		/**
		 * Real History
		 */
		const onReadingChange = (onReading) => {
			if (onReading) {

				onReading.then((reading) => {

					if (!readings) {
						readings = [];
					}

					readings.push(reading);

					readingsToPoints(readings, tracks).then((points) => {
						newPoints = points;
						draw('oldPoints', oldPoints);
					});

				});
			}
		};

		const onLastSelectedPoint = (point) => {

			if (!point) { return; }

			findPoint(point.timestamp, ((isHorizontal) ? point.xPosition : point.yPosition));

		};

		const onRemoveMarker = (timestamp) => {

			if (!timestamp) { return; }

			d3.select(element[0]).selectAll('.marker-' + timestamp).remove();
			d3.select(element[0]).selectAll('.line-' + timestamp).remove();

		};

		const updateChart = () => {

			scope.svg = {
				viewWidth: element[0].clientWidth || 100,
				viewHeight: element[0].offsetHeight || 100,
			};

			scope.timeScale = d3.scaleTime()
				.domain([
					new Date(scope.zoomStartAt),
					new Date(scope.zoomEndAt),
				])
				.range([
					0,
					isHorizontal ? (scope.svg.viewWidth) : (scope.svg.viewHeight),
				]);

			scope.timeTicks = scope.timeScale.ticks();

			configTracks();

		};

		// tslint:disable-next-line:no-shadowed-variable
		const readingsToPoints = (readings, tracks) => {

			return vm.$q((resolve, reject) => {

				if (tracks != null && tracks.length > 0 && readings != null && readings.length > 0) {

					this.dmecWorker.postMessage({
						cmd: 'reading-to-points',
						tracks: tracks.map((t) => ({ param: t.param })),
						readings,
						zoomStartAt: scope.zoomStartAt,
						zoomEndAt: scope.zoomEndAt,
					});

					this.onWorker('reading-to-points', (message) => {
						resolve(message.data.points);
					});

				}

			});

		};

		const configTracks = () => {

			scope.$tracks = tracks.map((track, index) => {
				return configTrackProperties(track, index);
			});

		};

		const configTrackProperties = (track, index) => {

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
				.x((d) => scaleValue(d, trackScale))
				.y((d) => scaleTime(d, trackScale))
				.curve(d3.curveStepAfter);

			track.id = index;
			track.lineFunction = lineFunction;
			track.trackScale = trackScale;
			track.ticks = [track.max, track.min];

			return track;
		};

		const isNumber = (d) => {

			const isDefined = (d.y != null && d.x != null);
			// tslint:disable-next-line:no-shadowed-variable
			const isNumber = (angular.isNumber(d.y) && angular.isNumber(d.x));

			return isDefined && isNumber;
		};

		const scaleValue = (d, trackScale) => {
			let x;
			if (!isHorizontal) {
				x = trackScale(d.y);
			} else {
				x = scope.timeScale(d.x);
			}

			return x;
		};

		const scaleTime = (d, trackScale) => {
			let y;
			if (!isHorizontal) {
				y = scope.timeScale(d.x);
			} else {
				y = trackScale(d.y);
			}

			return y;
		};

		// tslint:disable-next-line:no-shadowed-variable
		const trackPosition = (trackIndex) => {

			const viewWidth = scope.svg.viewWidth;
			const viewHeight = scope.svg.viewHeight;

			const numberOfTracks = tracks.length;
			const tracksPerThread = Math.ceil(numberOfTracks / threads);
			const relative = Math.floor(trackIndex / tracksPerThread) / threads;
			const result = (relative * ((isHorizontal) ? viewHeight : viewWidth));

			return result;
		};

		const draw = (trackName, points) => {

			this.dmecWorker.postMessage({
				cmd: 'handle-overflow',
				tracks: tracks.map((track) => {

					return {
						param: track.param,
						min: track.min,
						max: track.max,
					};
				}),
				trackName,
				points,
				zoomStartAt: scope.zoomStartAt,
				zoomEndAt: scope.zoomEndAt,
			});

			const promise = vm.$q((resolve, reject) => {
				this.onWorker('handle-overflow', (event) => {
					resolve(event.data);
				});
			});

			promise.then((data: any) => {

				const processedTrackName = data.trackName;

				tracks.map((track) => {
					d3.select(element[0])
						.selectAll('.' + processedTrackName)
						.selectAll('#' + track.param)
						.attr('d', track.lineFunction(data.points[track.param]));
				});

			});

		};

		const listenToMouseMove = () => {

			d3.select(element[0]).selectAll('.overlay')
				.on('click', setSelectedPoint)
				.on('mousemove', onMouseMove);

			function setSelectedPoint() {

				if (!selectOnHover) {
					const selectedPoint = wrapSelectedPoint(d3.mouse(this)[0], d3.mouse(this)[1]);
					scope.setSelectedPoint({ position: selectedPoint });
				}
			}

			function onMouseMove() {

				if (selectOnHover) {

					d3.select(element[0]).selectAll('.marker').remove();
					d3.select(element[0]).selectAll('.line').remove();

					scope.lastSelectedPoint = wrapSelectedPoint(d3.mouse(this)[0], d3.mouse(this)[1]);

					findPoint(scope.lastSelectedPoint.timestamp, ((isHorizontal) ? scope.lastSelectedPoint.xPosition : scope.lastSelectedPoint.yPosition));

				}

				moveCrosshair(d3.mouse(this)[0], d3.mouse(this)[1]);
			}

		};

		const wrapSelectedPoint = (xPosition, yPosition) => {
			return {
				xPosition: xPosition,
				yPosition: yPosition,
				timestamp: new Date(scope.timeScale.invert(isHorizontal ? xPosition : yPosition)).getTime(),
			};
		};

		const moveCrosshair = (mouseXPosition, mouseYPosition) => {

			let timeAxisPosition = null;

			if (!isHorizontal) {
				timeAxisPosition = mouseYPosition;
			} else {
				timeAxisPosition = mouseXPosition;
			}

			d3.select(element[0]).selectAll('#crosshair')
				.attr(((!isHorizontal) ? 'y1' : 'x1'), timeAxisPosition)
				.attr(((!isHorizontal) ? 'y2' : 'x2'), timeAxisPosition);

		};

		const findPoint = (timestamp, position) => {
			tracks.map((track) => findPointAVL(track, timestamp, position));
		};

		const findPointAVL = (t, timestamp, position) => {

			this.dmecWorker.postMessage({
				cmd: 'find-point-avl',
				timestamp,
				param: t.param,
				oldPoints: oldPoints,
				newPoints: newPoints,
				zoomStartAt: scope.zoomStartAt,
				zoomEndAt: scope.zoomEndAt,
			});

			this.onWorker('find-point-avl', (message) => findPointAVLCallback(message, position));

		};

		const findPointAVLCallback = (message, position) => {

			const point = message.data.point.point;
			const param = message.data.param;
			let track;

			if (point && point.y != null) {
				for (const i in tracks) {
					if (tracks[i].param === param) {
						track = tracks[i];
						break;
					}
				}
				drawBubbles(point, track, position);
			}

		};

		const drawBubbles = (point, track, position) => {

			if (track.param === 'hookload') {
				console.log(point, track, position);
			}

			const bubbleContent = d3.select(element[0]).selectAll('.bubbles');
			const line = d3.select(element[0]).selectAll('.line-' + scope.lastSelectedPoint.timestamp).nodes();

			const groupBublle = bubbleContent.append('g')
				.attr('class', 'marker marker-' + scope.lastSelectedPoint.timestamp)
				.attr('transform', 'translate(' +
					((isHorizontal) ? position : track.trackScale(point.y)) + ', ' +
					((isHorizontal) ? track.trackScale(point.y) : position) + ')');

			groupBublle.append('circle')
				.attr('r', '5')
				.attr('fill', 'none')
				.attr('stroke-width', '2')
				.attr('stroke', track.color);

			// Garante que apenas uma linha de um ponto seja desenhada
			if (line.length === 0) {

				bubbleContent.append('line')
					.attr('class', 'line line-' + scope.lastSelectedPoint.timestamp)
					.attr('x1', ((isHorizontal) ? position : 0))
					.attr('x2', ((isHorizontal) ? position : scope.svg.viewWidth))
					.attr('y1', ((isHorizontal) ? 0 : position))
					.attr('y2', ((isHorizontal) ? scope.svg.viewHeight : position))
					.attr('stroke', scope.lastSelectedPoint.color);
			}
		};

		const onZoomChange = () => {
			updateChart();
			draw('newPoints', newPoints);
			draw('oldPoints', oldPoints);
		};

		const openScaleModal = () => {
			vm.$modal.open({
				animation: false,
				keyboard: false,
				backdrop: 'static',
				template: modalTemplate,
				controller: 'DMECChartModalController',
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
		};

		scope.$watch('onReadingSince', (onReadingSince) => { onReadingSinceChange(onReadingSince); });
		scope.$watch('onReading', (onReading) => { onReadingChange(onReading); });

		/**
		* selected Points
		*/
		if (!selectOnHover) {
			scope.$watch('lastSelectedPoint', (lastSelectedPoint) => { onLastSelectedPoint(lastSelectedPoint); }, true);
			scope.$watch('removeMarker', (timestamp) => { onRemoveMarker(timestamp); }, true);
		}

		/**
		 * Atemporal
		 */
		scope.$watch('zoomStartAt', onZoomChange, true);
		scope.$watch('zoomEndAt', onZoomChange, true);

		scope.openScaleModal = () => { openScaleModal(); };
		scope.listenToMouseMove = () => { listenToMouseMove(); };

		updateChart();

	}

	public onWorker(subject, callback) {

		this.dmecWorker[subject] = callback;

		if (!this.workerIsListening) {

			this.workerIsListening = true;

			this.dmecWorker.addEventListener('message', (message) => {
				this.dmecWorker[message.data.cmd](message);
			}, false);

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
