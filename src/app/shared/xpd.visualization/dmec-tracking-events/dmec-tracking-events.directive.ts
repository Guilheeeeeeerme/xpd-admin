// (function() {
// 	'use strict';

// 	dmecTrackingEvents.$inject = ['$uibModal', 'd3Service', 'eventDetailsModalService', 'failureModal', 'lessonLearnedModal'];
import * as d3 from 'd3';
import { EventDetailsModalService } from '../../xpd.modal.event-details/xpd-modal-event-details.factory';
import { FailureModalFactory } from '../../xpd.modal.failure/xpd-modal-failure.factory';
import { LessonLearnedModalService } from '../../xpd.modal.lessonlearned/xpd-modal-lessonlearned.service';
import './dmec-tracking-events.style.scss';
import template from './dmec-tracking-events.template.html';

export class DMECTrackingEventsDirective implements ng.IDirective {

	public static $inject: string[] = ['eventDetailsModalService', 'failureModal', 'lessonLearnedModal'];

	public static Factory(): ng.IDirectiveFactory {
		const directive = (
			eventDetailsModalService: EventDetailsModalService,
			failureModal: FailureModalFactory,
			lessonLearnedModal: LessonLearnedModalService,
		) => new DMECTrackingEventsDirective(
			eventDetailsModalService,
			failureModal,
			lessonLearnedModal,
			);

		return directive;
	}
	public template = template;
	public scope = {
		tick: '=',
		events: '=',
		eventType: '=',
		currentEvent: '=',
		currentOperation: '=',
		currentBlockPosition: '=',
		zoomStartAt: '=',
		zoomEndAt: '=',
		setZoom: '=',
		actionEventDetail: '=',
	};

	constructor(
		private eventDetailsModalService: EventDetailsModalService,
		private failureModal: FailureModalFactory,
		private lessonLearnedModal: LessonLearnedModalService) {
	}

	public link: ng.IDirectiveLinkFn = (
		scope: any,
		element: ng.IAugmentedJQuery,
		attributes: ng.IAttributes,
		ctrl: any,
	) => {

		const self = this;

		let lastEventType = null;
		let lastBarColor;
		let lastElement;
		scope.filteredEvents = [];
		scope.element = element[0];
		scope.mindate = null;
		scope.maxdate = null;
		scope.elementIdGroup = 'current-event-' + scope.eventType;
		scope.elementIdBar = 'current-event-bar-' + scope.eventType;
		scope.selectedEvent = null;
		// scope.verticalMode = angular.isDefined(scope.verticalMode) ? scope.verticalMode : false;

		// scope.events.pop();
		setViewMode();
		scope.getBarWidth = getBarWidth;
		scope.getBarHeight = getBarHeight;
		scope.getBarYPosition = getBarYPosition;
		scope.getBarXPosition = getBarXPosition;
		scope.actionOpenDetailsModal = actionOpenDetailsModal;
		scope.actionOpenFailuresModal = actionOpenFailuresModal;
		scope.actionOpenLessonsLearnedModal = actionOpenLessonsLearnedModal;

		scope.$watch('events', function (events) {
			if (events) {
				filterEventsToDraw();
			}
		});

		scope.$watch('zoomStartAt', function (startAt) {
			if (startAt) {
				scope.mindate = new Date(startAt).getTime();
				defineScaleChart();
				filterEventsToDraw();
			}
		});

		scope.$watch('zoomEndAt', function (endAt) {
			if (endAt) {
				scope.maxdate = new Date(endAt).getTime();
				defineScaleChart();
				filterEventsToDraw();
			}
		});

		scope.$watch('tick', function (tick) {
			if (scope.currentEvent && scope.eventType === scope.currentEvent.eventType) {
				currentEventBar(buildCurrentEventBar(scope.currentEvent, tick));
			}
		});

		scope.$watch('currentEvent', function (currentEvent) {
			if (!currentEvent) { return; }

			if (!lastEventType) {
				lastEventType = currentEvent.eventType;
			}

			if (lastEventType !== currentEvent.eventType) {
				d3.selectAll('#current-event-bar-' + lastEventType).remove();
				d3.selectAll('#current-event-' + lastEventType).append('rect').attr('id', 'current-event-bar-' + lastEventType);

				lastEventType = currentEvent.eventType;
			}

		});

		getEventZoomElement().on('dblclick', dblclick);
		getEventZoomElement().on('mousedown', rightClick);
		getEventZoomElement().on('mouseover', mouseOver);
		getEventZoomElement().on('mouseout', mouseOut);

		function setViewMode() {

			scope.svg = {
				height: element[0].offsetHeight,
				width: element[0].clientWidth,
			};

			scope.svgViewHeight = (scope.svg.width * 100) / scope.svg.height;

			scope.svg.viewBox = '0 0 100 ' + scope.svgViewHeight;

			const startDate = new Date(scope.currentOperation.startDate);
			scope.mindate = new Date(scope.currentOperation.startDate).getTime();
			scope.maxdate = new Date().setHours(startDate.getHours() + 1);

			defineScaleChart();
		}

		function defineScaleChart() {
			scope.xScale = d3.scaleLinear().domain([scope.mindate, scope.maxdate]).range([0, 100]);
			scope.xTicks = scope.xScale.ticks();
		}

		function filterEventsToDraw() {

			if (scope.events.length === 0) { return; }

			scope.filteredEvents = [];

			for (let i = 0; i <= scope.events.length; i++) {
				const event = scope.events[i];

				if (!event) { break; }

				if ((new Date(event.endTime).getTime() >= scope.mindate) && (new Date(event.startTime).getTime() <= scope.maxdate)) {
					scope.filteredEvents.push(event);
				}
			}

		}

		function getBarWidth(eventDuration) {
			const width = scope.xScale(eventDuration) - scope.xScale(0);
			if (!isNaN(width)) {
				return width;
			}
		}

		function getBarHeight(event) {

			const yScale = d3.scaleLinear()
				.domain([event.vtarget * 2, event.vpoor / 2])
				.range([scope.svgViewHeight / 5, scope.svgViewHeight])
				.clamp(true);

			let height = yScale(event.actualSpeed);

			if (scope.currentEvent && (scope.currentEvent.id !== event.id && event.eventType === 'TRIP')) {
				height = yScale(event.actualSpeed * 30);
			}

			if (!isNaN(height)) {
				return height;
			}
		}

		function getBarYPosition(event) {
			return scope.svgViewHeight - getBarHeight(event);
		}

		function getBarXPosition(startTime) {
			return scope.xScale(new Date(startTime));
		}

		function buildCurrentEventBar(event, eventDuration) {

			const bar = {
				width: 0,
				height: 0,
				position: 0,
				color: '',
			};

			let displacement = null;

			bar.width = getBarWidth(eventDuration);

			if (event.eventType === 'CONN' || event.eventType === 'TIME') {
				displacement = 1;
			} else {
				displacement = Math.abs(event.startBlockPosition - scope.currentBlockPosition);
			}

			event.actualSpeed = displacement / (eventDuration / 1000);
			bar.height = getBarHeight(event);

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
			try {
				const startTime = new Date(scope.currentEvent.startTime);

				d3.select(element[0]).select('#' + scope.elementIdGroup)
					.attr('transform', 'translate(' + scope.xScale(startTime) + ', 0)');

				d3.select(element[0]).select('#' + scope.elementIdBar)
					.attr('y', bar.position)
					.attr('width', bar.width)
					.attr('height', bar.height)
					.attr('fill', bar.color);
			} catch (error) {
				// faça nada
			}

		}

		function getEventZoomElement() {
			const startZoomElement = d3.select(scope.element).selectAll('.overlay');
			return startZoomElement;
		}

		function dblclick() {

			const currentPosition = d3.mouse(this)[0];
			scope.mindate = scope.xScale.invert(d3.mouse(this)[0] - 20);
			scope.maxdate = scope.xScale.invert(d3.mouse(this)[0] + 20);

			scope.setZoom(
				new Date(scope.mindate),
				new Date(scope.maxdate),
			);

		}

		function rightClick() {

			closeDetailsMenu();

			if (d3.event.button === 2) {
				const selectedEvent = scope.events[d3.event.toElement.id]; // id aqui é o index

				if (selectedEvent) {
					scope.selectedEvent = selectedEvent;
					openDetailsMenu();
				}
			}

		}

		function mouseOver(d, i) {

			if (i !== 0) { // permite que apenas as barras sofrem alterações
				const elem = d3.event.toElement;
				lastElement = elem;
				lastBarColor = d3.select(elem).attr('fill');

				d3.select(elem).style('fill', 'white');
				d3.select(elem).style('fill-opacity', '0.8');
			}
		}

		function mouseOut() {
			d3.select(lastElement).style('fill', lastBarColor);
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
			self.eventDetailsModalService.open(scope.selectedEvent.id);
			closeDetailsMenu();
		}

		scope.modalActionButtonClose = function () {
			scope.eventFailure = {};
			scope.$modalInstance.close();
		};

		function actionOpenFailuresModal() {

			self.failureModal.open(
				getEvent(),
				() => {
					console.log('success');
				},
				() => {
					console.log('error');
				},
			);

			closeDetailsMenu();
		}

		function actionOpenLessonsLearnedModal() {

			self.lessonLearnedModal.open(
				getEvent(),
				() => {
					console.log('success');
				},
				() => {
					console.log('error');
				},
			);

			closeDetailsMenu();
		}

		function getEvent() {

			const event = {
				operation: {
					id: scope.currentOperation.id,
				},
				startTime: new Date(scope.selectedEvent.startTime),
				endTime: new Date(scope.selectedEvent.endTime),
			};

			return event;
		}

	}
}
