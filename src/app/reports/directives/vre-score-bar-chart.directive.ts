import { HighchartsService } from '../../shared/highcharts/highcharts.service';

// (function() {
// 	'use strict';

export class VreScoreBarChart {

	public static $inject: string[] = ['highchartsService'];

	public static Factory(): ng.IDirectiveFactory {
		const directive = (
			highchartsService: HighchartsService,
		) => new VreScoreBarChart(
			highchartsService,
		);

		return directive;
	}
	public restrict: 'EA';
	public scope = {
		chartCategories: '=',
		chartData: '=',
		chartScale: '=',
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

		this.highchartsService.highcharts().then(function (Highcharts) {

			scope.$watchGroup(['chartCategories', 'chartData'], function (newValues) {
				if (!!newValues && !!newValues[0] && !!newValues[1]) {
					createChart(newValues[0], newValues[1]);
				}
			}, true);

			function createChart(chartCategories, chartData) {

				const series = getDataSeries(chartData);

				const highcharts = {

					chart: {
						type: 'column',
						height: 315,
						spacingBottom: 0,
						spacingTop: 20,
						zoomType: 'x',
					},
					title: {
						text: null,
					},
					xAxis: {
						categories: chartCategories,
						labels: {
							formatter() {
								if (this.value === 'TOTAL') {
									return this.value;
								}
								return formatDate(this.value);
							},
						}, plotBands: {
							color: '#F5F5F5',
							from: chartCategories.length - 1.5,
							to: chartCategories.length - 0.5,
							className: 'vre-score-bar-chart-total-plotband',
						},
					},
					yAxis: [{
						labels: {
							formatter() {
								if (this.value >= 0) {
									return this.value;
								}
							},
							style: {
								color: '#00807f',
							},
						},
						max: 100,
						min: -100,
						title: {
							text: 'Consistence',
						},
					}, {
						opposite: true,
						labels: {
							style: {
								color: '#00807f',
							},
						},
						max: 20,
						min: -20,
						title: {
							text: 'VRE',
						},
					}],
					legend: {
						shadow: false,
					},
					tooltip: {
						shared: true,
						valueDecimals: 2,
					},
					plotOptions: {
						column: {
							grouping: false,
							shadow: false,
							borderWidth: 0,
						},
					},
					series,
				};

				return Highcharts.chart(element[0], highcharts);
			}

			function negativeOnly(vre) {
				if (vre < 0) {
					return vre;
				} else {
					return null;
				}
			}

			function positiveOnly(vre) {
				if (vre < 0) {
					return null;
				} else {
					return vre;
				}
			}

			function getDataSeries(data) {

				const series = [];

				const positiveVre = data.vre.map(positiveOnly);
				const negativeVre = data.vre.map(negativeOnly);

				series.push({
					name: 'VRE',
					color: '#9dc3e7',
					data: positiveVre,
					pointPadding: 0,
					className: 'vre-score-any-bar',
				});

				series.push({
					name: 'VRE',
					color: '#cc0505',
					data: negativeVre,
					pointPadding: 0,
					className: 'vre-score-any-bar',
				});

				series.push({
					name: 'Consistence',
					data: data.score,
					pointPadding: 0.1,
					color: '#299090',
					className: 'vre-score-any-bar',
				});

				if (data.maxVre) {
					series.push({
						name: 'MAX VRE',
						type: 'line',
						dashStyle: 'Dot',
						color: '#1ca301',
						data: data.maxVre,
						pointPadding: 0,
						marker: {
							radius: 3,
						},
						yAxis: 1,
						zIndex: 3,
						className: 'vre-score-any-bar',
					});
				}

				return series;
			}

			function formatDate(value) {
				if (scope.chartScale === 'day') {
					return Highcharts.dateFormat('%b %d', new Date(value));
				}

				return Highcharts.dateFormat('%b', new Date(value));
			}
		});

	}
}
// })();
