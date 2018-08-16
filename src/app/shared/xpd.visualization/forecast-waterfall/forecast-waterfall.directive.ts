// (function() {
// 	'use strict';

// 	forecastWaterfall.$inject = ['$filter', 'highchartsService'];

import { HighchartsService } from '../../highcharts/highcharts.service';

export class ForecastWaterfallDirective implements ng.IDirective {
	public static $inject: string[] = ['$filter', 'highchartsService'];

	public static Factory(): ng.IDirectiveFactory {
		return (
			$filter: any,
			highchartsService: HighchartsService) => new ForecastWaterfallDirective(
				$filter,
				highchartsService);
	}

	public scope = {
		dataChart: '=',
	};
	public restrict = 'E';

	constructor(
		private $filter: any,
		private highchartsService: HighchartsService) { }

	public link: ng.IDirectiveLinkFn = (
		scope: any,
		element: ng.IAugmentedJQuery,
		attrs: ng.IAttributes,
		ctrl: any,
	) => {

		const self = this;

		const isHorizontal = (attrs.horizontal === true || attrs.horizontal === 'true');

		this.highchartsService.highcharts().then(function (Highcharts) {

			scope.$watch('dataChart', function (dataChart) {
				drawChart( dataChart);
			}, true);

			function drawChart(dataChart) {

				function formatter() {
					return self.$filter('secondsToHourMinutes')(Math.abs(this.y));
				}

				Highcharts.chart(element[0], {

					chart: {
						type: 'waterfall',
						inverted: isHorizontal,
					},

					title: {
						text: null,
					},

					xAxis: {
						type: 'category',
					},

					yAxis: {
						title: {
							text: 'Seconds',
						},
					},

					legend: {
						enabled: false,
					},

					tooltip: {
						formatter,
					},

					series: [{
						upColor: Highcharts.getOptions().colors[2],
						color: Highcharts.getOptions().colors[3],
						data: dataChart,
						dataLabels: {
							enabled: true,
							formatter,
							style: {
								fontWeight: 'bold',
							},
						},
						pointPadding: 0,
					}],
				});

			}

		});

	}

}

// })();
