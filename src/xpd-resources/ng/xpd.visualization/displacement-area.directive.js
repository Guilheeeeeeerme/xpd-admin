(function() {
	'use strict';

	angular.module('xpd.visualization')
		.directive('displacementArea', displacementArea);

	displacementArea.$inject = ['d3Service'];

	function displacementArea(d3Service) {
		return {
			templateUrl: '../xpd-resources/ng/xpd.visualization/displacement-area.template.html',
			scope: {
				slipsTime: '<',
				accelerationTimeLimit: '<',
				decelerationTimeLimit: '<',
				targetSpeed: '<',
				displacement: '<',
				safetyLimit: '<',
				vcruising: '<'
			},

			link: function(scope, element, attrs) {

				d3Service.d3().then(function(d3) {

					scope.svg = {
						height: element[0].offsetHeight,
						width: element[0].clientWidth
					};

					scope.svg.viewBoxHeight = (scope.svg.height * 100) / scope.svg.width;
					scope.svg.viewBox = '0 0 100 ' + scope.svg.viewBoxHeight;

					scope.xPosition = d3.scale.linear().domain([0, (scope.safetyLimit * 3600) ]).range([0, 30]);
					scope.xPositionTicks = scope.xPosition.ticks();

					scope.$watchGroup(['slipsTime', 'accelerationTimeLimit', 'decelerationTimeLimit', 'targetSpeed', 'displacement', 'vcruising'], function(newValues) {

						var slipsTime = newValues[0];
						var accelerationTimeLimit = newValues[1];
						var decelerationTimeLimit = newValues[2];
						var targetSpeed = newValues[3];
						var displacement = newValues[4];
						var vcruising = newValues[5];

						try {

							scope.yPosition = d3.scale.linear().domain([0, (displacement / targetSpeed)]).range([20, scope.svg.viewBoxHeight]).clamp(true);
							scope.yPositionTicks = scope.yPosition.ticks();

							// TEMPO TOTAL QUE DEVE SER GASTO
							var time = (displacement / targetSpeed) - slipsTime;

							// targetSpeed = displacement / time;

							// if (time < (accelerationTimeLimit + decelerationTimeLimit)) {

							// 	var tempAcceleration = accelerationTimeLimit / (accelerationTimeLimit + decelerationTimeLimit);
							// 	var tempDeceleration = decelerationTimeLimit / (accelerationTimeLimit + decelerationTimeLimit);

							// 	accelerationTimeLimit = tempAcceleration * time;
							// 	decelerationTimeLimit = tempDeceleration * time;

							// }

							scope.time = time;
							// scope.vcruising = vcruising;

						} catch (e) {
							console.log(e);
						}

					});

				});

			}
		};
	}
})();
