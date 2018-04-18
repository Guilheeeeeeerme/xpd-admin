(function () {
	'use strict';

	angular.module('xpd.visualization')
		.directive('eventChart', eventChart);

	eventChart.$inject = ['d3Service'];

	function eventChart(d3Service) {
		return {
			templateUrl: '../xpd-resources/ng/xpd.visualization/event-chart.template.html',
			scope: {
				// averageStandLength: '=',
				// actionBarClick: '=',
				// actionBarDoubleClick: '=',
				// selectedEvent: '=',
				// verticalMode: '=?'
				events: '=',
				eventType: '=',
				currentEvent: '=',
				currentOperation: '='
			},
			link: function (scope, element, attrs) {
				var a = 1;
				

				scope.verticalMode = angular.isDefined(scope.verticalMode) ? scope.verticalMode : false;

				scope.dynamicPopover = {
					content: 'content',
					title: 'title'
				};

				d3Service.d3().then(function (d3) {

					setViewMode();

					scope.gatBarProperties = gatBarProperties;

					function gatBarProperties(event) {

						var bar = {
							width: 0,
							height: 0,
							position: 0,
							color: '',
						};
						var eventDuration;

						if (event.duration) {
							eventDuration = event.duration;
						} else { // current event
							// eventDuration = currentEventDuration(event);
						}
							
						bar.width = scope.xScale(eventDuration) - scope.xScale(0);
						// console.log(bar);
						

						var yScale = d3.scale.linear()
							.domain([event.vtarget * 2, event.vpoor / 2])
							.range([scope.svgViewHeight / 5, scope.svgViewHeight])
							.clamp(true);

						var displacement = 1;
						if (event.eventType === 'TRIP') {
							displacement = Math.abs(event.startBlockPosition - event.endBlockPosition);
						}
						
						var actualSpeed = displacement / (eventDuration / 1000);
						bar.height = yScale(actualSpeed);
						bar.position = scope.svgViewHeight - bar.height;

						if (actualSpeed >= event.voptimum) {
							bar.color = '#73b9c6';
						} else if (actualSpeed < event.voptimum && actualSpeed >= event.vstandard) {
							bar.color = '#0FA419';
						} else if (actualSpeed < event.vstandard && actualSpeed >= event.vpoor) {
							bar.color = '#ffe699';
						} else {
							bar.color = '#860000';
						}

						console.log(scope.eventType)
						console.log(scope.currentEvent.eventType)
						if(event.id == scope.currentEvent.id && scope.eventType == scope.currentEvent.eventType) {
							// bar.width = scope.xScale(currentEventDuration(event)) - scope.xScale(0);
							console.log('bar', bar)
							currentEventBar(bar);
							// return bar;
						} else {
							return bar;
						}
					}

					function setViewMode() {

						scope.svg = {
							height: element[0].offsetHeight,
							width: element[0].clientWidth
						};

						scope.svgViewHeight = (scope.svg.width * 100) / scope.svg.height;

						scope.svg.viewBox = '0 0 100 ' + scope.svgViewHeight;
						
						var startDate = new Date(scope.currentOperation.startDate);
						var mindate = new Date(scope.currentOperation.startDate).getTime();
						var maxdate = new Date().setHours(startDate.getHours() + 0.5);

						scope.xScale = d3.scale.linear().domain([mindate, maxdate]).range([0, 100]);
						scope.xTicks = scope.xScale.ticks();
					}


					function currentEventDuration(event) {
						if(event.id == scope.currentEvent.id) {
							var duration = new Date().getTime() - new Date(event.startTime).getTime();
							return duration;
							// return (new Date().getTime() - duration);
						}
					}

					function currentEventBar(bar) {
					// 	} else {
					// 		eventDuration = eventoRolando(event);
					// 		if (eventDuration != undefined) {
					// 			// bar.width = scope.xScale(eventoRolando(event)) - scope.xScale(0);
					// 			// bar.width = scope.xScale(eventDuration) - scope.xScale(0);
					// 			// console.log('eventDuration', scope.xScale(eventDuration) - scope.xScale(0));
					// 		} else {
					// 			eventDuration = 0;
					// 			bar.width = 0;
					// 		}

						if(scope.currentEvent) {
							var startTime = new Date(scope.currentEvent.startTime);

							d3.select('#current-event')
								.attr('transform', 'translate(' + scope.xScale(startTime) + ', 0)');

							// console.log('bar', bar);
							d3.select('#current-event-bar')
								.attr('y', bar.position)
								.attr('width', bar.width)
								.attr('height', bar.height)
								.attr('fill', bar.color);
						}
					}
				});
			}
		};
	}
})();
