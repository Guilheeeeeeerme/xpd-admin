(function () {
	'use strict';

	angular.module('xpd.visualization')
		.directive('times', times);

	times.$inject = ['d3Service'];

	function times(d3Service) {
		return {
			templateUrl: '../xpd-resources/ng/xpd.visualization/times.template.html',
			scope: {
				times: '=',
				averageStandLength: '=',
				actionBarClick: '=',
				actionBarDoubleClick: '=',
				selectedEvent: '='
			},
			link: function (scope, element, attrs) {

				scope.dynamicPopover = {
					content: 'content',
					title: 'title'
				};

				d3Service.d3().then(function (d3) {

					scope.svg = {
						height: element[0].offsetHeight,
						width: element[0].clientWidth
					};

					scope.svg.viewBox = '0 0 100 ' + (scope.svg.height * 100) / scope.svg.width;

					/**
                     * ACTION BUTTONS!
                     */
					scope.getFillColor = getFillColor;
					scope.getBarSize = getBarSize;

					scope.xScale = d3.scale.linear().domain([0, +attrs.maxSeconds * 1000]).range([10, 90]);
					scope.xTicks = scope.xScale.ticks(5);

					scope.yScale = d3.scale.linear().domain([0, +attrs.maxBars]).range([10, ((scope.svg.height * 100) / scope.svg.width)]);
					scope.yTicks = scope.yScale.ticks();

					scope.bar = {
						height: ((scope.svg.height * 100) / scope.svg.width) / (+attrs.maxBars * 1.2)
					};

					function getBarSize(event) {
						var duration = event.duration / 1000;
						var displacement = 1;

						if (event.eventType === 'TRIP') {
							displacement = Math.abs(event.startBlockPosition - event.endBlockPosition);
						}

						var scale = d3.scale.linear()
							.domain([event.voptimum, event.vstandard, event.vpoor])
							.range([20, 40, 60]);

						var actualSpeed = displacement / duration;

						var size = scale(actualSpeed);
						return (size <= 10) ? 10 : size;

					}

					function getFillColor(event) {

						var duration = event.duration / 1000;
						var displacement = 1;

						if (event.eventType === 'TRIP') {
							displacement = Math.abs(event.startBlockPosition - event.endBlockPosition);
						}

						const actualSpeed = displacement / duration;

						if (actualSpeed >= event.voptimum) {
							return '#73b9c6';
						} else if (actualSpeed < event.voptimum && actualSpeed >= event.vstandard) {
							return '#0FA419';
						} else if (actualSpeed < event.vstandard && actualSpeed >= event.vpoor) {
							return '#ffe699';
						} else {
							return '#860000';
						}

					}
				});
			}
		};
	}
})();
