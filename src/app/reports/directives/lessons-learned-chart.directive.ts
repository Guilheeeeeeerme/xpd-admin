import { HighchartsService } from '../../shared/highcharts/highcharts.service';

// (function() {
// 	'use strict';

export class LessonsLearnedChart {

	public static $inject: string[] = ['highchartsService', '$filter'];
	public restrict: 'EA';
	public scope = {
		chartData: '=',
		chartTitle: '=',
	};

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

		this.highchartsService.highcharts().then(function (Highcharts) {

			scope.$watchGroup(['chartData', 'chartTitle'], function (newValue) {
				if (newValue) {
					createChart(newValue[0], newValue[1]);
				}
			});

			function createChart(chartData, chartTitle) {

				return Highcharts.chart(elem[0], {

					chart: {
						backgroundColor: 'transparent',
						height: 350,
						spacingTop: 20,
						type: 'pie',
					},
					legend: {
						labelFormatter() {
							return this.name + ' ' + this.type;
						},
					},
					title: {
						text: chartTitle,
						style: {
							color: '#00807f',
						},
					},
					plotOptions: {
						pie: {
							allowPointSelect: true,
							cursor: 'pointer',
							dataLabels: {
								enabled: true,
								format: '{point.name}: {point.percentage:.2f} %',
								style: {
									fontSize: '15px',
								},
								distance: 5,
							},
							point: {
								events: {
									legendItemClick() {
										return false;
									},
								},
							},
						},
					},
					series: [{
						name: 'Percentage',
						data: chartData.pie,
						allowPointSelect: false,
						size: '50%',
						dataLabels: {
							enabled: false,
						},
						tooltip: {
							pointFormat: '{point.name} {point.type}: <b>{point.percentage:.2f}%</b>',
						},
					}, {
						name: 'Percentage',
						data: chartData.donut,
						size: '80%',
						innerSize: '70%',
						tooltip: {
							pointFormatter() {
								return '' + this.name + ': ' + this.$filter('secondsToHourMinutes')(this.y);
							},
						},
					}],
				});
			}
		});
	}

	public static Factory(): ng.IDirectiveFactory {
		const directive = (
			$filter: ng.IFilterFilter,
			highchartsService: HighchartsService,
		) => new LessonsLearnedChart(
			$filter,
			highchartsService,
			);

		return directive;
	}
}
// }) ();
