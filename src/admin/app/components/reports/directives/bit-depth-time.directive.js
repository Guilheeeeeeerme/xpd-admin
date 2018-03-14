/*
 * @Author: Gabriel Roriz
 * @Date:   2017-07-13 16:28:42
 * @Last Modified by:   Gezzy Ramos
 * @Last Modified time: 2017-11-07 15:07:30
 */
(function() {
	'use strict';

	angular.module('xpd.reports')
		.directive('bitDepthTime', bitDepthTime);

	bitDepthTime.$inject = ['highchartsService', 'd3Service', '$filter'];

	function bitDepthTime(highchartsService, d3Service, $filter) {
		return {
			restrict: 'EA',
			scope: {
				chartData: '=',
				setCurrentPlannedEvent: '&',
				setCurrentExecutedEvent: '&',
				setHoleDepth: '&',
				setCurrentPoint: '&'				
			},
			link: link,
		};

		function link(scope, elem, attr) {

			d3Service.d3().then(function(d3) {

				highchartsService.highcharts().then(function(Highcharts) {

					onDependenciesReady(Highcharts, d3);

				});

			});

			function onDependenciesReady(Highcharts, d3) {

				var colorPallete = d3.scale.category10();
				var plannedLocked = false;
				var executedLocked = false;
				var indexSelectedPoint = null;

				var lastPoint = null;
				var lastPointBackup = null;

				var currentPoint;

				var bitDepthVsTimeChart;

				scope.$watch('chartData', function(chartData) {
					if (chartData){
						createChart(chartData.bitDepthPlannedPoints,
							chartData.bitDepthExecutedPoints,
							chartData.holeDepthPoints,
							chartData.sectionsBands,
							chartData.startChartAt);
					}
				});

				function markerWhenObjectIsSelected() {
					return {
						enabled: true,
						symbol: 'circle',
						fillColor: '#00FFFF',
						radius: 5
					};
				}

				function setSectionColors(section) {

					if (section.id == 0) {	// water depth
						section.color = '#40a4df';
					} else {
						section.color = colorPallete( (section.id + 2) % 10);
					}

					section.className = 'bit-depth-time-highcharts-plot-band';
					section.label.className = 'bit-depth-time-highcharts-plot-band-label';

					return section;
				}

				function createChart(bitDepthPlannedPoints, bitDepthExecutedPoints, holeDepthPoints, sectionsBands, startChartAt) {

					var plotBands = (!sectionsBands) ? [] : sectionsBands.map(setSectionColors);

					bitDepthVsTimeChart = Highcharts.chart(elem[0], {
					
						chart: {
							type: 'coloredline',
							backgroundColor: 'rgba(0,0,0,0)',
							zoomType: 'x',
							height: 450,
							events: {
								click: onChartClick
							}
						},
					
						title: {
							text: null
						},
					
						xAxis: {
							crosshair: true,
							shared: true,
							min: startChartAt,
							title: {
								text: 'Day(s)'
							},
							type: 'datetime'
						},

						yAxis: {
							reversed: true,
							title: {
								text: 'Depth'
							},
							plotBands: plotBands
						},

						tooltip: {
							enabled: false
						},
						plotOptions: {
							series: {
								turboThreshold: 0,
								pointStart: 2010,
								connectNulls: true,
								point: {
									events: {
										mouseOver: onChartHover,
										click: onChartClick
									}
								}
							}
						}
					});

					if (holeDepthPoints) {					
						holeDepthPoints.color = 'rgba(180, 180, 180, 0.75)';
						holeDepthPoints.lineWidth = 10;
						bitDepthVsTimeChart.addSeries(holeDepthPoints);
					}

					if (bitDepthPlannedPoints) {
						bitDepthPlannedPoints.zIndex = 2;
						bitDepthVsTimeChart.addSeries(bitDepthPlannedPoints);
					}

					if (bitDepthExecutedPoints) {
						bitDepthExecutedPoints.zIndex = 3;
						bitDepthVsTimeChart.addSeries(bitDepthExecutedPoints);
					}

					return bitDepthVsTimeChart;
				}

				/**
			 *	Events
			 **/

				function unmarkLastPoint(){
					if(!lastPoint)
						return;

					lastPoint.update(lastPointBackup);


					lastPoint = null;
					lastPointBackup = null;
				}

				function markCurrentPoint(){

					if(!currentPoint)
						return;


					lastPoint = currentPoint;

					lastPointBackup = {
						x: currentPoint.x,
						y: currentPoint.y,
						color: currentPoint.color || null,
						segmentColor: currentPoint.segmentColor || null,
						marker: currentPoint.marker || null
					};

					currentPoint.update({
						y: currentPoint.y,
						x: currentPoint.x,
						color: currentPoint.color || null,
						segmentColor: currentPoint.segmentColor || null,
						marker: markerWhenObjectIsSelected()
					});

				}

				function onChartClick() {

					enableOrDisableMouseOver();

					unmarkLastPoint();

					/**
					 * Se um dos pontos for fixado
					 * eu o marco no grafico
					 */
					if (plannedLocked || executedLocked){
						markCurrentPoint();
					}
			
				}

				function enableOrDisableMouseOver() {

					/**
					 * Se algum dos pontos estiverem fixados
					 * libera o hover dos dois.
					 */
					if(plannedLocked || executedLocked){
						plannedLocked = false;
						executedLocked = false;
						indexSelectedPoint = null;
						return;
					}

					/**
					 * Caso nenhum ponto esteja fixo
					 * verifico sua linha e fixo o ponto clicado
					 */
					if (currentPoint.lineType == 'planned'){
						plannedLocked = !plannedLocked;
						indexSelectedPoint = currentPoint.series.index;
					} else{
						executedLocked = !executedLocked;
						indexSelectedPoint = currentPoint.series.index;
					}
				}

				function setEndEventDate(event, index, data) {

					if(!event || !data[index])
						return;

					event.startDate = ((index != 0) ? data[index - 1].x : data[index].x);
					event.endDate = data[index].x;

					return event;
				}

				function onChartHover () {

					currentPoint = this;

					var plannedOfPoint = getPointFromSerieByX(bitDepthVsTimeChart.series[0], this.x);
					var executedOfPoint = getPointFromSerieByX(bitDepthVsTimeChart.series[1], this.x);
					var holeDepthOfPoint = getPointFromSerieByX(bitDepthVsTimeChart.series[2], this.x);

					/** Marca no ponto qual linha ele pertence */
					if(currentPoint == plannedOfPoint)
						currentPoint.lineType = 'planned';
					else
						currentPoint.lineType = 'executed';

					if(plannedOfPoint){
						var plannedEvent = getEventFromPointOfASerie(plannedOfPoint, bitDepthVsTimeChart.series[0]);
						plannedEvent = setEndEventDate(
							plannedEvent,
							plannedOfPoint.index,
							bitDepthVsTimeChart.series[0].points
						);
					}

					if(executedOfPoint){
						var executedEvent = getEventFromPointOfASerie(executedOfPoint, bitDepthVsTimeChart.series[1]);
						executedEvent = setEndEventDate(
							executedEvent,
							executedOfPoint.index,
							bitDepthVsTimeChart.series[1].points
						);
					}

					var holeDepth = getDepthFromPointOfASerie(holeDepthOfPoint, bitDepthVsTimeChart.series[2]);
					var plannedDepth = getDepthFromPointOfASerie(plannedOfPoint, bitDepthVsTimeChart.series[0]);
					var executedDepth = getDepthFromPointOfASerie(executedOfPoint, bitDepthVsTimeChart.series[1]);

					try{
						var highLigth;
						
						if(indexSelectedPoint != null)
							highLigth = indexSelectedPoint;
						else
							highLigth = currentPoint.series.index;

						// highLigth
						scope.setCurrentPoint({
							event: {
								index: highLigth
							}
						});

					}catch(e){

					}

					if (!plannedLocked) {
						scope.setCurrentPlannedEvent({
							event: plannedEvent
						});
					}

						
					if(!executedLocked) {
						scope.setCurrentExecutedEvent({
							event: executedEvent
						});
					}
						

					scope.setHoleDepth({
						event: holeDepth
					});

					return null;
						
				}

				function getDepthFromPointOfASerie(point, series) {
					return {
						depth: (point) ? point.y : null
					};
				}

				function getEventFromPointOfASerie(point, series) {
					try {
						return series.hcEvents[point.index][0];
					} catch (e) {
						return null;
					}
				}

				function getPointFromSerieByX(serie, x) {
					var point = null;

					if(serie){
						for (var i = 1; i < serie.points.length; i++) {
						
							var pontoAnterior = serie.points[i - 1];
							var proximoPonto = serie.points[i];

							if ( x >= pontoAnterior.x && x <= proximoPonto.x ){

								var distanciaParaAnterior = Math.abs( x - pontoAnterior.x );
								var distanciaParaProximo = Math.abs( x - proximoPonto.x );

								if(distanciaParaAnterior <= distanciaParaProximo){
									return pontoAnterior;
								}else{
									return proximoPonto;
								}
							}
						}
					}

					return point;
				}

			}

		}

	}
})();