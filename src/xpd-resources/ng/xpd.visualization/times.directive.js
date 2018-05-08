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
				maxBars: '=',
				actionOpenDropdownMenu: '=',
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


					scope.getFillColor = getFillColor;
					scope.getBarSize = getBarSize;
					
					/**
                     * ACTION BUTTONS!
                     */					
					d3.select(element[0]).selectAll('.overlay')
						.on('mousedown', rightClick);


					scope.xScale = d3.scale.linear().domain([0, +attrs.maxSeconds * 1000]).range([10, 90]);
					scope.xTicks = scope.xScale.ticks(5);

					scope.yScale = d3.scale.linear().domain([0, +attrs.maxBars]).range([10, ((scope.svg.height * 100) / scope.svg.width)]);
					scope.yTicks = scope.yScale.ticks();

					scope.bar = {
						height: ((scope.svg.height * 100) / scope.svg.width) / (+attrs.maxBars * 1.2)
					};

					function getBarSize(event) {

						var scale = d3.scale.linear()
							.domain([event.vtarget * 2, event.vpoor / 2]) //.domain([event.voptimum, event.vstandard, event.vpoor])
							.range([20, 40, 60]);

						var size = scale(event.actualSpeed);
						return (size <= 10) ? 10 : size;

					}

					function getFillColor(event) {
						return event.performanceColor;
					}

					function rightClick() {
						if(d3.event.button == 2) {
							var event = scope.times[d3.event.toElement.id];
							scope.actionOpenDropdownMenu(d3.event, event);
						}
					}
				});
			}
		};
	}
})();
