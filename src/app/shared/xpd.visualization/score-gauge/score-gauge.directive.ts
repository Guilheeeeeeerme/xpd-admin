
// scoreGauge.$inject = ['d3Service'];

import * as d3 from 'd3';
import './score-gauge.style.scss';

export class ScoreGaugeDirective implements ng.IDirective {

	public static Factory(): ng.IDirectiveFactory {
		return () => new ScoreGaugeDirective();
	}

	public restrict = 'E';
	public scope = {
		currentScore: '=',
		accScore: '=',
		jointData: '=',
		directionData: '=',
		numberJoints: '=',
	};

	public link: ng.IDirectiveLinkFn = (
		scope: any,
		element: ng.IAugmentedJQuery,
		attributes: ng.IAttributes,
		ctrl: any,
	) => {
		/**
		 * GETTING CONTAINER DIMENSION PROPERTIES
		 */
		const parentNode: any = d3.select(element[0])
			.node().parentNode;

		const parentNodeRect = parentNode.getBoundingClientRect();

		const verticalPadding = parseFloat(window.getComputedStyle(parentNode).paddingTop) + parseFloat(window.getComputedStyle(parentNode).paddingBottom);
		const horizontalPadding = parseFloat(window.getComputedStyle(parentNode).paddingLeft) + parseFloat(window.getComputedStyle(parentNode).paddingRight);

		const containerWidth = /*248;*/+parentNodeRect.width - horizontalPadding;
		const containerHeight = /*192;*/+parentNodeRect.height - verticalPadding;

		const width = 248;
		const height = 192;

		const lightBlue = '#79c3d1';
		const orange = '#e89313';

		const margin = {
			left: 0,
			right: 0,
			top: 0,
			bottom: 0,
		};

		const pi = Math.PI;

		const radius = width / 2;

		const ticks = [0, 25, 50, 75, 100];

		/**
		 *  ARCS DIMENSION VARIABLES
		 */
		const bgArcOuterRadius = radius - 21;
		const bgArcInnerRadius = radius - 31;

		const currScoreArcStartAngle = 30;
		const currScoreArcEndAngle = 150;

		const currScoreArcStartRadians = currScoreArcStartAngle * (pi / 180);
		const currScoreArcEndRadians = currScoreArcEndAngle * (pi / 180);

		const accScoreArcStartAngle = 210;
		const accScoreArcEndAngle = 330;

		const accScoreArcStartRadians = accScoreArcStartAngle * (pi / 180);
		const accScoreArcEndRadians = accScoreArcEndAngle * (pi / 180);

		/**
		 * CREATING D3 SCALES
		 */
		const currentScoreScale = d3.scaleLinear()
			.domain([0, 100])
			.range([currScoreArcEndRadians, currScoreArcStartRadians]);

		const accScoreScale = d3.scaleLinear()
			.domain([0, 100])
			.range([accScoreArcStartRadians, accScoreArcEndRadians]);

		/**
		 * CREATING SVG CONTAINER AND
		 * CHART GROUPS
		 **/
		const divContainer = d3.select(element[0]).append('div');

		// divContainer.style('position', 'relative');
  divContainer.attr('class', 'score-div-container');
		// divContainer.style('padding-top', '0px');
		// divContainer.style('height', '100%');
		// divContainer.style('width', '100%');

		// const divContainer = d3.select(element[0]).append('div').style({
		// 	'position': 'relative',
		// 	'padding-top': '0px',
		// 	'height': '100%',
		// });

		const svgContainer = divContainer.append('svg')
			.attr('width', containerWidth)
			.attr('height', containerHeight)
			.attr('viewBox', '0 0 ' + width + ' ' + height)
			.attr('class', 'score-gauge-svg')/*
				 .attr("style", "border: 1px solid white;")*/;

		svgContainer.append('marker')
			.attr('id', 'triangle')
			.attr('viewBox', '0 0 10 10')
			.attr('refX', '0')
			.attr('refY', '5')
			.attr('markerUnits', 'strokeWidth')
			.attr('markerWidth', 4)
			.attr('stroke', orange)
			.attr('fill', orange)
			.attr('markerHeight', 3)
			.attr('orient', 'auto')
			.append('path')
			.attr('d', 'M 0 0 L 10 5 L 0 10 z');

		/*
		 <marker xmlns="http://www.w3.org/2000/svg" id="triangle" viewBox="0 0 10 10" refX="0" refY="5" markerUnits="strokeWidth" markerWidth="4" markerHeight="3" orient="auto">
		 <path d="M 0 0 L 10 5 L 0 10 z"/>
		 </marker>
		 */

		// console.log('translate(' + ((width) / 2) + ', ' + ((height + margin.top) / 2) + ')');
		const chart = svgContainer
			.append('g')
			.attr('transform', 'translate(' + ((width) / 2) + ', ' + ((height + margin.top) / 2) + ')');

		// CHART GROUPS
		const currentScoreArcGroup = chart
			.append('g')
			.attr('class', 'group-current-score-arc');

		const accScoreArcGroup = chart
			.append('g')
			.attr('class', 'group-acc-score-arc');

		/**
		 * CHART STRUCTURE VARIABLES
		 */
		const currentScoreBGArc = d3.arc()
			.outerRadius(bgArcOuterRadius)
			.innerRadius(bgArcInnerRadius)
			.startAngle(currScoreArcStartRadians)
			.endAngle(currScoreArcEndRadians);

		const currentScoreArc = d3.arc()
			.outerRadius(bgArcOuterRadius - 1)
			.innerRadius(bgArcInnerRadius + 1)
			.endAngle(currScoreArcEndRadians);

		const accScoreBGArc = d3.arc()
			.outerRadius(bgArcOuterRadius)
			.innerRadius(bgArcInnerRadius)
			.startAngle(accScoreArcStartRadians)
			.endAngle(accScoreArcEndRadians);

		const accScoreArc = d3.arc()
			.outerRadius(bgArcOuterRadius - 1)
			.innerRadius(bgArcInnerRadius + 1)
			.startAngle(accScoreArcStartRadians);

		/**
		 * PLOTING CHART
		 */
		const plotCurrentScoreBGArc = currentScoreArcGroup.append('path')
			.attr('d', currentScoreBGArc)
			.attr('class', 'score-bg-arc');

		const plotCurrentScoreArc = currentScoreArcGroup.append('path')
			.datum({ startAngle: currScoreArcEndRadians })
			.attr('d', currentScoreArc)
			.style('fill', '#c06b50');

		const plotAccScoreBGArc = accScoreArcGroup.append('path')
			.attr('d', accScoreBGArc)
			.attr('class', 'score-bg-arc');

		const plotAccScoreArc = accScoreArcGroup.append('path')
			.datum({ endAngle: accScoreArcStartRadians })
			.attr('d', accScoreArc)
			.style('fill', '#ffe89a');

		const scoreTextGroup = chart.append('g')
			.attr('class', 'score-text-group');

		const currentScoreValueText = scoreTextGroup.append('text')
			.attr('class', 'current-score-value-text')
			.attr('dy', '0.3em');

		const scoreLabelY = createTickTranslation(0, currentScoreScale, 10).y;

		scoreTextGroup.append('text')
			.attr('class', 'current-score-label')
			.attr('y', scoreLabelY)
			.attr('dy', '2em')
			.text('Current Consistence');

		const accScoreTextDiv = svgContainer.append('g')
			.attr('transform', 'translate(0, -2)')
			.attr('class', 'acc-score-label-div')
			.append('text');

		accScoreTextDiv.append('tspan')
			.text('Accumulated Consistence: ');

		const accScoreValueText = accScoreTextDiv.append('tspan');

		createScoreAxis();

		const jointsRectangle = svgContainer.append('path');
		jointsRectangle.attr('d', 'M54,126 L194,126 L194,152 L168,175 L80,175 L54,152 L54,126');
		jointsRectangle.style('stroke-width', '1');
		jointsRectangle.style('stroke', lightBlue);
		jointsRectangle.style('fill', 'transparent');

		// Joint Rectangle Border
		const jointsRectangleBorder = svgContainer.append('path');
		jointsRectangleBorder.attr('d', 'M52,124 L196,124 L196,154 L170,177 L78,177 L52,154 L52,124');
		jointsRectangleBorder.style('stroke-width', '1');
		jointsRectangleBorder.style('stroke', lightBlue);
		jointsRectangleBorder.style('fill', 'transparent');

		const jointText = svgContainer.append('text')
			.attr('x', width / 2)
			.attr('y', 146)
			.attr('class', 'score-gauge-joint-text');

		const currentJointText = jointText.append('tspan');

		jointText.append('tspan')
			.text(' of ');

		const jointNumberText = jointText.append('tspan');

		const tripinIndicatior = svgContainer.append('line')
			.attr('x1', '165')
			.attr('y1', '128')
			.attr('x2', '165')
			.attr('y2', '140')
			.attr('stroke', orange)
			.attr('stroke-width', 3)
			.attr('marker-end', 'url(#triangle)');

		const jointLabel = svgContainer.append('text')
			.attr('x', width / 2)
			.attr('y', 146)
			.attr('dy', '1.1em')
			.attr('class', 'score-gauge-joint-text')
			.text('Joints');

		createBackgroundDetails();

		/**
		 * SCOPE DATA WATCHERS
		 */
		scope.$watch('currentScore', (currentScore) => {
			currentScore = currentScore || 0;
			// console.log('currentScore', currentScore);
			redrawCurrentScoreArc( currentScore );
		});

		scope.$watch('accScore', (accScore) => {
			// console.log('accScore', accScore);
			redrawAccScoreArc(accScore);
		});

		scope.$watch('jointData', (jointData) => {
			// console.log('jointData', jointData);
			renderJointData(jointData);
		}, true);

		scope.$watch('directionData', (directionData) => {
			// console.log('directionData', directionData);
			setCurrentDirection(directionData);
		}, true);

		function redrawCurrentScoreArc(currentScore) {
			if (currentScore != null && typeof (currentScore) !== 'undefined' && !isNaN(currentScore)) {
				plotCurrentScoreArc.transition().duration(500)
					.call(scoreArcTween, currentScoreArc, 'startAngle', currentScoreScale(currentScore));

				currentScoreValueText.text(currentScore.toFixed(0));
			} else {
				plotCurrentScoreArc.transition().duration(500)
					.call(scoreArcTween, currentScoreArc, 'startAngle', currentScoreScale(0));

				currentScoreValueText.text('--');
			}
		}

		function redrawAccScoreArc(newValue) {
			if (newValue != null && typeof (newValue) !== 'undefined' && newValue.eventScoreQty && newValue.totalScore) {
				if (newValue.eventScoreQty && newValue.totalScore) {
					const accScore = newValue.totalScore / newValue.eventScoreQty;

					plotAccScoreArc.transition().duration(500)
						.call(scoreArcTween, accScoreArc, 'endAngle', accScoreScale(accScore));

					accScoreValueText.text(accScore.toFixed(0));
				}
			} else {
				plotAccScoreArc.transition().duration(500)
					.call(scoreArcTween, accScoreArc, 'endAngle', accScoreScale(0));

				accScoreValueText.text('--');
			}
		}

		function renderJointData(jointData) {

			if (jointData && jointData.jointType !== 'none') {
				if (jointData.currentJoint) {
					currentJointText.text(jointData.currentJoint.jointNumber);
				} else {
					currentJointText.text('--');
				}

				if (jointData.numberJoints != null) {
					jointNumberText.text(jointData.numberJoints);
				} else {
					jointNumberText.text('--');
				}

				if (jointData.jointType === 'casing') {
					jointLabel.text('Casing Jts.');
				} else {
					jointLabel.text('Joints');
				}

			} else {
				currentJointText.text('--');
				jointNumberText.text('--');
				jointLabel.text('Joints');
			}
		}

		function setCurrentDirection(directionData) {
			if (directionData && directionData.tripin != null) {
				const tripinY1 = directionData.tripin ? '128' : '147';
				const tripinY2 = directionData.tripin ? '140' : '136';

				tripinIndicatior
					.attr('y1', tripinY1)
					.attr('y2', tripinY2);
			}
		}

		function scoreArcTween(transition, arc, angleKey, newAngle) {
			transition.attrTween('d', function(d) {
				const endInterpolation = d3.interpolate(d[angleKey], newAngle);

				return function(t) {
					d[angleKey] = endInterpolation(t);
					return arc(d);
				};
			});
		}

		function createScoreAxis() {
			const currentScoreAxisGroup = chart.append('g')
				.attr('class', 'score-axis');

			currentScoreAxisGroup.selectAll('text')
				.data(ticks)
				.enter().append('text')
				.text(function(d) {
					return d;
				})
				.attr('dy', '.4em')
				.attr('text-anchor', 'start')
				.attr('transform', function(d) {
					const coordinates = createTickTranslation(100 - d, currentScoreScale, 10);

					// console.log('translate(' + coordinates.x + ',' + coordinates.y + ')');
					return 'translate(' + coordinates.x + ',' + coordinates.y + ')';
				});

			const accScoreAxisGroup = chart.append('g')
				.attr('class', 'score-axis');

			accScoreAxisGroup.selectAll('text')
				.data(ticks)
				.enter().append('text')
				.text(function(d) {
					return d;
				})
				.attr('dy', '.4em')
				.attr('text-anchor', 'end')
				.attr('transform', function(d) {
					const coordinates = createTickTranslation(100 - d, accScoreScale, -10);

					// console.log('translate(' + coordinates.x + ',' + coordinates.y + ')');
					return 'translate(' + coordinates.x + ',' + coordinates.y + ')';
				});
		}

		function createTickTranslation(d, scale, imargin) {
			let x = 0;
			let y = 0;

			const dAngle = scale(d);
			const dSin = Math.sin(dAngle);
			const dCos = Math.cos(dAngle);

			x = (dSin * bgArcOuterRadius) + imargin;
			y = (dCos * bgArcOuterRadius);

			return { x, y };
		}

		function createBackgroundDetails() {
			const rectWidth = 55;
			const rectHeight = 30;

			scoreTextGroup.append('rect')
				.attr('x', rectWidth / -2)
				.attr('y', (rectHeight / -2) - 2)
				.attr('width', rectWidth)
				.attr('height', rectHeight)
				.attr('stroke-dasharray', '3, ' + (rectWidth - 6) + ', ' + (rectHeight + 6) + ', ' + (rectWidth - 6) + ', ' + (rectHeight + 6))
				.attr('class', 'score-gauge-current-score-rect');

			scoreTextGroup.append('line')
				.attr('x1', 0 - bgArcInnerRadius)
				.attr('y1', 0)
				.attr('x2', bgArcInnerRadius)
				.attr('y2', 0)
				.attr('stroke', lightBlue)
				.attr('stroke-dasharray', (bgArcInnerRadius - (rectWidth / 2)) + ', ' + rectWidth + ', ' + bgArcInnerRadius);

			scoreTextGroup.append('line')
				.attr('x1', 0 - bgArcInnerRadius * 0.55)
				.attr('y1', 0)
				.attr('x2', 0 - (rectWidth / 2))
				.attr('y2', 0)
				.attr('stroke', lightBlue)
				.attr('stroke-width', '5');

			scoreTextGroup.append('line')
				.attr('x1', rectWidth / 2)
				.attr('y1', 0)
				.attr('x2', 0 + bgArcInnerRadius * 0.55)
				.attr('y2', 0)
				.attr('stroke', lightBlue)
				.attr('stroke-width', '5');

			createBgLines();
		}

		function createBgLines() {
			const bgLines = chart.append('g')
				.attr('class', 'score-gauge-bg-line-group');

			const numberOfBgLines = 10;

			for (let i = 0; i <= numberOfBgLines; i++) {
				if (i !== numberOfBgLines / 2) {
					const lineWidth = 15;
					const lineY = i * (height / numberOfBgLines) - 2;

					bgLines.append('line')
						.attr('x1', -(lineWidth / 2))
						.attr('y1', lineY - (height / 2))
						.attr('x2', +(lineWidth / 2))
						.attr('y2', lineY - (height / 2));
				}
			}
		}

	}
}
