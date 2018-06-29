(function () {

	'use strict',

	angular.module('xpd.reports')
		.directive('vreBarChart', vreBarChart);

	vreBarChart.$inject = ['$filter', '$xpdTimeout', 'd3Service'];

	function vreBarChart($filter, $xpdTimeout, d3Service) {
		return {
			restrict: 'EA',
			templateUrl: 'app/components/reports/directives/vre-bar-chart.template.html',
			scope: {
				vreListData: '=',
				vreDailyData: '=',
				period: '='
			},
			link: link
		};

		function link(scope, element, attr) {
			var xAxisScale;
			var widthSvg;
			var heightSvg;

			scope.drawChartReady = false;

			d3Service.d3().then(function (d3) {

				scope.$watchGroup(['vreListData', 'vreDailyData'], function (newValues) {
					$xpdTimeout(function () {
						drawVreChart(newValues[0], newValues[1]);
					}, 500, scope);
				}, true);

			});

			function drawVreChart(vreListData, vreDailyData) {

				scope.drawChartReady = true;

				var padding = 3;
				var table = d3.select(element[0]);
				var svgSelection = table.select('svg');
				widthSvg = svgSelection[0][0].width.animVal.value;
				heightSvg = parseInt(window.getComputedStyle(document.querySelector('td.vre-svg-container')).height);

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
				var xVre = xAxisScale(vre * 100);
				var xLine = xAxisScale(0);

				if (vre >= 0) {
					return xLine;
				} else {
					return xVre;
				}
			};

			scope.setBarWidth = function setBarWidth(vre) {
				var xVre = xAxisScale(vre * 100);
				var xLine = xAxisScale(0);

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
	}
})();