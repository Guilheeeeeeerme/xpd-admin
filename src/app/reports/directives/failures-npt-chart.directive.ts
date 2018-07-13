
// (function() {
// 	'use strict';

// 	angular.module('xpd.reports').directive('failuresNptChart', failuresNptChart);

import { HighchartsService } from '../../../xpd-resources/ng/highcharts/highcharts.service';

export class FailuresNptChartDirective {

	public static $inject: string[] = ['highchartsService', '$filter'];
	public restrict: 'EA';
	public scope: {
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

			function createChart(chartData, title) {
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
						text: title,
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
						dataLabels: {
							formatter() {
								// display only if larger than 1
								return this.y > 1 ? '<b>' + this.point.name + ':</b> ' + this.y + '%' : null;
							},
						},
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
		) => new FailuresNptChartDirective(
				$filter,
				highchartsService,
			);

		return directive;
	}
}
// }) ();
