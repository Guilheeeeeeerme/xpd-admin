// (function() {
// 	'use strict';

import * as d3 from 'd3';
import { HighchartsService } from '../../shared/highcharts/highcharts.service';

export class ReportNeedleChart {
	public static $inject: string[] = ['highchartsService'];

	public static Factory(): ng.IDirectiveFactory {
		const directive = (
			highchartsService: HighchartsService,
		) => new ReportNeedleChart(
			highchartsService,
			);

		return directive;
	}

	public restrict: 'EA';
	public scope = {
		// chartCategories: '=',
		dataChart: '=',
	};

	constructor(
		private highchartsService: HighchartsService) {
	}

	public link: ng.IDirectiveLinkFn = (
		scope: any,
		element: ng.IAugmentedJQuery,
		attrs: ng.IAttributes,
		ctrl: any,
	) => {

		let colorPallete = null;

		colorPallete = d3.scaleOrdinal(d3.schemeCategory10);

		function formatMilliseconds(millis) {
			return format(millis);
		}

		function format(milliseconds) {
			milliseconds = Math.round(milliseconds);

			let hours = Math.floor(milliseconds / 3600000);
			milliseconds = milliseconds % 3600000;

			const minutes = Math.floor(milliseconds / 60000);
			milliseconds = milliseconds % 60000;

			const seconds = Math.floor(milliseconds / 1000);
			milliseconds = milliseconds % 1000;

			if (hours < 24) {
				return toFixed(hours) + ':' + toFixed(minutes) + ':' + toFixed(seconds);
			} else {
				const days = Math.floor(hours / 24);
				hours = hours % 24;

				return toFixed(days) + 'd ' + toFixed(hours) + ':' + toFixed(minutes);
			}

		}

		function toFixed(time) {
			if (time < 10) {
				return '0' + time;
			} else {
				return String(time);
			}
		}

		this.highchartsService.highcharts().then(function (Highcharts) {

			Highcharts.setOptions({
				global: {
					timezoneOffset: new Date().getTimezoneOffset(),
				},
			});

			scope.$watch('dataChart', function (newValue) {
				if (newValue) {
					createChart(newValue);
				}
			});

			function createChart(dataChart) {

				let plotBandsTeam = dataChart.plotBands;

				plotBandsTeam = plotBandsTeam.map(function (plotBand) {
					plotBand.color = colorPallete(plotBand.colorIndex);
					plotBand.className = 'needle-highcharts-plot-band';
					plotBand.label = {
						text: plotBand.label,
						className: 'needle-highcharts-plot-band-label',
					};
					return plotBand;
				});

				const plotLinePoor = {
					id: 1,
					color: '#D01814',
					width: 2,
					dashStyle: 'shortdash',
					value: dataChart.vpoor,
					name: 'V. Poor',
				};
				const plotLineStd = {
					id: 2,
					color: '#D0A614',
					width: 2,
					dashStyle: 'shortdash',
					value: dataChart.vstandard,
					name: 'V. Standard',
				};
				const plotLineOpt = {
					id: 3,
					color: '#89CFF0',
					width: 2,
					dashStyle: 'shortdash',
					value: dataChart.voptimum,
					name: 'V. Optimum',
				};

				let avg = '';

				if (dataChart.eventType === 'TRIP') {
					avg = Math.round((dataChart.displacement * 360000) / dataChart.duration) + 'm/h';
				} else {
					avg = formatMilliseconds(dataChart.duration * 1000);
				}

				const plotLineAverage = {
					id: 4,
					color: '#fff',
					width: 2,
					dashStyle: 'shortdash',
					value: dataChart.vaverage,
					name: 'V. Average: ( ' + avg + ' )',
				};

				const plotLineOptions = [
					plotLinePoor,
					plotLineStd,
					plotLineOpt,
					plotLineAverage,
				];

				/* zones */
				const zonesOptions = [];

				let temp: any = {};
				temp.value = 0;
				temp.color = plotLineOpt.color;
				zonesOptions.push(temp);

				temp = {};
				temp.value = plotLineOpt.value;
				temp.color = plotLineOpt.color;
				zonesOptions.push(temp);

				temp = {};
				temp.value = plotLineOpt.value;
				temp.color = '#006400';
				zonesOptions.push(temp);

				temp = {};
				temp.value = plotLineStd.value;
				temp.color = '#006400';
				zonesOptions.push(temp);

				temp = {};
				temp.value = plotLinePoor.value;
				temp.color = plotLineStd.color;
				zonesOptions.push(temp);

				temp = {};
				temp.color = plotLinePoor.color;
				zonesOptions.push(temp);

				const from = dataChart.categoriesmin;
				const to = dataChart.categoriesmax;

				let series: any[] = [{
					name: 'Activities',
					type: 'column',
					showInLegend: false,
					pointWidth: 5,
					data: dataChart.data,
					zoneAxis: 'y',
					zones: zonesOptions,
				}];

				series = series.concat([plotLinePoor, plotLineStd, plotLineOpt, plotLineAverage].map(function (line) {

					return {
						// Series that mimics the plot line
						type: 'scatter',
						color: line.color,
						name: line.name,
						marker: {
							enabled: true,
						},
						events: {
							legendItemClick() {

								if (this.visible) {
									this.chart.yAxis[0].removePlotLine(line.id);
								} else {
									this.chart.yAxis[0].addPlotLine(line);
								}
							},
						},
					};

				}));

				const chart = {

					chart: {
						zoomType: 'xy',
						type: 'column',
					},
					title: {
						text: '',
					},
					xAxis: {
						min: from,
						max: to,
						title: {
							text: 'Date',
						},
						type: 'datetime',
						plotBands: plotBandsTeam,
					},
					yAxis: {
						min: 0,
						title: {
							text: 'Duration (seg)',
						},
						plotLines: plotLineOptions,

					},
					tooltip: {
						enabled: true,
						style: {
							fontSize: '15px',
						},
						formatter() {
							return formatMilliseconds(this.y * 1000);
						},
					},

					plotOptions: {
						column: {
							borderWidth: 0,
						},
					},

					series,
				};

				return Highcharts.chart(element[0], chart);
			}

		});
	}
}
// }) ();
