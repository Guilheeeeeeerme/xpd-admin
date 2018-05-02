(function () {
	'use strict';

	angular.module('xpd.visualization')
		.directive('dmecTrackingEvents', dmecTrackingEvents);

	dmecTrackingEvents.$inject = ['$uibModal', 'd3Service', 'eventDetailsModal', 'failureModal', 'lessonLearnedModal'];

	function dmecTrackingEvents($uibModal, d3Service, eventDetailsModal, failureModal, lessonLearnedModal) {
		return {
			templateUrl: '../xpd-resources/ng/xpd.visualization/dmec-tracking-events.template.html',
			scope: {
				tick: '=',
				events: '=',
				eventType: '=',
				currentEvent: '=',
				currentOperation: '=',
				currentBlockPosition: '=',
				zoomStartAt: '=', 
				zoomEndAt: '=',
				actionEventDetail: '='
			},
			link: function (scope, element, attrs) {

				scope.element = element[0];
				scope.mindate = null;
				scope.maxdate = null;
				scope.elementIdGroup = 'current-event-' + scope.eventType;
				scope.elementIdBar = 'current-event-bar' + scope.eventType;
				scope.selectedEvent = null;
				// scope.verticalMode = angular.isDefined(scope.verticalMode) ? scope.verticalMode : false;

				d3Service.d3().then(function (d3) {

					scope.events.pop();
					setViewMode();

					scope.getWidthBar = getWidthBar;
					scope.getHeightBar = getHeightBar;
					scope.getPositionBar = getPositionBar;
					scope.getEventScale = getEventScale;
					scope.actionOpenDetailsModal = actionOpenDetailsModal;
					scope.actionOpenFailuresModal = actionOpenFailuresModal;
					scope.actionOpenLessonsLearnedModal = actionOpenLessonsLearnedModal;

					scope.$watch('zoomStartAt', function (startAt) {
						if(startAt) {
							scope.mindate = new Date(startAt).getTime();
							defineScaleChart();
						}
					});

					scope.$watch('zoomEndAt', function (endAt) {
						if(endAt) {
							scope.maxdate = new Date(endAt).getTime();
							defineScaleChart();
						}
					});

					scope.$watch('tick', function (tick) {
						if (scope.currentEvent && scope.eventType == scope.currentEvent.eventType)
							currentEventBar(buildCurrentEventBar(scope.currentEvent, true, tick));
					});

					getEventZoomElement().on('dblclick', dblclick);
					getEventZoomElement().on('mousedown', rightClick);
					

					function setViewMode() {

						scope.svg = {
							height: element[0].offsetHeight,
							width: element[0].clientWidth
						};

						scope.svgViewHeight = (scope.svg.width * 100) / scope.svg.height;

						scope.svg.viewBox = '0 0 100 ' + scope.svgViewHeight;

						var startDate = new Date(scope.currentOperation.startDate);
						scope.mindate = new Date(scope.currentOperation.startDate).getTime();
						scope.maxdate = new Date().setHours(startDate.getHours() + 1);

						defineScaleChart();
					}

					function defineScaleChart() {
						scope.xScale = d3.scale.linear().domain([scope.mindate, scope.maxdate]).range([0, 95]);
						scope.xTicks = scope.xScale.ticks();
					}

					function getWidthBar(eventDuration) {
						var width = scope.xScale(eventDuration) - scope.xScale(0);
						if (!isNaN(width))
							return width;
					}

					function getHeightBar(event) {

						var yScale = d3.scale.linear()
							.domain([event.vtarget * 2, event.vpoor / 2])
							.range([scope.svgViewHeight / 5, scope.svgViewHeight])
							.clamp(true);

						var height = yScale(event.actualSpeed);
						if (!isNaN(height)) {
							return height;
						}
					}

					function getPositionBar(event) {
						return scope.svgViewHeight - getHeightBar(event);
					}

					function buildCurrentEventBar(event, isCurrentEvent, eventDuration) {

						var bar = {
							width: 0,
							height: 0,
							position: 0,
							color: '',
						};

						var displacement = null;

						bar.width = getWidthBar(eventDuration);

						if (event.eventType === 'CONN' || event.eventType === 'TIME') {
							displacement = 1;
						} else {
							displacement = Math.abs(event.startBlockPosition - scope.currentBlockPosition);
						}

						event.actualSpeed = displacement / (eventDuration / 1000);
						bar.height = getHeightBar(event);
						bar.position = scope.svgViewHeight - bar.height;

						if (event.actualSpeed >= event.voptimum) {
							bar.color = '#73b9c6';
						} else if (event.actualSpeed < event.voptimum && event.actualSpeed >= event.vstandard) {
							bar.color = '#0FA419';
						} else if (event.actualSpeed < event.vstandard && event.actualSpeed >= event.vpoor) {
							bar.color = '#ffe699';
						} else {
							bar.color = '#860000';
						}

						if (!isNaN(bar.width) && !isNaN(bar.height)) {
							return bar;
						}
					}

					function currentEventBar(bar) {
						var startTime = new Date(scope.currentEvent.startTime);

						d3.select(element[0]).select('#' + scope.elementIdGroup)
							.attr('transform', 'translate(' + scope.xScale(startTime) + ', 0)');

						d3.select(element[0]).select('#' + scope.elementIdBar)
							.attr('y', bar.position)
							.attr('width', bar.width)
							.attr('height', bar.height)
							.attr('fill', bar.color);
					}

					function getEventScale(startTime) {

						if (!isNaN(scope.xScale(startTime)))
							return scope.xScale(startTime);
						else return 0;
					}

					function getEventZoomElement() {
						var startZoomElement = d3.select(scope.element).selectAll('.overlay');
						return startZoomElement;
					}

					function dblclick() {

						var currentPosition = d3.mouse(this)[0];
						scope.mindate = scope.xScale.invert(d3.mouse(this)[0] - 20);
						scope.maxdate = scope.xScale.invert(d3.mouse(this)[0] + 20);

						scope.zoomStartAt = scope.mindate;
						scope.zoomEndAt = scope.maxdate;
						
						defineScaleChart();
					}

					function rightClick() {

						closeDetailsMenu();
						
						if(d3.event.button == 2) {
							var selectedEvent = scope.events[d3.event.toElement.id]; //id aqui é o index

							if (selectedEvent) {
								scope.selectedEvent = selectedEvent;
								openDetailsMenu();
							}
						}

					}

					function openDetailsMenu() {
						d3.select(scope.element).selectAll('.dropdown')
							.style('top', d3.event.clientY + 'px')
							.style('left', d3.event.clientX + 'px')
							.classed('open', true);
					}

					function closeDetailsMenu() {
						d3.select(scope.element).selectAll('.dropdown').classed('open', false);
					}

					function actionOpenDetailsModal() {
						eventDetailsModal.open(scope.selectedEvent.id);
						closeDetailsMenu();
					}

					scope.modalActionButtonClose = function () {
						scope.eventFailure = {};
						scope.$modalInstance.close();
					};

					function actionOpenFailuresModal() {

						failureModal.open(
							getEvent(),
							function() {
								console.log('success');
							},
							function() {
								console.log('error');
							}
						);

						closeDetailsMenu();
					}

					function actionOpenLessonsLearnedModal() {

						lessonLearnedModal.open(
							getEvent(),
							function () {
								console.log('success');
							},
							function () {
								console.log('error');
							}
						);

						closeDetailsMenu();
					}

					function getEvent() {
						
						var event = {
							operation: {
								id: scope.currentOperation.id
							},
							startTime: new Date(scope.selectedEvent.startTime),
							endTime: new Date(scope.selectedEvent.endTime)
						};

						return event;
					}

				});
			}
		};
	}
})();
