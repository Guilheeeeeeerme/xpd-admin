(function (){
	'use stric';

	angular.module('xpd.reports')
		.directive('failuresParetoChart', failuresParetoChart);


	failuresParetoChart.$inject = ['highchartsService'];


	function failuresParetoChart(highchartsService){
		return {
			restrict: 'EA',
			scope: {
				chartData: '=',
				chartTitle: '='
			},
			link: link,
		};


		function link(scope, elem, attr){
			highchartsService.highcharts().then(function(Highcharts){

				scope.$watchGroup(['chartData', 'chartTitle'], function(newValue){
					if(newValue){
						createChart(newValue[0], newValue[1]);
					}
				});


				function createChart(chartData, chartTitle){

					return Highcharts.chart(elem[0], {
						chart: {
							zoomType: 'xy',
							backgroundColor: 'transparent'
						},
						title: {
							text: chartTitle,
							style:{
								color: '#00807f'
							}
						},
						legend:{
							itemStyle: {
								fontSize: '13px'
							}
						},
						xAxis: [{
							categories: chartData.categories,
							crosshair: true,
							labels: {
								style: {
									fontSize: '15px'
								}
							}
						}],
						yAxis: [ { // Secondary yAxis
							title: null,
							labels: {
								format: '{value}',
								style: {
									color: Highcharts.getOptions().colors[0],
									fontSize: '20px'
								}
							},

						},{ // Primary yAxis
							max: 100,
							min: 0,
							labels: {
								format: '{value}%',
								style: {
									color: '#ffe80e',
									fontSize: '20px'
								}
							},
							title: null,
							opposite: true
						}],
						tooltip: {
							shared: true
						},

						plotOptions: {
							column: {
								stacking: 'normal',
								dataLabels: {
									style:{
										fontSize: '15px',
										fontWeight: 'bold'
									},
									enabled: true,
									color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
								}
							}
						},
						series: [
							{
								name: 'Failures',
								type: 'column',
								data: chartData.failures,
								showInLegend: false
							},{
								name: 'NPT',
								type: 'column',
								color: Highcharts.getOptions().colors[2],
								data: chartData.npts,
								showInLegend: false
							},{
								name: 'Accumulated %',
								type: 'spline',
								yAxis: 1,
								color: '#ffe80e',
								data: chartData.percentage,
								showInLegend: true,
								tooltip: {
									pointFormat: 'Value: {point.y:.2f} %'
								}
							}]
  				    });
  				}
  			});
  		}
  	}
})();
