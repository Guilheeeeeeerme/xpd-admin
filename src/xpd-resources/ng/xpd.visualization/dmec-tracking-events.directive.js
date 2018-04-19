(function () {
	'use strict';

	angular.module('xpd.visualization')
		.directive('dmecTrackingEvents', dmecTrackingEvents);

	dmecTrackingEvents.$inject = ['d3Service'];

	function dmecTrackingEvents(d3Service) {
		return {
			templateUrl: '../xpd-resources/ng/xpd.visualization/dmec-tracking-events.template.html',
			scope: {
				tick: '=',
				events: '=',
				eventType: '=',
				currentEvent: '=',
				currentOperation: '=',
				currentBlockPosition: '='
			},
			link: function (scope, element, attrs) {

				scope.elementIdGroup = 'current-event-' + scope.eventType;
				scope.elementIdBar = 'current-event-bar' + scope.eventType;
				scope.verticalMode = angular.isDefined(scope.verticalMode) ? scope.verticalMode : false;

				d3Service.d3().then(function (d3) {

					scope.events.pop();
					setViewMode();

					scope.gatBarProperties = gatBarProperties;
					scope.getEventScale = getEventScale;

					scope.$watch('tick', function (tick) {
						gatBarProperties(scope.currentEvent);
					});


					function setViewMode() {

						scope.svg = {
							height: element[0].offsetHeight,
							width: element[0].clientWidth
						};

						scope.svgViewHeight = (scope.svg.width * 100) / scope.svg.height;

						scope.svg.viewBox = '0 0 100 ' + scope.svgViewHeight;

						var startDate = new Date(scope.currentOperation.startDate);
						var mindate = new Date(scope.currentOperation.startDate).getTime();
						var maxdate = new Date().setHours(startDate.getHours() + 5);

						scope.xScale = d3.scale.linear().domain([mindate, maxdate]).range([0, 100]);
						scope.xTicks = scope.xScale.ticks();
					}

					function gatBarProperties(event) {

						var bar = {
							width: 0,
							height: 0,
							position: 0,
							color: '',
						};
						var eventDuration;
						var displacement = null;
						var isCurrentEvent = null;

						if (event.id == scope.currentEvent.id) {
							isCurrentEvent = true;
							eventDuration = scope.tick;
						} else {
							isCurrentEvent = false;
							eventDuration = event.duration;
						}
							
						bar.width = scope.xScale(eventDuration) - scope.xScale(0);						

						var yScale = d3.scale.linear()
							.domain([event.vtarget * 2, event.vpoor / 2])
							.range([scope.svgViewHeight / 5, scope.svgViewHeight])
							.clamp(true);

						if (event.eventType === 'CONN') {
							displacement = 1;
						} else {
							if(isCurrentEvent){
								displacement = Math.abs(event.startBlockPosition - scope.currentBlockPosition);
							} else {
								displacement = Math.abs(event.startBlockPosition - event.endBlockPosition);
							}
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

						if(isCurrentEvent && scope.eventType == scope.currentEvent.eventType) {
							currentEventBar(bar);
						} else if (!isNaN(bar.width) && !isNaN(bar.height)) {
							return bar;
						}
					}

					function getEventScale(startTime) {

						if (!isNaN(scope.xScale(startTime)))
							return scope.xScale(startTime);
						else return 0;
					}

					function currentEventBar(bar) {
						var startTime = new Date(scope.currentEvent.startTime);

						d3.select('#' + scope.elementIdGroup)
							.attr('transform', 'translate(' + scope.xScale(startTime) + ', 0)');

						d3.select('#' + scope.elementIdBar)
							.attr('y', bar.position)
							.attr('width', bar.width)
							.attr('height', bar.height)
							.attr('fill', bar.color);
					}
				});
			}
		};
	}
})();
