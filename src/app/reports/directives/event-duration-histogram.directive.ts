// (function() {
// 	'use strict';

import { HighchartsService } from '../../shared/highcharts/highcharts.service';
import template from './event-duration-histogram.template.html';

export class EventDurationHistogram {

	public static $inject: string[] = ['highchartsService'];

	public static Factory(): ng.IDirectiveFactory {
		const directive = (
			highchartsService: HighchartsService,
		) => new EventDurationHistogram(
			highchartsService,
		);

		return directive;
	}
	public template = template;
	public restrict = 'EA';
	public scope = {
		chartData: '=',
	};

	constructor(private highchartsService: HighchartsService) { }

	public link: ng.IDirectiveLinkFn = (
		scope: any,
		elem: ng.IAugmentedJQuery,
		attrs: ng.IAttributes,
		ctrl: any,
	) => {

		this.highchartsService.highcharts().then(function (Highcharts) {
			let chart;
			let chartData: any;
			let binSize = 60;
			const extremes = {
				min: null,
				max: null,
			};

			scope.binMinutes = 1;
			scope.binSeconds = 0;

			scope.actionButtonApply = actionButtonApply;
			scope.actionButtonApplyExtremes = actionButtonApplyExtremes;
			scope.actionButtonShowLastParameters = actionButtonShowLastParameters;
			scope.actionButtonHideParameters = actionButtonHideParameters;

			scope.$watch('chartData', function (newValue) {
				if (newValue) {
					chartData = newValue;
					renderChart(false);
				}
			}, true);

			function renderChart(fromBin) {

				const container = elem[0].querySelectorAll('.histogram-container')[0];

				const jointLength = (chartData.label.toLowerCase().indexOf('trip') > -1 ? chartData.jointLength : 1);
				const vporEventDuration = jointLength / (chartData.vpoor / 3600);
				const vstdEventDuration = jointLength / (chartData.vstandard / 3600);
				const voptEventDuration = jointLength / (chartData.voptimum / 3600);

				const histogramData = histogram(chartData.points, binSize);

				const showResetZoom = chart && chart.resetZoomButton && chart.resetZoomButton !== null;

				scope.showDiffMessage = chartData['diff-op'];

				chart = Highcharts.chart(container, {
					chart: {
						type: 'column',
						height: 300,
						zoomType: 'x',
					},
					title: {
						text: chartData.label,
					},
					xAxis: {
						gridLineWidth: 1,
						title: {
							text: 'Event Duration',
						},
						tickInterval: binSize,
						labels: {
							formatter() {
								return formatSeconds(this.value);
							},
						},
						events: {
							afterSetExtremes(event) {
								setExtremesInput(event);
							},
						},
						plotLines: [
							createPlotLine('V Por', vporEventDuration, 'red'),
							createPlotLine('V Std', vstdEventDuration, 'yellow'),
							createPlotLine('V Opt', voptEventDuration, '#337ab7'),
						],
					},
					yAxis: [{
						title: {
							text: 'Frequency',
						},
					}, {
						opposite: true,
						title: {
							text: 'Index',
						},
					}],
					tooltip: {
						formatter() {
							let s;
							if (this.series.name === 'Event Data') {
								s = 'Event duration: ' + formatSeconds(this.x);
							} else {
								s = '(' + formatSeconds(this.x) + ' - ' + formatSeconds(this.x + binSize) + ')';
								s += '<br>Frequency: ' + this.y;
							}

							return s;
						},
						shared: false,
					},
					series: [{
						name: 'Histogram',
						type: 'column',
						data: histogramData,
						pointPadding: 0,
						groupPadding: 0,
						pointPlacement: 'between',
						pointRange: binSize,
					}, {
						name: 'Event Data',
						type: 'scatter',
						data: chartData.points,
						yAxis: 1,
						marker: {
							radius: 1.5,
						},
					}],
				});

				if (scope.showDiffMessage) {
					(window as any).chart = chart;
				}

				if (!fromBin) {
					setExtremesFromHistoData(histogramData);
				} else {
					setExtremesFromExtremes(showResetZoom);
				}
			}

			function actionButtonApply() {
				const minutes = scope.binMinutes || 0;
				const seconds = scope.binSeconds || 0;

				binSize = minutes * 60 + seconds;
				renderChart(true);
			}

			function actionButtonApplyExtremes() {
				const maxMinutes = scope.maxMinutes || 0;
				const maxSeconds = scope.maxSeconds || 0;

				const minMinutes = scope.minMinutes || 0;
				const minSeconds = scope.minSeconds || 0;

				extremes.min = (minMinutes * 60) + minSeconds;
				extremes.max = (maxMinutes * 60) + maxSeconds;

				chart.xAxis[0].setExtremes(extremes.min, extremes.max, true);

				chart.showResetZoom();
			}

			function actionButtonShowLastParameters() {
				scope.showDiffMessage = false;
			}

			function actionButtonHideParameters() {
				chart.xAxis[0].removePlotLine('V Por');
				chart.xAxis[0].removePlotLine('V Std');
				chart.xAxis[0].removePlotLine('V Opt');
				scope.showDiffMessage = false;
			}

			function histogram(data, step) {
				const histo = {};
				let x;
				let i;
				const arr = [];

				// Group down
				for (i = 0; i < data.length; i++) {
					x = Math.floor(data[i][0] / step) * step;
					if (!histo[x]) {
						histo[x] = 0;
					}
					histo[x]++;
				}

				// Make the histo group into an array
				for (x in histo) {
					if (histo.hasOwnProperty((x))) {
						arr.push([parseFloat(x), histo[x]]);
					}
				}

				// Finally, sort the array
				arr.sort(function (a, b) {
					return a[0] - b[0];
				});

				return arr;
			}

			function setExtremesFromHistoData(data) {
				const firstValue = data[0][0];
				const lastValue = data[data.length - 1][0] + binSize;

				extremes.min = firstValue;
				extremes.max = lastValue;

				chart.xAxis[0].setExtremes(extremes.min, extremes.max, true);
			}

			function setExtremesFromExtremes(showResetZoom) {
				chart.xAxis[0].setExtremes(extremes.min, extremes.max, true);

				if (showResetZoom) {
					chart.showResetZoom();
				}
			}

			function setExtremesInput(event) {
				scope.minMinutes = Number(event.min / 60);
				scope.minSeconds = Number(event.min % 60);

				scope.maxMinutes = Number(event.max / 60);
				scope.maxSeconds = Number(event.max % 60);

				if (event.trigger) {
					scope.$apply();
				}
			}

			function formatSeconds(durationSeconds) {
				const minutes = Number(durationSeconds / 60);
				const seconds = Number(durationSeconds % 60);

				return minutes + 'm:' + seconds + 's';
			}

			function createPlotLine(label, value, color) {
				return {
					id: label,
					color,
					width: 2,
					value,
					zIndex: 10000,
					label: {
						text: label,
						rotation: 0,
						y: -3,
						x: -2,
						style: {
							color,
							fontWeight: 'bold',
							fontSize: '14px',
						},
					},
				};
			}
		});
	}
}
