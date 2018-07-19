// (function() {
// 	'use strict';

import * as d3 from 'd3';
import { HighchartsService } from '../../shared/highcharts/highcharts.service';

export class BitDepthTimeDirective implements ng.IDirective {
	public static $inject: string[] = ['$filter', 'highchartsService'];

	public scope = {
		chartData: '=',
		setCurrentPlannedEvent: '&',
		setCurrentExecutedEvent: '&',
		setHoleDepth: '&',
		setCurrentPoint: '&',
	};
	public restrict: 'EA';
	public currentPoint: any;

	constructor(
		private $filter: ng.IFilterFilter,
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

			const colorPallete = d3.scaleOrdinal(d3.schemeCategory10);
			let plannedLocked = false;
			let executedLocked = false;
			let indexSelectedPoint = null;

			let lastPoint = null;
			let lastPointBackup = null;

			let bitDepthVsTimeChart;

			scope.$watch('chartData', (chartData) => {
				if (chartData) {
					createChart(chartData.bitDepthPlannedPoints,
						chartData.bitDepthExecutedPoints,
						chartData.holeDepthPoints,
						chartData.sectionsBands,
						chartData.startChartAt);
				}
			});

			const markerWhenObjectIsSelected = () => {
				return {
					enabled: true,
					symbol: 'circle',
					fillColor: '#00FFFF',
					radius: 5,
				};
			};

			const setSectionColors = (section) => {

				if (section.id === 0) {	// water depth
					section.color = '#40a4df';
				} else {
					section.color = colorPallete((((section.id + 2) % 10) as any));
				}

				section.className = 'bit-depth-time-highcharts-plot-band';
				section.label.className = 'bit-depth-time-highcharts-plot-band-label';

				return section;
			};

			const createChart = (bitDepthPlannedPoints, bitDepthExecutedPoints, holeDepthPoints, sectionsBands, startChartAt) => {

				const plotBands = (!sectionsBands) ? [] : sectionsBands.map(setSectionColors);

				bitDepthVsTimeChart = Highcharts.chart(element[0], {

					chart: {
						type: 'coloredline',
						backgroundColor: 'rgba(0,0,0,0)',
						zoomType: 'x',
						height: 450,
						events: {
							click: onChartClick,
						},
					},

					title: {
						text: null,
					},

					xAxis: {
						crosshair: true,
						shared: true,
						min: startChartAt,
						title: {
							text: 'Day(s)',
						},
						type: 'datetime',
					},

					yAxis: {
						reversed: true,
						title: {
							text: 'Depth',
						},
						plotBands,
					},

					tooltip: {
						enabled: false,
					},
					plotOptions: {
						series: {
							turboThreshold: 0,
							pointStart: 2010,
							connectNulls: false,
							point: {
								events: {
									mouseOver: () => { onChartHover(this); },
									click: onChartClick,
								},
							},
						},
					},
				});

				if (bitDepthPlannedPoints) {
					bitDepthPlannedPoints.zIndex = 2;
					bitDepthPlannedPoints.step = true;
					bitDepthVsTimeChart.addSeries(bitDepthPlannedPoints);
				}

				if (bitDepthExecutedPoints) {
					bitDepthExecutedPoints.zIndex = 3;
					bitDepthVsTimeChart.addSeries(bitDepthExecutedPoints);
				}

				if (holeDepthPoints) {
					holeDepthPoints.color = 'rgba(180, 180, 180, 0.75)';
					holeDepthPoints.lineWidth = 10;
					bitDepthVsTimeChart.addSeries(holeDepthPoints);
				}

				return bitDepthVsTimeChart;
			};

			/**
			 *	Events
			**/

			const unmarkLastPoint = () => {
				if (!lastPoint) {
					return;
				}

				lastPoint.update(lastPointBackup);

				lastPoint = null;
				lastPointBackup = null;
			};

			const markCurrentPoint = () => {

				if (!vm.currentPoint) {
					return;
				}

				lastPoint = vm.currentPoint;

				lastPointBackup = {
					x: vm.currentPoint.x,
					y: vm.currentPoint.y,
					color: vm.currentPoint.color || null,
					segmentColor: vm.currentPoint.segmentColor || null,
					marker: vm.currentPoint.marker || null,
				};

				vm.currentPoint.update({
					y: vm.currentPoint.y,
					x: vm.currentPoint.x,
					color: vm.currentPoint.color || null,
					segmentColor: vm.currentPoint.segmentColor || null,
					marker: markerWhenObjectIsSelected(),
				});

			};

			const onChartClick = () => {

				enableOrDisableMouseOver();

				unmarkLastPoint();

				/**
				 * Se um dos pontos for fixado
				 * eu o marco no grafico
				 */
				if (plannedLocked || executedLocked) {
					markCurrentPoint();
				}

			};

			const enableOrDisableMouseOver = () => {

				/**
				 * Se algum dos pontos estiverem fixados
				 * libera o hover dos dois.
				 */
				if (plannedLocked || executedLocked) {
					plannedLocked = false;
					executedLocked = false;
					indexSelectedPoint = null;
					return;
				}

				/**
				 * Caso nenhum ponto esteja fixo
				 * verifico sua linha e fixo o ponto clicado
				 */
				if (vm.currentPoint.lineType === 'planned') {
					plannedLocked = !plannedLocked;
					indexSelectedPoint = vm.currentPoint.series.index;
				} else {
					executedLocked = !executedLocked;
					indexSelectedPoint = vm.currentPoint.series.index;
				}
			};

			const setEndEventDate = (event, index, data) => {

				if (!event || !data[index]) {
					return;
				}

				event.startDate = ((index !== 0) ? data[index - 1].x : data[index].x);
				event.endDate = data[index].x;

				return event;
			};

			const onChartHover = (currentPoint) => {

				vm.currentPoint = currentPoint;

				let plannedEvent = null;
				let executedEvent = null;

				const plannedOfPoint = getPointFromSerieByX(bitDepthVsTimeChart.series[0], currentPoint.x);
				const executedOfPoint = getPointFromSerieByX(bitDepthVsTimeChart.series[1], currentPoint.x);
				const holeDepthOfPoint = getPointFromSerieByX(bitDepthVsTimeChart.series[2], currentPoint.x);

				/** Marca no ponto qual linha ele pertence */
				if (currentPoint === plannedOfPoint) {
					currentPoint.lineType = 'planned';
				} else {
					currentPoint.lineType = 'executed';
				}

				if (plannedOfPoint) {
					plannedEvent = getEventFromPointOfASerie(plannedOfPoint, bitDepthVsTimeChart.series[0]);
					plannedEvent = setEndEventDate(
						plannedEvent,
						plannedOfPoint.index,
						bitDepthVsTimeChart.series[0].points,
					);
				}

				if (executedOfPoint) {

					let pointIndex = null;

					for (const index in bitDepthVsTimeChart.series[1].hcEvents) {
						const tempEvent = bitDepthVsTimeChart.series[1].hcEvents[index][0];
						if (tempEvent.id === executedOfPoint.id) {
							executedEvent = tempEvent;
							pointIndex = index;
						}
					}

					// var executedEvent = getEventFromPointOfASerie(executedOfPoint, bitDepthVsTimeChart.series[1]);
					executedEvent = setEndEventDate(
						executedEvent,
						pointIndex,
						bitDepthVsTimeChart.series[1].points,
					);
				}

				const holeDepth = getDepthFromPointOfASerie(holeDepthOfPoint, bitDepthVsTimeChart.series[2]);
				const plannedDepth = getDepthFromPointOfASerie(plannedOfPoint, bitDepthVsTimeChart.series[0]);
				const executedDepth = getDepthFromPointOfASerie(executedOfPoint, bitDepthVsTimeChart.series[1]);

				try {
					let highLigth;

					if (indexSelectedPoint != null) {
						highLigth = indexSelectedPoint;
					} else {
						highLigth = currentPoint.series.index;
					}

					// highLigth
					scope.setCurrentPoint({
						event: {
							index: highLigth,
						},
					});

				} catch (e) {
					// faça nada
				}

				if (!plannedLocked) {
					scope.setCurrentPlannedEvent({
						event: plannedEvent,
					});
				}

				if (!executedLocked) {
					scope.setCurrentExecutedEvent({
						event: executedEvent,
					});
				}

				scope.setHoleDepth({
					event: holeDepth,
				});

				return null;

			};

			const getDepthFromPointOfASerie = (point, series) => {
				return {
					depth: (point) ? point.y : null,
				};
			};

			const getEventFromPointOfASerie = (point, series) => {
				try {
					return series.hcEvents[point.index][0];
				} catch (e) {
					return null;
				}
			};

			const getPointFromSerieByX = (serie, x) => {
				const point = null;

				if (serie) {
					for (let i = 1; i < serie.points.length; i++) {

						const pontoAnterior = serie.points[i - 1];
						const proximoPonto = serie.points[i];

						if (x >= pontoAnterior.x && x <= proximoPonto.x) {

							const distanciaParaAnterior = Math.abs(x - pontoAnterior.x);
							const distanciaParaProximo = Math.abs(x - proximoPonto.x);

							if (distanciaParaAnterior <= distanciaParaProximo) {
								return pontoAnterior;
							} else {
								return proximoPonto;
							}
						}
					}
				}

				return point;
			};

		});

	}

	public static Factory(): ng.IDirectiveFactory {
		const directive = (
			$filter: ng.IFilterFilter,
			highchartsService: HighchartsService,
		) => new BitDepthTimeDirective(
			$filter,
			highchartsService,
			);

		return directive;
	}
}
// })();
