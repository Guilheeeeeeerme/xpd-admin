import { HighchartsService } from '../../shared/highcharts/highcharts.service';

// (function() {
// 	'use strict';

export class PieChartDirective {

	public static $inject: string[] = ['$filter', 'highchartsService'];

	public static Factory(): ng.IDirectiveFactory {
		const directive = (
			$filter: any,
			highchartsService: HighchartsService,
		) => new PieChartDirective(
				$filter,
				highchartsService,
			);

		return directive;
	}
	public restrict: 'EA';
	public scope = {
		internalPercentages: '=',
		externalPercentages: '=',
		chartTitle: '=',
	};

	constructor(
		private $filter: any,
		private highchartsService: HighchartsService) {
	}

	public link: ng.IDirectiveLinkFn = (
		scope: any,
		elem: ng.IAugmentedJQuery,
		attrs: ng.IAttributes,
		ctrl: any,
	) => {

		const self = this;

		self.highchartsService.highcharts().then((Highcharts) => {

			scope.$watchGroup([
				'internalPercentages',
				'externalPercentages',
				'chartTitle',
			], (newValue) => {
				if (newValue) {
					createChart();
				}
			});

			const createChart = () => {

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
						text: scope.chartTitle,
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
						data: scope.internalPercentages,
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
						data: scope.externalPercentages,
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
								return '' + this.name + ': ' + self.$filter('secondsToHourMinutes')(this.y);
							},
						},
					}],
				});

			};

		});

	}
}
// }) ();
