(function () {
	'use strict';
	
	angular.module('xpd.reports')
		.directive('eventDurationHistogram', eventDurationHistogram);

	eventDurationHistogram.$inject = ['highchartsService'];

	function eventDurationHistogram(highchartsService) {
		return{
			restrict: 'EA',
			scope:{
				chartData: '='
			},
			link: link,
			templateUrl: 'app/components/reports/directives/event-duration-histogram.template.html',
		};

		function link(scope, elem, attr){
			highchartsService.highcharts().then(function(Highcharts){
				var chart;
				var chartData = [];
				var binSize = 60;
				var extremes = {
					min: null,
					max: null
				};

				scope.binMinutes = 1;
				scope.binSeconds = 0;

				scope.actionButtonApply = actionButtonApply;
				scope.actionButtonApplyExtremes = actionButtonApplyExtremes;
				scope.actionButtonShowLastParameters = actionButtonShowLastParameters;
				scope.actionButtonHideParameters = actionButtonHideParameters;

				scope.$watch('chartData', function(newValue){
					if(newValue){
						chartData = newValue;
						renderChart();
					}
				}, true);

				function renderChart(fromBin){

					var container = elem[0].querySelectorAll('.histogram-container')[0];

					var jointLength =  (chartData.label.toLowerCase().indexOf('trip')>-1?chartData.jointLength:1);
					var vporEventDuration = jointLength / (chartData.vpoor / 3600);
					var vstdEventDuration = jointLength / (chartData.vstandard / 3600);
					var voptEventDuration = jointLength / (chartData.voptimum / 3600);

					var histogramData = histogram(chartData.points, binSize);

					var showResetZoom = chart && chart.resetZoomButton && chart.resetZoomButton !== null;

					scope.showDiffMessage = chartData['diff-op'];

					chart = Highcharts.chart(container, {
						chart: {
							type: 'column',
							height: 300,
							zoomType: 'x'
						},
						title: {
							text: chartData.label
						},
						xAxis: {
							gridLineWidth: 1,
							title: {
								text: 'Event Duration'
							},
							tickInterval: binSize,
							labels: {
								formatter: function (){
									return formatSeconds(this.value);
								}
							},
							events:{
								afterSetExtremes: function(event){
									setExtremesInput(event);
								}
							},
							plotLines:[
								createPlotLine('V Por', vporEventDuration, 'red'),
								createPlotLine('V Std', vstdEventDuration, 'yellow'),
								createPlotLine('V Opt', voptEventDuration, '#337ab7')
							]
						},
						yAxis: [{
							title: {
								text: 'Frequency'
							}
						}, {
							opposite: true,
							title: {
								text: 'Index'
							}
						}],
						tooltip: {
					        formatter: function () {
					            if(this.series.name==='Event Data')
									var s = 'Event duration: '+formatSeconds(this.x);
								else{
									var s = '('+formatSeconds(this.x)+' - '+formatSeconds(this.x+binSize)+')';
									s+='<br>Frequency: '+this.y;
								}

					            return s;
					        },
					        shared: false
					    },
						series: [{
							name: 'Histogram',
							type: 'column',
							data: histogramData,
							pointPadding: 0,
							groupPadding: 0,
							pointPlacement: 'between',
							pointRange: binSize
						}, {
							name: 'Event Data',
							type: 'scatter',
							data: chartData.points,
							yAxis: 1,
							marker: {
								radius: 1.5
							}
						}]
					});

					if(scope.showDiffMessage)
						window.chart = chart;

					if(!fromBin)
						setExtremesFromHistoData(histogramData);
					else
						setExtremesFromExtremes(showResetZoom);
				}

				function actionButtonApply(){
					var minutes = scope.binMinutes || 0;
					var seconds = scope.binSeconds || 0;

					binSize = minutes * 60 + seconds;
					renderChart(true);
				}

				function actionButtonApplyExtremes(){
					var maxMinutes = scope.maxMinutes || 0;
					var maxSeconds = scope.maxSeconds || 0;

					var minMinutes = scope.minMinutes || 0;
					var minSeconds = scope.minSeconds || 0;

					extremes.min = (minMinutes * 60) + minSeconds;
					extremes.max = (maxMinutes * 60) + maxSeconds;

					chart.xAxis[0].setExtremes(extremes.min, extremes.max, true);
					
					chart.showResetZoom();
				}

				function actionButtonShowLastParameters(){
					scope.showDiffMessage = false;
				}

				function actionButtonHideParameters(){
					chart.xAxis[0].removePlotLine('V Por');
					chart.xAxis[0].removePlotLine('V Std');
					chart.xAxis[0].removePlotLine('V Opt');
					scope.showDiffMessage = false;
				}

				function histogram(data, step) {
					var histo = {},
						x,
						i,
						arr = [];

			        // Group down
			        for (i = 0; i < data.length; i++) {
			        	x = Math.floor(data[i][0] / step) * step;
			        	if (!histo[x]) {
			        		histo[x] = 0;
			        	}
			        	histo[x]++;
			        }

			        // Make the histo group into an array
			        for (x in histo) {
			        	if (histo.hasOwnProperty((x))) {
			        		arr.push([parseFloat(x), histo[x]]);
			        	}
			        }

			        // Finally, sort the array
			        arr.sort(function (a, b) {
			        	return a[0] - b[0];
			        });

			        return arr;
			    }

			    function setExtremesFromHistoData(data){
			    	var firstValue = data[0][0];
			    	var lastValue = data[data.length-1][0] + binSize;

			    	extremes.min = firstValue;
			    	extremes.max = lastValue;

			    	chart.xAxis[0].setExtremes(extremes.min, extremes.max, true);
			    }

			    function setExtremesFromExtremes(showResetZoom){
			    	chart.xAxis[0].setExtremes(extremes.min, extremes.max, true);

			    	if(showResetZoom){
			    		chart.showResetZoom();
			    	}
			    }

			    function setExtremesInput(event){
			    	scope.minMinutes = parseInt( event.min/60 );
			    	scope.minSeconds = parseInt( event.min%60 );

			    	scope.maxMinutes = parseInt( event.max/60 );
			    	scope.maxSeconds = parseInt( event.max%60 );

			    	if(event.trigger)
			    		scope.$apply();
			    }

			    function formatSeconds(durationSeconds){
					var minutes = parseInt(durationSeconds/60);
					var seconds = parseInt(durationSeconds%60);

					return minutes+'m:'+seconds+'s';
			    }

			    function createPlotLine(label, value, color){
			    	return {
						id: label,
						color: color,
						width: 2,
						value: value,
						zIndex: 10000,
						label: {
							text: label,
							rotation: 0,
							y: -3,
							x: -2,
							style: {
								color: color,
								fontWeight: 'bold',
								fontSize: '14px'
							}
						}
					};
			    }
			});
		}
	}
})();