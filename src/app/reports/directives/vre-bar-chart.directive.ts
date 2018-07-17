// (function() {

// 	'use strict',

// 	angular.module('xpd.reports').directive('vreBarChart', vreBarChart);
import * as d3 from 'd3';
import { XPDTimeoutService } from '../../shared/xpd.timers/xpd-timers.service';
import template from './vre-bar-chart.template.html';

export class VreBarChart {

	public static $inject = ['$filter', '$xpdTimeout'];
	public restrict: 'EA';
	public template = template;
	public scope = {
		vreListData: '=',
		vreDailyData: '=',
		period: '=',
	};
	public widthSvg: any;
	public heightSvg: number;
	public xAxisScale: d3.ScaleLinear<number, number>;

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
		const vm = this;

		scope.drawChartReady = false;

		scope.$watchGroup(['vreListData', 'vreDailyData'], (newValues) => {
			// this.$xpdTimeout.run(() => {
			if (newValues[0] && newValues[1]) {
				vm.drawVreChart(scope, elem, newValues[0], newValues[1]);
			}
			// }, 500, scope);
		}, true);
	}

	public drawXAxis = (point) => {
		const vm = this;
		return vm.xAxisScale(point);
	}

	public getBarScale = (vre) => {
		const vm = this;
		const xVre = vm.xAxisScale(vre * 100);
		const xLine = vm.xAxisScale(0);

		if (vre >= 0) {
			return xLine;
		} else {
			return xVre;
		}
	}

	public setBarWidth = (vre) => {
		const vm = this;
		const xVre = vm.xAxisScale(vre * 100);
		const xLine = vm.xAxisScale(0);

		if (vre > 0) {
			return xVre - xLine;
		} else {
			return xLine - xVre;
		}
	}

	public setBarHeight = () => {
		const vm = this;
		return (vm.heightSvg - 8) + 'px';
	}

	private drawVreChart(scope, elem, vreListData, vreDailyData) {

		const vm = this;

		scope.drawChartReady = true;

		const padding = 3;
		const table = d3.select(elem[0]);

		const svgSelection = table.select('svg');
		const svgTd = table.select('td.vre-svg-container');

		vm.widthSvg = ((svgSelection.node() as any).getBoundingClientRect()).width;
		vm.heightSvg = ((svgTd.node() as any).getBoundingClientRect()).height;

		console.log({
			widthSvg: vm.widthSvg,
			heightSvg: vm.heightSvg,
			domain: [-20, 10],
			range: [padding, vm.widthSvg - padding],
		});

		// debugger;

		vm.xAxisScale = d3.scaleLinear()
			.domain([-20, 10])
			.range([padding, vm.widthSvg - padding]);

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
