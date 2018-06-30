(function() {
	'use strict';

	angular.module('xpd.visualization')
		.directive('blockSpeed', blockSpeed);

	blockSpeed.$inject = ['$filter', 'highchartsService', '$xpdInterval'];

	function blockSpeed($filter, highchartsService, $xpdInterval) {
		return {
			scope: {
				blockSpeed: '='
			},
			link: link
		};

		function link(scope, elem, attrs) {
			highchartsService.highcharts().then(function(Highcharts) {
				
				Highcharts.setOptions({
					global: {
						timezoneOffset: new Date().getTimezoneOffset()
					}
				});
				
				$xpdInterval(drawChart, 10000, scope);
				
				function drawChart() {

					var blockSpeed = scope.blockSpeed;

					var chart = {
						
						chart: {
							backgroundColor: 'transparent',
							spacingTop: 2,
							spacingLeft: 2,
							spacingRight: 2,
							zoomType: 'x',
							marginTop: 60,
							type: 'line',
							inverted: true
						},
						
						title: {
							text: 'Block Speed',
							style:{
								color: '#517f89',
								fontSize: '15px',
								fontWeight: 'bold',
								textTransform: 'none'
							}
						},

						yAxis: {
							title: {
								text: 'Speed (m/h)'
							},
							min: -5000,
							max: 5000,
							tickInterval: 500
						},
						
						xAxis: {
							title: {
								text: null
							},
							type: 'datetime'
						},

						//reversed: true
						
						legend: {
							itemStyle:{
								fontSize: '10px'
							},
							layout: 'vertical',
							align: 'right',
							verticalAlign: 'top',
							y: 22,
							floating: true,
						},
						
						tooltip: {
							shared: true,
							crosshairs: true
						},
						
						series: [{
							name: 'Expected',
							color: '#cc0505',
							data: blockSpeed.calculateds
						}, {
							name: 'Actual',
							color: '#75d59e',
							data: blockSpeed.readings
						}]
					};

					Highcharts.chart(elem[0], chart);

				}

			});

		}

	}
})();

// function addReading(readings, currentReading) {
//     if (readings.data.length > 100000)
//         readings.data.shift();

//     readings.addPoint([currentReading.blockSpeed * 3600, new Date(currentReading.timestamp).getTime()], true, true);
// }

// function addCalculated(calculateds, currentCalculated) {
//     if (calculateds.data.length > 100000)
//         calculateds.data.shift();

//     calculateds.addPoint([currentCalculated.speed, new Date(currentCalculated.timestamp).getTime()], true, true);
// }

// load: function() {

//     var series1 = this.series[0];
//     var series2 = this.series[1];

// setInterval(function() {
//     var point = scope.currentReading;

//     if (point.timestamp && series1.dataMax < new Date(point.timestamp).getTime()) {

//         series1.addPoint([+point.speed,
//             new Date(point.timestamp).getTime()
//         ], true, true);

//     }

// }, 1000);

// setInterval(function() {
//     var point = scope.currentCalculated;

//     if (point.timestamp && series2.dataMax < new Date(point.timestamp).getTime()) {

//         series2.addPoint([+point.blockSpeed * 3600,
//             new Date(point.timestamp).getTime()
//         ], true, true);
//     }

// }, 1000);
// }
