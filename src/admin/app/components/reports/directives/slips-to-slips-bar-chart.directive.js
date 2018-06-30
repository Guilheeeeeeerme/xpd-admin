(function() {
	'use strict';

	angular.module('xpd.reports')
		.directive('slipsToSlipsBarChart', slipsToSlipsBarChart);

	slipsToSlipsBarChart.$inject = ['d3Service'];

	function slipsToSlipsBarChart(d3Service) {
		return {
			templateUrl: 'app/components/reports/directives/slips-to-slips-bar-chart.template.html',
			scope: {
				slipsData: '=',
			},
			link: function(scope, element, attrs) {

				scope.dynamicPopover = {
					content: 'content',
					title: 'title'
				};
                

				d3Service.d3().then(function(d3) {

					scope.svg = {
						height: element[0].offsetHeight,
						width: element[0].clientWidth
					};

					scope.$watchCollection('slipsData', function (newValue) {
                    
						drawConnChart(newValue);

					}, true);

				});

				function drawConnChart(slipsData) {

					if (slipsData == null || slipsData.length == 0) return;


					var timeFirstEvent = slipsData[0].startTime;
					var timeLastEvent = slipsData[slipsData.length -1].startTime;

					scope.fromDate = new Date(timeFirstEvent);
					scope.toDate = new Date(timeLastEvent);

					scope.svg.viewBox = '0 0 100 ' + (scope.svg.height * 100) / scope.svg.width;
					scope.yAxisBar = scope.svg.height - 60;
					scope.xAxisBar = scope.svg.width - 60;


					/**
                         * ACTION BUTTONS!
                         */
					scope.getFillColor = getFillColor;  

					scope.xScale = d3.time.scale().domain([scope.fromDate, scope.toDate]).range([60, scope.xAxisBar]);
                        
					scope.xScale.domain([scope.fromDate, scope.toDate]);
					scope.xTicks = scope.xScale.ticks();

					scope.dateFormat = d3.time.format('%m/%d %I:%M');

					scope.yScale = d3.scale.linear().domain([0, +attrs.maxSeconds*1000]).range([scope.yAxisBar, 20]);
					scope.yTicks = scope.yScale.ticks();
					scope.getXPosition = getXPosition;

					scope.bar = {
						width: ((scope.svg.width * 200) / scope.svg.height) / (scope.slipsData.length * 1.5)
					};
				}

				function redrawConnChart(fromDate, toDate) {

					scope.xScale = d3.time.scale().domain([new Date(fromDate), new Date(toDate)]).range([40, scope.svg.width]);
					scope.xTicks = scope.xScale.ticks();
				}

				function getFillColor(event) {

					if (event.eventType == 'CONN') {

						if (event.duration >= 1000 / event.vpoor) {
							return '#860000';
						} else if (event.duration >= 1000 / event.vstandard && event.duration < 1000 / event.vpoor) {
							return '#ffe699';
						} else {
							return '#73b9c6';
						}

					} else if (event.eventType == 'TRIP') {

						if (event.duration >= (1000 * scope.averageStandLength) / event.vpoor) {
							return '#860000';
						} else if (event.duration >= (1000 * scope.averageStandLength) / event.vstandard && event.duration < (1000 * scope.averageStandLength) / event.vpoor) {
							return '#ffe699';
						} else {
							return '#73b9c6';
						}

					}

				}

				function getXPosition(stringDate) {
					return scope.xScale(new Date(stringDate));
				}
			}
		};
	}
})();
