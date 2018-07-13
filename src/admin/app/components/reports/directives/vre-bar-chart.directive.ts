// (function() {

// 	'use strict',

// 	angular.module('xpd.reports').directive('vreBarChart', vreBarChart);
import template from 'app/components/reports/directives/vre-bar-chart.template.html';
import * as d3 from 'd3';
import { XPDTimeoutService } from '../../../../../xpd-resources/ng/xpd.timers/xpd-timers.service';

export class VreBarChart {

	public static $inject = ['$filter', '$xpdTimeout'];
	public restrict: 'EA';
	public template = template;
	public scope: {
		vreListData: '=',
		vreDailyData: '=',
		period: '=',
	};

	constructor(
		private $filter: ng.IFilterFilter,
		private $xpdTimeout: XPDTimeoutService) {
	}

	public link: ng.IDirectiveLinkFn = (
		scope: any,
		elem: ng.IAugmentedJQuery,
		attrs: ng.IAttributes,
		ctrl: any,
	) => {
		let xAxisScale;
		let widthSvg;
		let heightSvg;

		scope.drawChartReady = false;

		scope.$watchGroup(['vreListData', 'vreDailyData'], function (newValues) {
			this.$xpdTimeout(function () {
				drawVreChart(newValues[0], newValues[1]);
			}, 500, scope);
		}, true);

		function drawVreChart(vreListData, vreDailyData) {

			scope.drawChartReady = true;

			const padding = 3;
			const table = d3.select(elem[0]);
			const svgSelection = table.select('svg');
			widthSvg = svgSelection[0][0].width.animVal.value;
			heightSvg = Number(window.getComputedStyle(document.querySelector('td.vre-svg-container')).height);

			xAxisScale = d3.scale.linear()
				.domain([-20, 10])
				.range([padding, widthSvg - padding]);

		}

		scope.drawXAxis = function drawXAxis(point) {
			return xAxisScale(point);
		};

		scope.drawYAxis = function drawYAxis(point) {
			return yAxisScale();
		};

		scope.getBarScale = function getBarScale(vre) {
			const xVre = xAxisScale(vre * 100);
			const xLine = xAxisScale(0);

			if (vre >= 0) {
				return xLine;
			} else {
				return xVre;
			}
		};

		scope.setBarWidth = function setBarWidth(vre) {
			const xVre = xAxisScale(vre * 100);
			const xLine = xAxisScale(0);

			if (vre > 0) {
				return xVre - xLine;
			} else {
				return xLine - xVre;
			}
		};

		scope.setBarHeight = function setBarHeight() {
			return (heightSvg - 8) + 'px';
		};
	}

	public static Factory(): ng.IDirectiveFactory {
		const directive = (
			$filter: ng.IFilterFilter,
			$xpdTimeout: XPDTimeoutService,
		) => new VreBarChart(
			$filter,
			$xpdTimeout,
		);

		return directive;
	}
}
// }) ();
