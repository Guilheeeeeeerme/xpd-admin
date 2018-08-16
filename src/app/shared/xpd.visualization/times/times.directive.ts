import * as d3 from 'd3';
import './times.style.scss';
import template from './times.template.html';

export class EventTimesDirective implements ng.IDirective {

	public static Factory(): ng.IDirectiveFactory {
		return () => new EventTimesDirective();
	}

	public template = template;
	public restrict = 'AE';
	public scope = {
		times: '=',
		maxBars: '=',
		actionOpenDropdownMenu: '=',
		selectedEvent: '=',
	};

	public link: ng.IDirectiveLinkFn = (
		scope: any,
		element: ng.IAugmentedJQuery,
		attrs: ng.IAttributes,
		ctrl: any,
	) => {

		scope.dynamicPopover = {
			content: 'content',
			title: 'title',
		};

		scope.svg = {
			height: element[0].offsetHeight,
			width: element[0].clientWidth,
		};

		scope.svg.viewBox = '0 0 100 ' + (scope.svg.height * 100) / scope.svg.width;

		scope.getFillColor = getFillColor;
		scope.getBarSize = getBarSize;

		/**
		 * ACTION BUTTONS!
		 */
		d3.select(element[0]).selectAll('.overlay')
			.on('mousedown', rightClick);

		scope.xScale = d3.scaleLinear().domain([0, +attrs.maxSeconds * 1000]).range([10, 90]);
		scope.xTicks = scope.xScale.ticks(5);

		scope.yScale = d3.scaleLinear().domain([0, +attrs.maxBars]).range([10, ((scope.svg.height * 100) / scope.svg.width)]);
		scope.yTicks = scope.yScale.ticks();

		scope.bar = {
			height: ((scope.svg.height * 100) / scope.svg.width) / (+attrs.maxBars * 1.2),
		};

		function getBarSize(event) {

			const scale = d3.scaleLinear()
				.domain([event.vtarget * 2, event.vpoor / 2]) // .domain([event.voptimum, event.vstandard, event.vpoor])
				.range([20, 40, 60]);

			let size = scale(event.actualSpeed);

			if (event.eventType === 'TRIP') {
				size = scale(event.actualSpeed * 10);
			}

			return (size <= 10) ? 10 : size;

		}

		function getFillColor(event) {
			return event.performanceColor;
		}

		function rightClick() {

			if (d3.event.button === 2) {
				const event = scope.times[d3.event.toElement.id];
				scope.actionOpenDropdownMenu(d3.event, event);
			}
		}

	}

}
