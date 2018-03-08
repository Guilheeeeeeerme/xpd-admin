(function () {
	'use strict';

	angular.module('xpd.visualization')
		.directive('connRuler', connRuler);

	connRuler.$inject = ['$filter', 'd3Service'];

	function connRuler($filter, d3Service) {
		return {
			templateUrl: '../xpd-resources/ng/xpd.visualization/conn-ruler.template.html',
			scope: {
				chronometer: '=',
				timeBlocks: '=',
				vtargetDuration: '=',
				flashGoDiv: '='
			},
			link: function (scope, element, attrs) {

				var unwatchChronometer;

				d3Service.d3().then(function (d3) {

					scope.svg = {
						height: element[0].offsetHeight,
						width: element[0].clientWidth
					};

					scope.svg.viewBoxHeight = Math.floor((scope.svg.height * 100) / scope.svg.width);
					scope.svg.viewBox = '0 0 100 ' + scope.svg.viewBoxHeight;

					scope.$watch('timeBlocks', function (timeBlocks) {
						buildRuler(angular.copy(timeBlocks), scope.vtargetDuration);
					}, true);

					scope.$watch('vtargetDuration', function (vtargetDuration) {
						buildRuler(angular.copy(scope.timeBlocks), vtargetDuration);
					}, true);

				});

				function buildRuler(timeBlocks, vtargetDuration) {
					if (vtargetDuration == null) {
						scope.hasVtarget = false;
						vtargetDuration = 3600;
					} else {
						scope.hasVtarget = true;
					}

					if (unwatchChronometer)
						unwatchChronometer();

					if (timeBlocks == null)
						return;

					scope.ruler = {
						size: +vtargetDuration,
						ticks: []
					};

					scope.yPosition = d3.scale.linear().domain([0, scope.ruler.size]).range([0, scope.svg.viewBoxHeight]);

					scope.ruler.ticks = scope.yPosition.ticks();

					var yPosition = 0;

					for (var i in timeBlocks) {

						var timeBlock = timeBlocks[i];

						timeBlock.timeOrder = +i + 1;

						timeBlock.startTime = yPosition;
						timeBlock.startPosition = scope.yPosition(yPosition);

						timeBlock.duration = (timeBlock.percentage * scope.ruler.size) / 100;
						timeBlock.height = scope.yPosition(timeBlock.duration);

						yPosition += timeBlock.duration;

						timeBlock.endTime = yPosition;
						timeBlock.endPosition = scope.yPosition(yPosition);

					}

					scope.plottedTimeBlocks = timeBlocks;

					scope.colorGradientScale = d3.scale.linear().domain([0, 100]).range(['#000000', '#517f89']);
					scope.colorGradientScaleInverse = d3.scale.linear().domain([0, 100]).range(['#517f89', '#000000']);

					if (scope.hasVtarget)
						unwatchChronometer = watchChronometer();
				}

				function calculateColorGradient(chronometer, index) {
					var timeBlock = scope.plottedTimeBlocks[index];

					var result;

					if (chronometer < timeBlock.startTime) {
						result = 0;
					} else if (chronometer >= timeBlock.startTime && chronometer < timeBlock.endTime) {
						result = ((chronometer - timeBlock.startTime) * 100) / timeBlock.duration;
					} else {
						result = 100;
					}

					timeBlock.tempHeight = timeBlock.height * (result / 100);

					timeBlock.offset = result;
					timeBlock.stopColor = scope.colorGradientScale(result);
					timeBlock.stopColorInverse = scope.colorGradientScaleInverse(result);

				}

				function checkPastEvent(chronometer, index) {
					var timeBlock = scope.plottedTimeBlocks[index];

					if (chronometer > timeBlock.startTime && !timeBlock.past) {
						timeBlock.past = true;

						if (index > 0)
							scope.flashGoDiv && scope.flashGoDiv();
					}

				}

				function watchChronometer() {
					return scope.$watch('chronometer', function (newValue) {
						for (var i in scope.plottedTimeBlocks) {
							checkPastEvent(newValue, i);
							calculateColorGradient(newValue, i);
						}
					});
				}

			}
		};
	}
})();
