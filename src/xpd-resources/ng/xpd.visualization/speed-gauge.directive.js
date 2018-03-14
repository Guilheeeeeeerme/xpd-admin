(function () {
	'use strict';

	angular.module('xpd.visualization')
		.directive('speedGauge', speedGauge);

	speedGauge.$inject = ['d3Service'];

	function speedGauge(d3Service) {
		return {
			templateUrl: '../xpd-resources/ng/xpd.visualization/speed-gauge.template.html',
			scope: {
				readings: '=',
				calculated: '=',
				operation: '=',
				hasAlarm: '=',
				hasMessage: '=',
				// currentAlarm: '='
			},
			link: function (scope, element, attrs) {

				d3Service.d3().then(function (d3) {

					scope.svg = {
						height: element[0].offsetHeight,
						width: element[0].clientWidth
					};

					scope.svg.viewBoxHeight = (scope.svg.height * 100) / scope.svg.width;
					scope.svg.viewBox = '0 0 100 ' + scope.svg.viewBoxHeight;

					scope.svg.tripHeight = scope.svg.viewBoxHeight * 1;
					scope.svg.inSlipsHeight = scope.svg.viewBoxHeight * 0;

					var pi = Math.PI;

					// CONSTRUO O ARCO VAZIO
					var speedGaugeDisplacementStart = 45 * (pi / 180);
					var speedGaugeDisplacementEnd = 135 * (pi / 180);

					var speedGaugeDisplacementArcBg = d3.svg.arc()
						.outerRadius(84)
						.innerRadius(80)
						.startAngle(speedGaugeDisplacementStart)
						.endAngle(speedGaugeDisplacementEnd);

					d3.select('#speed-gauge-bg-arc').attr('d', speedGaugeDisplacementArcBg);

					var plotSpeedGaugeDisplacementArcActual;
					var speedGaugeDisplacementArcActual;

					buildSpeedGauge();

					function buildSpeedGauge() {

						scope.speedGauge = {
							size: 45,
							ticks: []
						};

						// CRIANDO ESCALAS
						// SEGUIR A RULER
						scope.yPosition = d3.scale.linear().domain([scope.speedGauge.size, 0]).range([0, scope.svg.tripHeight]);
						scope.inSlipsYPosition = d3.scale.linear().domain([0, scope.operation.inSlips]).range([scope.svg.inSlipsHeight, scope.svg.viewBoxHeight]);

						// BARRAS AZUIS DE BLOCK SPEED
						scope.speedBarPosition = speedBarPosition;

						scope.speedYPosition = d3.scale.linear().domain([5000, 0]).range([-50, 50]);
						scope.speedYTicks = scope.speedYPosition.ticks(5);

						// DESLOCAMENTO DO GAUGE
						scope.speedGaugePosition = d3.scale.linear().domain([-1, 1]).range([speedGaugeDisplacementEnd, speedGaugeDisplacementStart]);

						// CONTRUINDO O ARCO INTERNO
						var currDisplacementArcEndRadians = 90 * (pi / 180);
						var currDisplacementArcStartRadians = currDisplacementArcEndRadians;

						speedGaugeDisplacementArcActual = d3.svg.arc()
							.outerRadius(83)
							.innerRadius(81)
							.startAngle(currDisplacementArcStartRadians);

						plotSpeedGaugeDisplacementArcActual = d3.select('#speed-gauge-arc')
							.datum({endAngle: currDisplacementArcEndRadians})
							.attr('d', speedGaugeDisplacementArcActual);

						for (var i = 0; i <= scope.speedGauge.size; i++) {
							scope.speedGauge.ticks.push(scope.yPosition(i));
						}

						scope.$watchGroup(['readings.blockPosition', 'calculated.blockPosition'], function (newValues) {
							var readingBlockPosition = newValues[0];
							var calculatedBlockPosition = newValues[1];

							if (readingBlockPosition != null && calculatedBlockPosition != null) {
								redrawAccDisplacementArc(+calculatedBlockPosition - readingBlockPosition);
							}
						});

						function speedBarPosition(blockSpeed) {
							var speed = (Math.abs(blockSpeed) * 3600);

							speed = (isNaN(speed)) ? 0 : speed;

							return scope.speedYPosition(speed);
						}
					}

					function redrawAccDisplacementArc(newValue) {

						// ANGULO A SER PREENCHIDO
						var angle = scope.speedGaugePosition(newValue);

						// GARANTINDO QUE NÃO ESTRAPOLA A AREA DO GAUGE
						angle = (angle < speedGaugeDisplacementStart) ? speedGaugeDisplacementStart : ((angle > speedGaugeDisplacementEnd) ? speedGaugeDisplacementEnd : angle);

						plotSpeedGaugeDisplacementArcActual.transition().duration(100)
							.call(displacementArcTween, speedGaugeDisplacementArcActual, 'endAngle', angle);

					}

					function displacementArcTween(transition, arc, angleKey, newAngle) {

						transition.attrTween('d', function (d) {
							var endInterpolation = d3.interpolate(d[angleKey], newAngle);

							return function (t) {
								d[angleKey] = endInterpolation(t);
								return arc(d);
							};
						});
					}
				});


			}
		};
	}
})();

