(function () {
	'use strict';

	angular.module('xpd.reports')
		.directive('reportNeedleChart', reportNeedleChart);

	reportNeedleChart.$inject = ['highchartsService', 'd3Service'];

	function reportNeedleChart(highchartsService, d3Service) {

		var colorPallete = null;

		d3Service.d3().then(function (d3) {
			colorPallete = d3.scale.category10();
		});

		return {
			restrict: 'EA',
			scope: {
				// chartCategories: '=',
				dataChart: '='
			},
			link: link
		};

		function link(scope, elem, attr) {

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

			highchartsService.highcharts().then(function (Highcharts) {

				Highcharts.setOptions({
					global: {
						timezoneOffset: new Date().getTimezoneOffset()
					}
				});

				scope.$watch('dataChart', function (newValue) {
					if (newValue)
						createChart(newValue);
				});

				function createChart(dataChart) {

					var plotBandsTeam = dataChart.plotBands;

					plotBandsTeam = plotBandsTeam.map(function (plotBand) {
						plotBand.color = colorPallete(plotBand.colorIndex);
						plotBand.className = 'needle-highcharts-plot-band';
						plotBand.label = {
							text: plotBand.label,
							className: 'needle-highcharts-plot-band-label'
						};
						return plotBand;
					});

					var plotLinePoor = {
						id: 1,
						color: '#D01814',
						width: 2,
						dashStyle: 'shortdash',
						value: dataChart.vpoor,
						name: 'V. Poor'
					};
					var plotLineStd = {
						id: 2,
						color: '#D0A614',
						width: 2,
						dashStyle: 'shortdash',
						value: dataChart.vstandard,
						name: 'V. Standard'
					};
					var plotLineOpt = {
						id: 3,
						color: '#89CFF0',
						width: 2,
						dashStyle: 'shortdash',
						value: dataChart.voptimum,
						name: 'V. Optimum'
					};

					var avg = '';
					
					if(dataChart.eventType == 'TRIP'){
						avg = Math.round((dataChart.displacement * 360000) / dataChart.duration) + 'm/h';
					}else{
						avg = formatMilliseconds(dataChart.duration * 1000);
					}

					var plotLineAverage = {
						id: 4,
						color: '#fff',
						width: 2,
						dashStyle: 'shortdash',
						value: dataChart.vaverage,
						name: 'V. Average: ( ' + avg + ' )'
					};

					var plotLineOptions = [
						plotLinePoor,
						plotLineStd,
						plotLineOpt,
						plotLineAverage
					];

					/* zones */
					var zonesOptions = [];

					var temp = {};
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

					var from = dataChart.categoriesmin;
					var to = dataChart.categoriesmax;

					var series = [{
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
							//Series that mimics the plot line
							type: 'scatter',
							color: line.color,
							name: line.name,
							marker: {
								enabled: true
							},
							events: {
								legendItemClick: function () {

									if (this.visible) {
										this.chart.yAxis[0].removePlotLine(line.id);
									} else {
										this.chart.yAxis[0].addPlotLine(line);
									}
								}
							}
						};

					}));


					var chart = {

						chart: {
							zoomType: 'xy',
							type: 'column'
						},
						title: {
							text: ''
						},
						xAxis: {
							min: from,
							max: to,
							title: {
								text: 'Date'
							},
							type: 'datetime',
							plotBands: plotBandsTeam
						},
						yAxis: {
							min: 0,
							title: {
								text: 'Duration (seg)'
							},
							plotLines: plotLineOptions,

						},
						tooltip: {
							enabled: true,
							style: {
								fontSize: '15px'
							},
							formatter: function () {
								return formatMilliseconds(this.y * 1000);
							},
						},

						plotOptions: {
							column: {
								borderWidth: 0
							}
						},

						series: series
					};

					return Highcharts.chart(elem[0], chart);
				}

			});

		}
	}
})();