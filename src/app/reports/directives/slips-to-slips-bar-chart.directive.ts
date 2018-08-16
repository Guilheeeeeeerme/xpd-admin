// (function() {
// 	'use strict';

import * as d3 from 'd3';
import './slips-to-slips-bar-chart.style.scss';
import template from './slips-to-slips-bar-chart.template.html';

export class SlipsToSlipsBarChart {

	public static Factory(): ng.IDirectiveFactory {
		return () => new SlipsToSlipsBarChart();
	}

	public template = template;
	public scope = {
		slipsData: '=',
	};

	public link: ng.IDirectiveLinkFn = (
		scope: any,
		elem: ng.IAugmentedJQuery,
		attrs: ng.IAttributes,
		ctrl: any,
	) => {

		scope.dynamicPopover = {
			content: 'content',
			title: 'title',
		};

		scope.svg = {
			height: elem[0].offsetHeight,
			width: elem[0].clientWidth,
		};

		scope.$watchCollection('slipsData', function (newValue) {

			drawConnChart(newValue);

		}, true);

		function drawConnChart(slipsData) {

			if (slipsData == null || slipsData.length === 0) { return; }

			const timeFirstEvent = slipsData[0].startTime;
			const timeLastEvent = slipsData[slipsData.length - 1].startTime;

			scope.fromDate = new Date(timeFirstEvent);
			scope.toDate = new Date(timeLastEvent);

			scope.svg.viewBox = '0 0 100 ' + (scope.svg.height * 100) / scope.svg.width;
			scope.yAxisBar = scope.svg.height - 60;
			scope.xAxisBar = scope.svg.width - 60;

			/**
				 * ACTION BUTTONS!
				 */
			scope.getFillColor = getFillColor;

			scope.xScale = d3.scaleTime().domain([scope.fromDate, scope.toDate]).range([60, scope.xAxisBar]);

			scope.xScale.domain([scope.fromDate, scope.toDate]);
			scope.xTicks = scope.xScale.ticks();

			scope.dateFormat = d3.timeFormat('%m/%d %I:%M');

			scope.yScale = d3.scaleLinear().domain([0, +attrs.maxSeconds * 1000]).range([scope.yAxisBar, 20]);
			scope.yTicks = scope.yScale.ticks();
			scope.getXPosition = getXPosition;

			scope.bar = {
				width: ((scope.svg.width * 200) / scope.svg.height) / (scope.slipsData.length * 1.5),
			};
		}

		function redrawConnChart(fromDate, toDate) {

			scope.xScale = d3.scaleTime().domain([new Date(fromDate), new Date(toDate)]).range([40, scope.svg.width]);
			scope.xTicks = scope.xScale.ticks();
		}

		function getFillColor(event) {

			if (event.eventType === 'CONN') {

				if (event.duration >= 1000 / event.vpoor) {
					return '#860000';
				} else if (event.duration >= 1000 / event.vstandard && event.duration < 1000 / event.vpoor) {
					return '#ffe699';
				} else {
					return '#73b9c6';
				}

			} else if (event.eventType === 'TRIP') {

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
}
// }) ();
