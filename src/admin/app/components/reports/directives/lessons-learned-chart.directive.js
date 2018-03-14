(function (){
	'use strict';

	angular.module('xpd.reports')
		.directive('lessonsLearnedChart', lessonsLearnedChart);


	lessonsLearnedChart.$inject = ['highchartsService', '$filter'];


	function lessonsLearnedChart(highchartsService, $filter){
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
  				        	backgroundColor: 'transparent',
  				        	height: 350,
  				            spacingTop: 20,
  				            type: 'pie',
  				        },
						legend:{
							labelFormatter: function(){
								return this.name+' '+this.type;
							}
						},
  				        title: {
  					        text: chartTitle,
  					        style:{
  					        	color: '#00807f'
  					        }
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
									distance: 5
  					            },
								point:{
									events:{
										legendItemClick: function () {
											return false;
										}
									}
								}
  					        }
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
						        pointFormat: '{point.name} {point.type}: <b>{point.percentage:.2f}%</b>'
						    }
				        }, {
				            name: 'Percentage',
				            data: chartData.donut,
				            size: '80%',
				            innerSize: '70%',
							tooltip: {
								pointFormatter: function(){
									return ''+this.name +': ' + $filter('secondsToHourMinutes')(this.y);
								}
							}
			        }]
  				    });
				}
			});
		}
	}
})();
