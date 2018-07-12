(function() {
	'use strict';

	angular.module('xpd.forecast-waterfall', [])
		.directive('forecastWaterfall', forecastWaterfall);

	forecastWaterfall.$inject = ['$filter', 'highchartsService'];

	function forecastWaterfall($filter, highchartsService) {
		return {
			scope: {
				dataChart: '=',
			},
			restrict: 'E',
			templateUrl: '../xpd-resources/ng/xpd.forecast-waterfall/forecast-waterfall.template.html',
			link,
		};

		function link(scope, element, attrs) {

			let isHorizontal = (attrs.horizontal == true || attrs.horizontal == 'true');

			highchartsService.highcharts().then(function(Highcharts) {

				scope.$watch('dataChart', function(dataChart) {
					drawChart(Highcharts, dataChart);
				}, true);

				function drawChart(Highcharts, dataChart) {

					function formatter() {
						return $filter('secondsToHourMinutes')(Math.abs(this.y));
					}

					Highcharts.chart('container', {

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

})();
