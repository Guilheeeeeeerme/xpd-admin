import { HighchartsService } from '../../shared/highcharts/highcharts.service';

export class DepthLineChartDirective implements ng.IDirective {
	public static $inject: string[] = ['$timeout', 'highchartsService'];

	public static Factory(): ng.IDirectiveFactory {
		const directive = (
			$timeout: any,
			highchartsService: HighchartsService,
		) => new DepthLineChartDirective(
			$timeout,
			highchartsService,
			);

		return directive;
	}

	public scope = {
		chartPlannedData: '=',
		chartRealizedData: '=',
		plotBandsPlannedData: '=',
	};

	public restrict: 'EA';

	constructor(
		private $timeout: any,
		private highchartsService: HighchartsService) {
	}

	public link: ng.IDirectiveLinkFn = (
		scope: any,
		element: ng.IAugmentedJQuery,
		attrs: ng.IAttributes,
		ctrl: any,
	) => {

		this.highchartsService.highcharts().then((Highcharts) => {

			const createChart = () => {

				return Highcharts.chart(attrs.id, {
					chart: {
						zoomType: 'x',
						backgroundColor: null,
						style: {
							color: '#93c2cc',
						},
					},
					title: {
						text: attrs.title,
						style: {
							color: '#93c2cc',
						},
					},
					// subtitle: {
					//     text: document.ontouchstart === undefined ?
					//             'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
					// },
					xAxis: {
						type: 'datetime',
						labels: {
							style: {
								color: '#93c2cc',
							},
						},
					},
					yAxis: {
						title: {
							text: 'Depth',
						},
						reversed: true,
						minorGridLineWidth: 0,
						gridLineWidth: 0,
						labels: {
							style: {
								color: '#93c2cc',
							},
							formatter() {
								return this.value + 'm';
							},
						},
					},

					legend: {
						enabled: true,
						itemStyle: {
							color: '#93c2cc',
						},
						itemHoverStyle: {
							color: '#93c2cc',
						},
					},
					plotOptions: {
						area: {
							fillColor: {
								linearGradient: {
									x1: 0,
									y1: 0,
									x2: 0,
									y2: 1,
								},
								stops: [
									[0, Highcharts.getOptions().colors[0]],
									[1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')],
								],
							},
							marker: {
								radius: 2,
							},
							lineWidth: 1,
							states: {
								hover: {
									lineWidth: 1,
								},
							},
							threshold: null,
						},
					},

					series: [
						{
							name: 'V. Optimum',
							data: scope.chartPlannedData.vOptimum,
							color: '#22ad24',
							lineWidth: 2,
						},
						{
							name: 'V. Poor',
							data: scope.chartPlannedData.vPoor,
							color: '#eb9c0b',
							lineWidth: 1,
						},
						{
							name: 'V. Standard',
							data: scope.chartPlannedData.vStandard,
							color: '#FFFFFF',
							lineWidth: 1,
						},
						{
							name: 'Realized',
							data: scope.chartRealizedData,
						},
					],
				});

			};

			const redrawChart = (chartPlannedData, chartRealizedData, plotBandsPlannedData) => {

				objChart.series[0].setData(chartPlannedData.vOptimum, true);
				objChart.series[1].setData(chartPlannedData.vPoor, true);
				objChart.series[2].setData(chartPlannedData.vStandard, true);

				objChart.series[3].setData(chartRealizedData, true);

				// tslint:disable-next-line:prefer-for-of
				for (let i = 0; i < plotBandsPlannedData.length; i++) {
					objChart.yAxis[0].addPlotBand({
						from: plotBandsPlannedData[i].from,
						to: plotBandsPlannedData[i].to,
						color: plotBandsPlannedData[i].backgroundColor,
						label: {
							text: plotBandsPlannedData[i].text,
							style: {
								color: plotBandsPlannedData[i].textColor,
							},
						},
					});
				}

			};

			const objChart = createChart();

			scope.$watchGroup(['chartPlannedData', 'chartRealizedData', 'plotBandsPlannedData'], function (newValues) {
				this.$timeout(() => {
					redrawChart(newValues[0], newValues[1], newValues[2]);
				}, 500, scope);
			}, true);
		});

	}
}
