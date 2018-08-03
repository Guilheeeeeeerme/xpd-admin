import * as d3 from 'd3';
import './vre-bar-chart.style.scss';
import template from './vre-bar-chart.template.html';

export class VreBarChart {

	public static $inject = ['$timeout'];
	public static Factory(): ng.IDirectiveFactory {
		const directive = (
			$timeout: any,
		) => new VreBarChart(
			$timeout,
		);

		return directive;
	}
	public restrict: 'EA';
	public template = template;
	public scope = {
		vreListData: '=',
		vreDailyData: '=',
		period: '=',
	};

	constructor(
		private $timeout: any) {
	}

	public link: ng.IDirectiveLinkFn = (
		scope: any,
		element: ng.IAugmentedJQuery,
		attrs: ng.IAttributes,
		ctrl: any,
	) => {

		let xAxisScale;
		let widthSvg;
		let heightSvg;

		scope.drawChartReady = false;

		scope.$watchGroup(['vreListData', 'vreDailyData'], (newValues) => {
			this.$timeout(() => {
				drawVreChart(newValues[0], newValues[1]);
			}, 500, scope);
		}, true);

		const drawVreChart = (vreListData, vreDailyData) => {

			scope.drawChartReady = true;

			const padding = 3;
			const table = d3.select(element[0]);
			const svgSelection: any = table.select('svg').node();
			widthSvg = svgSelection.width.animVal.value;
			// tslint:disable-next-line:radix
			heightSvg = parseInt(window.getComputedStyle(document.querySelector('td.vre-svg-container')).height);

			xAxisScale = d3.scaleLinear()
				.domain([-20, 10])
				.range([padding, widthSvg - padding]);

		};

		scope.drawXAxis = (point) => {
			return xAxisScale(point);
		};

		scope.getBarScale = (vre) => {
			const xVre = xAxisScale(vre * 100);
			const xLine = xAxisScale(0);

			if (vre >= 0) {
				return xLine;
			} else {
				return xVre;
			}
		};

		scope.setBarWidth = (vre) => {
			const xVre = xAxisScale(vre * 100);
			const xLine = xAxisScale(0);

			if (vre > 0) {
				return xVre - xLine;
			} else {
				return xLine - xVre;
			}
		};

		scope.setBarHeight = () => {
			return (heightSvg - 8) + 'px';
		};
	}
}
