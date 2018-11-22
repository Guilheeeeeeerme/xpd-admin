import { HighchartsService } from '../../highcharts/highcharts.service';

import './dmec-chart.style.scss';

import template from './dmec-chart.template.html';

export class DMECChartDirective implements ng.IDirective {
	public static $inject = ['$timeout', 'highchartsService'];

	public static Factory(): ng.IDirectiveFactory {
		return (
			$timeout: ng.ITimeoutService,
			highchartsService: HighchartsService) => new DMECChartDirective(
				$timeout,
				highchartsService);
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

	constructor(
		private $timeout: ng.ITimeoutService,
		private highchartsService: HighchartsService) {
	}

	public link: ng.IDirectiveLinkFn = (
		scope: any,
		element: ng.IAugmentedJQuery,
		attrs: ng.IAttributes,
		ctrl: any,
	) => {

		const vm = this;

		this.highchartsService.highcharts().then((Highcharts) => {

			const binarySearch = (points, start, end, x) => {

				let point = null;

				do {

					const middle = Math.floor((end + start) / 2);
					const plotX = points[middle].plotX;
					point = points[middle];
					// const plotX = Math.floor(points[middle].plotX);

					// console.log('Looking for %d between %d and %d (%d and %d)', x, points[start].plotX, points[end].plotX, start, end);
					// console.log(point);

					if (plotX > x) {
						start = 0;
						end = (middle - 1);
					} else if (plotX < x) {
						start = (middle + 1);
						end = end;
					} else {
						break;
					}

				} while ( (end - start) > 2 );

				return point;

			};

			const trackNameHash = {};

			const isHorizontal = scope.horizontal = (attrs.horizontal === true || attrs.horizontal === 'true');
			let setZoomTimeout;

			/*
			The purpose of this demo is to demonstrate how multiple charts on the same page
			can be linked through DOM and Highcharts events and API methods. It takes a
			standard Highcharts config with a small variation for each data set, and a
			mouse/touch event handler to bind the charts together.
			*/

			/**
			 * In order to synchronize tooltips and crosshairs, override the
			 * built-in events with handlers defined on the parent element.
			 */
			// tslint:disable-next-line:only-arrow-functions
			['mousemove', 'touchmove', 'touchstart'].forEach(function (eventType) {
				element[0].querySelector('#xpd-dmec-chart-container').addEventListener(
					eventType,
					// tslint:disable-next-line:only-arrow-functions
					function (e) {
						let chart;
						let i;
						let event;

						// console.clear();

						for (i = 0; i < Highcharts.charts.length; i = i + 1) {
							chart = Highcharts.charts[i];

							// Find coordinates within the chart
							event = chart.pointer.normalize(e);
							// Get the hovered point

							const point1 = chart.series[0].searchPoint(event, true);
							const point2 = chart.series[1].searchPoint(event, true);

							if (point1) {
								point1.highlight(e);
							} else {
								if (point2) {
									point2.highlight(e);
								}
							}


							// vm.$timeout(() => {
							// const point3 = binarySearch(chart.series[0].points, 0, ( chart.series[0].points.length - 1 ), event.x);
							// }, 1);

							// vm.$timeout(() => {
							// const point4 = binarySearch(chart.series[1].points, 0, ( chart.series[1].points.length - 1 ), event.x);
							// }, 1);

							// console.log('point1', point1);
							// console.log('point2', point2);
							// console.log('point3', point3);
							// console.log('point4', point4);

						}
					},
				);
			});

			/**
			 * Override the reset function, we don't need to hide the tooltips and
			 * crosshairs.
			 */
			// tslint:disable-next-line:only-arrow-functions
			Highcharts.Pointer.prototype.reset = function () {
				return undefined;
			};

			/**
			 * Highlight a point by showing tooltip, setting hover state and draw crosshair
			 */
			Highcharts.Point.prototype.highlight = function (event) {
				event = this.series.chart.pointer.normalize(event);
				this.onMouseOver(); // Show the hover marker

				try {
					this.series.chart.tooltip.refresh(this); // Show the tooltip
				} catch (error) {
					// faça nada
				}

				for (let axis = 0; axis < 2; axis++) {

					try {
						this.series.chart.xAxis[axis].drawCrosshair(event, this); // Show the crosshair
					} catch (error) {
						// faça nada
					}
				}

			};

			// tslint:disable-next-line:only-arrow-functions
			function syncZoom(zoomStartAt, zoomEndAt) {

				// tslint:disable-next-line:only-arrow-functions
				Highcharts.each(Highcharts.charts, function (chart) {

					if (chart.xAxis[0].setExtremes) {

						chart.xAxis[0].update({
							floor: zoomStartAt,
							ceiling: zoomEndAt,
						});
					}

				});

			}

			// tslint:disable-next-line:only-arrow-functions
			function success(activity) {

				let series = [];
				let yAxis = [];
				const mem: any = {};
				const memRealtime = {};

				// activity = JSON.parse(activity);
				// tslint:disable-next-line:only-arrow-functions
				activity.datasets.forEach(function (dataset, i) {

					// Add X values
					// tslint:disable-next-line:only-arrow-functions
					dataset.data = dataset.data.flatMap(function (val, j) {

						let points: any = {
							x: activity.xData[j],
							y: val[0],
						};

						points.actual = val[1];

						if (mem[dataset.name] === val[2]) {
							points = [points];
						} else {

							mem[dataset.name] = val[2];

							points = [
								{
									x: activity.xData[j],
									y: null,
									actual: null,
								},
								points,
							];
						}

						return points;

					});

					trackNameHash[dataset.name] = dataset.param;

					series.push({
						data: dataset.data,
						name: dataset.name,
						unit: dataset.unit,
						type: dataset.type,
						color: Highcharts.getOptions().colors[i],
						fillOpacity: 0.3,
						tooltip: {
							valueSuffix: ' ' + dataset.unit,
						},
					});

					yAxis.push({
						title: {
							text: null,
						},
						floor: dataset.min,
						ceiling: dataset.max,
					});

					if (series.length === 2) {

						const chartDiv = document.createElement('div');
						chartDiv.className = 'xpd-dmec-chart';
						element[0].querySelector('#xpd-dmec-chart-container').appendChild(chartDiv);

						Highcharts.chart(chartDiv, {
							chart: {
								type: 'line',
								animation: false,
								margin: [5, 5, 5, 5],
								spacing: [0, 0, 0, 0],
								events: {
									click: (e) => {
										const position = Math.round(e.xAxis[0].value);
										scope.setSelectedPoint({
											position: {
												timestamp: position,
											},
										});
									},

									// tslint:disable-next-line:only-arrow-functions
									load: function () {

										const self = this;

										scope.$watch('onReading', (onReading) => {
											if (onReading) {
												onReading.then((reading) => {

													try {

														[self.series[0].name, self.series[1].name].map((serieName: string, serieIndex: number) => {

															const x = reading.timestamp;
															const val = reading[trackNameHash[serieName]];

															let points: any = {
																x: x,
																y: val[0],
															};

															points.actual = val[1];

															if (memRealtime[dataset.name] === val[2]) {
																points = [points];
															} else {
																memRealtime[dataset.name] = val[2];
																points = [
																	{
																		x: x,
																		y: null,
																		actual: null,
																	},
																	points,
																];
															}

															points.map((point) => {
																self.series[serieIndex].addPoint(point, true, true);
															});

														});

													} catch (error) {
														console.error(error);
													}

												});
											}
										});

									},
								},
							},

							boost: {
								useGPUTranslations: false,
							},

							title: {
								text: null,
							},
							credits: {
								enabled: false,
							},
							legend: {
								enabled: false,
							},
							tooltip: {
								shared: true,
								crosshairs: true,
								formatter: function () {
									const points = this.points;
									const pointsLength = points.length;
									let tooltipMarkup = ''; // pointsLength ? '<span style="font-size: 10px">' + points[0].key + '</span><br/>' : '';

									for (let index = 0; index < pointsLength; index += 1) {
										if (points && points[index] && !isNaN(points[index].point.actual)) {

											const unit = points[index].series.userOptions.unit;
											const yValue = (points[index].point.actual).toFixed(2);
											tooltipMarkup += '<span style="color:' + points[index].series.color + '">\u25CF</span> ' + points[index].series.name + ': <b>' + yValue + ' ' +
												unit +
												'</b><br/>';
										}
									}

									return tooltipMarkup;
								},
							},

							plotOptions: {
								series: {
									turboThreshold: 0,
									connectNulls: false,
								},

								line: {
									findNearestPointBy: 'x', // or "xy" to both axis
									// marker: {
									// 	enabled: true,
									// },
								},
							},

							xAxis: {
								crosshair: true,
								shared: true,
								labels: {
									enabled: false,
								},
								type: 'datetime',
							},
							yAxis: yAxis,
							series: series,

						});

						series = [];
						yAxis = [];

					}

				});

			}

			const syncZoomSync = (zoomStartAt, zoomEndAt) => {

				try {
					this.$timeout.cancel(setZoomTimeout);
				} catch (error) {
					// faça nada
				}

				setZoomTimeout = this.$timeout(() => {
					syncZoom(zoomStartAt, zoomEndAt);
				}, 1000);

			};

			scope.onReadingSince.then((readings) => {
				success(readings);

				scope.$watch('zoomStartAt', () => {
					syncZoomSync(scope.zoomStartAt, scope.zoomEndAt);
				}, true);

				scope.$watch('zoomEndAt', () => {
					syncZoomSync(scope.zoomStartAt, scope.zoomEndAt);
				}, true);

			});

		});

	}

}
