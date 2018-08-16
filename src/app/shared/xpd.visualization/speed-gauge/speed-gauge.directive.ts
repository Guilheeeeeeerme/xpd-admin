import * as d3 from 'd3';
import './speed-gauge.style.scss';
import template from './speed-gauge.template.html';

export class SpeedGaugeDirective implements ng.IDirective {

	public static Factory(): ng.IDirectiveFactory {
		return () => new SpeedGaugeDirective();
	}
	public template = template;
	public restrict = 'E';
	public scope = {
		readings: '=',
		calculated: '=',
		operation: '=',
		hasAlarm: '=',
		hasMessage: '=',
		safetySpeedLimit: '=',
		// currentAlarm: '='
	};

	public link: ng.IDirectiveLinkFn = (
		scope: any,
		element: ng.IAugmentedJQuery,
		attributes: ng.IAttributes,
		ctrl: any,
	) => {

		scope.svg = {
			height: element[0].offsetHeight,
			width: element[0].clientWidth,
		};

		scope.svg.viewBoxHeight = (scope.svg.height * 100) / scope.svg.width;
		scope.svg.viewBox = '0 0 100 ' + scope.svg.viewBoxHeight;

		scope.svg.tripHeight = scope.svg.viewBoxHeight * 1;
		scope.svg.inSlipsHeight = scope.svg.viewBoxHeight * 0;

		const pi = Math.PI;

		// CONSTRUO O ARCO VAZIO
		const speedGaugeDisplacementStart = 45 * (pi / 180);
		const speedGaugeDisplacementEnd = 135 * (pi / 180);

		const speedGaugeDisplacementArcBg = d3.arc()
			.outerRadius(84)
			.innerRadius(80)
			.startAngle(speedGaugeDisplacementStart)
			.endAngle(speedGaugeDisplacementEnd);

		d3.select('#speed-gauge-bg-arc').attr('d', speedGaugeDisplacementArcBg);

		let plotSpeedGaugeDisplacementArcActual;
		let speedGaugeDisplacementArcActual;

		buildSpeedGauge();

		function buildSpeedGauge() {

			scope.speedGauge = {
				size: 45,
				ticks: [],
			};

			// CRIANDO ESCALAS
			// SEGUIR A RULER
			scope.yPosition = d3.scaleLinear().domain([scope.speedGauge.size, 0]).range([0, scope.svg.tripHeight]);
			scope.inSlipsYPosition = d3.scaleLinear().domain([0, scope.operation.inSlips]).range([scope.svg.inSlipsHeight, scope.svg.viewBoxHeight]);

			// BARRAS AZUIS DE BLOCK SPEED
			scope.speedBarPosition = speedBarPosition;

			buildSpeedBar(scope.safetySpeedLimit);

			// DESLOCAMENTO DO GAUGE
			scope.speedGaugePosition = d3.scaleLinear().domain([-1, 1]).range([speedGaugeDisplacementEnd, speedGaugeDisplacementStart]);

			// CONTRUINDO O ARCO INTERNO
			const currDisplacementArcEndRadians = 90 * (pi / 180);
			const currDisplacementArcStartRadians = currDisplacementArcEndRadians;

			speedGaugeDisplacementArcActual = d3.arc()
				.outerRadius(83)
				.innerRadius(81)
				.startAngle(currDisplacementArcStartRadians);

			plotSpeedGaugeDisplacementArcActual = d3.select('#speed-gauge-arc')
				.datum({ endAngle: currDisplacementArcEndRadians })
				.attr('d', speedGaugeDisplacementArcActual);

			for (let i = 0; i <= scope.speedGauge.size; i++) {
				scope.speedGauge.ticks.push(scope.yPosition(i));
			}

			scope.$watchGroup(['readings.blockPosition', 'calculated.blockPosition', 'safetySpeedLimit'], function(newValues) {
				const readingBlockPosition = newValues[0];
				const calculatedBlockPosition = newValues[1];

				buildSpeedBar(newValues[2]);

				if (readingBlockPosition != null && calculatedBlockPosition != null) {
					redrawAccDisplacementArc(+calculatedBlockPosition - readingBlockPosition);
				}
			});

			function speedBarPosition(blockSpeed) {
				let speed = (Math.abs(blockSpeed) * 3600);

				speed = (isNaN(speed)) ? 0 : speed;

				return scope.speedYPosition(speed);
			}
		}

		function redrawAccDisplacementArc(newValue) {

			// ANGULO A SER PREENCHIDO
			let angle = scope.speedGaugePosition(newValue);

			// GARANTINDO QUE NÃO ESTRAPOLA A AREA DO GAUGE
			angle = (angle < speedGaugeDisplacementStart) ? speedGaugeDisplacementStart : ((angle > speedGaugeDisplacementEnd) ? speedGaugeDisplacementEnd : angle);

			plotSpeedGaugeDisplacementArcActual.transition().duration(100)
				.call(displacementArcTween, speedGaugeDisplacementArcActual, 'endAngle', angle);

		}

		function displacementArcTween(transition, arc, angleKey, newAngle) {

			transition.attrTween('d', function(d) {
				const endInterpolation = d3.interpolate(d[angleKey], newAngle);

				return function(t) {
					d[angleKey] = endInterpolation(t);
					return arc(d);
				};
			});
		}

		function buildSpeedBar(safetySpeedLimit) {
			scope.speedYPosition = d3.scaleLinear().domain([(safetySpeedLimit * 3600), 0]).range([-50, 50]).clamp(true);
			scope.speedYTicks = scope.speedYPosition.ticks(5);
		}

	}
}
