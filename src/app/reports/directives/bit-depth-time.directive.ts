// (function() {
// 	'use strict';

import * as d3 from 'd3';
import { HighchartsService } from '../../shared/highcharts/highcharts.service';

export class BitDepthTimeDirective implements ng.IDirective {
	public static $inject: string[] = ['$filter', 'highchartsService'];

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

	public scope = {
		bitDepthReportDataReady: '=',
		setCurrentPoint: '&',
	};
	public restrict: 'EA';

	constructor(
		private $filter: ng.IFilterFilter,
		private highchartsService: HighchartsService) {
	}

	public link: ng.IDirectiveLinkFn = (
		scope: any,
		elem: ng.IAugmentedJQuery,
		attrs: ng.IAttributes,
		ctrl: any,
	) => {

		this.highchartsService.highcharts().then((Highcharts) => {

			onDependenciesReady(Highcharts);

		});

		const onDependenciesReady = (Highcharts) => {

			const colorPallete = d3.scaleOrdinal(d3.schemeCategory10);
			let plannedLocked = false;
			let executedLocked = false;

			let lastPoint = null;
			let lastPointBackup = null;

			let currentPoint;

			let bitDepthVsTimeChart;

			scope.$watch('bitDepthReportDataReady', (bitDepthReportDataReady) => {

				if (bitDepthReportDataReady) {
					bitDepthReportDataReady.then((data) => {
						createChart(
							data.plannedPoints,
							data.executedPoints,
							data.holeDepthPoints,
							data.startChartAt,
						);
					});
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

			const setSectionColors = (section: any) => {

				if (section.id === 0) {	// water depth
					section.color = '#40a4df';
				} else {
					section.color = colorPallete(((section.id + 2) % 10) as any);
				}

				section.className = 'bit-depth-time-highcharts-plot-band';
				section.label.className = 'bit-depth-time-highcharts-plot-band-label';

				return section;
			};

			const createChart = (bitDepthPlannedPoints, bitDepthExecutedPoints, holeDepthPoints, startChartAt) => {

				bitDepthVsTimeChart = Highcharts.chart(elem[0], {

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
						min: startChartAt,
						crosshair: true,
						shared: true,
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
						plotBands: [],
					},

					legend: {
						enabled: false,
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
									mouseOver: onChartHover,
									click: onChartClick,
								},
							},
						},
					},
				});

				for (const bitDepthPlannedPoint of bitDepthPlannedPoints || []) {

					const bitDepthPlannedPointsSerie: any = {
						data: bitDepthPlannedPoint || [],
					};

					if (bitDepthPlannedPointsSerie) {
						bitDepthPlannedPointsSerie.color = '#2b908f';
						bitDepthPlannedPointsSerie.zIndex = 2;
						bitDepthPlannedPointsSerie.step = true;
						bitDepthVsTimeChart.addSeries(bitDepthPlannedPointsSerie);
					}

				}

				for (const bitDepthExecutedPoint of bitDepthExecutedPoints || []) {

					const bitDepthExecutedPointsSerie: any = {
						data: bitDepthExecutedPoint || [],
					};

					if (bitDepthExecutedPointsSerie) {
						bitDepthExecutedPointsSerie.zIndex = 3;
						bitDepthVsTimeChart.addSeries(bitDepthExecutedPointsSerie);
					}

				}

				const holeDepthPointsSerie: any = {
					data: holeDepthPoints || [],
				};

				if (holeDepthPointsSerie) {
					holeDepthPointsSerie.color = 'rgba(180, 180, 180, 0.75)';
					holeDepthPointsSerie.lineWidth = 10;
					bitDepthVsTimeChart.addSeries(holeDepthPointsSerie);
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

				if (!currentPoint) {
					return;
				}

				lastPoint = currentPoint;

				lastPointBackup = {
					x: currentPoint.x,
					y: currentPoint.y,
					color: currentPoint.color || null,
					segmentColor: currentPoint.segmentColor || null,
					marker: currentPoint.marker || null,
				};

				currentPoint.update({
					y: currentPoint.y,
					x: currentPoint.x,
					color: currentPoint.color || null,
					segmentColor: currentPoint.segmentColor || null,
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
					return;
				}

				/**
				 * Caso nenhum ponto esteja fixo
				 * verifico sua linha e fixo o ponto clicado
				 */

				if (currentPoint.selectedLineType === 'plannedEvent') {
					plannedLocked = !plannedLocked;
				} else if (currentPoint.selectedLineType === 'executedEvent') {
					executedLocked = !executedLocked;
				}

			};

			function onChartHover() {

				currentPoint = this;
				currentPoint.plannedLocked = plannedLocked;
				currentPoint.executedLocked = executedLocked;

				scope.setCurrentPoint({
					event: currentPoint,
				});

			}

		};

	}
}
// })();
