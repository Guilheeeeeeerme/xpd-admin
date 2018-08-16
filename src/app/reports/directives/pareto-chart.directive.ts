import { HighchartsService } from '../../shared/highcharts/highcharts.service';

// (function() {
	// 	'use stric';

export class ParetoChartDirective {

	public static $inject: string[] = ['highchartsService'];

	public static Factory(): ng.IDirectiveFactory {
		const directive = (
			highchartsService: HighchartsService,
		) => new ParetoChartDirective(
			highchartsService,
			);

		return directive;
	}
	public restrict: 'EA';
	public scope = {
		chartTitle: '=',
		primaryDataTitle: '=',
		primaryData: '=',
		secondaryDataTitle: '=',
		secondaryData: '=',
		categories: '=',
		percentage: '=',
	};

	constructor(
		private highchartsService: HighchartsService) {
	}

	public link: ng.IDirectiveLinkFn = (
		scope: any,
		elem: ng.IAugmentedJQuery,
		attrs: ng.IAttributes,
		ctrl: any,
	) => {
		this.highchartsService.highcharts().then(function (Highcharts) {

			scope.$watchGroup([
				'chartTitle',
				'primaryData',
				'primaryDataTitle',
				'secondaryData',
				'secondaryDataTiel',
				'percentageData',
			], function (newValue) {
				if (newValue) {
					createChart();
				}
			});

			function createChart() {

				return Highcharts.chart(elem[0], {
					chart: {
						zoomType: 'xy',
						backgroundColor: 'transparent',
					},
					legend: {
						itemStyle: {
							fontSize: '13px',
						},
					},
					title: {
						text: scope.chartTitle,
						style: {
							color: '#00807f',
						},
					},
					xAxis: [{
						categories: scope.categories,
						crosshair: true,
						labels: {
							style: {
								fontSize: '15px',
							},
						},
					}],
					yAxis: [{ // Secondary yAxis
						title: null,
						labels: {
							format: '{value}',
							style: {
								color: Highcharts.getOptions().colors[0],
								fontSize: '20px',
							},
						},

					}, { // Primary yAxis
						max: 100,
						min: 0,
						labels: {
							format: '{value}%',
							style: {
								color: '#ffe80e',
								fontSize: '20px',
							},
						},
						title: null,
						opposite: true,
					}],
					tooltip: {
						shared: true,
					},

					plotOptions: {
						column: {
							stacking: 'normal',
							dataLabels: {
								style: {
									fontSize: '15px',
									fontWeight: 'bold',
								},
								enabled: true,
								color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
							},
						},
					},
					series: [
						{
							name: scope.primaryDataTitle,
							type: 'column',
							data: scope.primaryData,
							showInLegend: false,
						}, {
							name: scope.secondaryDataTitle,
							type: 'column',
							color: Highcharts.getOptions().colors[2],
							data: scope.secondaryData,
							showInLegend: false,
						}, {
							name: 'Accumulated %',
							type: 'spline',
							yAxis: 1,
							color: '#ffe80e',
							data: scope.percentage,
							showInLegend: true,
							tooltip: {
								pointFormat: 'Value: {point.y:.2f} %',
							},
						}],
				});
			}
		});
	}
}
// }) ();
