(function () {
	'use strict';

	angular.module('xpd.visualization')
		.directive('scoreGauge', scoreGauge);

	scoreGauge.$inject = ['d3Service'];

	function scoreGauge(d3Service) {
		return {
			restrict: 'E',
			scope: {
				currentScore: '=',
				accScore: '=',
				jointData: '=',
				directionData: '=',
				numberJoints: '='
			},
			link: function (scope, element, attrs) {
				d3Service.d3().then(function (d3) {
					/**
                     * GETTING CONTAINER DIMENSION PROPERTIES
                     */
					var parentNode = d3.select(element[0])
						.node()
						.parentNode;

					var parentNodeRect = parentNode.getBoundingClientRect();

					var verticalPadding = parseFloat(window.getComputedStyle(parentNode).paddingTop) + parseFloat(window.getComputedStyle(parentNode).paddingBottom);
					var horizontalPadding = parseFloat(window.getComputedStyle(parentNode).paddingLeft) + parseFloat(window.getComputedStyle(parentNode).paddingRight);


					var containerWidth = /*248;*/+parentNodeRect.width - horizontalPadding;
					var containerHeight = /*192;*/+parentNodeRect.height - verticalPadding;			


					var width = 248;
					var height = 192;

					var lightBlue = '#79c3d1';
					var orange = '#e89313';

					var margin = {
						'left': 0,
						'right': 0,
						'top': 0,
						'bottom': 0
					};

					var pi = Math.PI;

					var radius = width / 2;

					var ticks = [0, 25, 50, 75, 100];

					/**
                     *  ARCS DIMENSION VARIABLES
                     */
					var bgArcOuterRadius = radius - 21;
					var bgArcInnerRadius = radius - 31;

					var currScoreArcStartRadians = 30;
					var currScoreArcEndAngle = 150;

					var currScoreArcStartRadians = currScoreArcStartRadians * (pi / 180);
					var currScoreArcEndRadians = currScoreArcEndAngle * (pi / 180);

					var accScoreArcStartAngle = 210;
					var accScoreArcEndAngle = 330;

					var accScoreArcStartRadians = accScoreArcStartAngle * (pi / 180);
					var accScoreArcEndRadians = accScoreArcEndAngle * (pi / 180);

					/**
                     * CREATING D3 SCALES
                     */
					var currentScoreScale = d3.scale.linear()
						.domain([0, 100])
						.range([currScoreArcEndRadians, currScoreArcStartRadians]);

					var accScoreScale = d3.scale.linear()
						.domain([0, 100])
						.range([accScoreArcStartRadians, accScoreArcEndRadians]);

					/**
                     * CREATING SVG CONTAINER AND
                     * CHART GROUPS
                     **/
					var divContainer = d3.select(element[0]).append('div')
						.style({
							'position': 'relative',
							'padding-top': '0px',
							'height': '100%'
						});

					var svgContainer = divContainer.append('svg')
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

					var chart = svgContainer
						.append('g')
						.attr('transform', 'translate(' + ((width) / 2) + ', ' + ((height + margin.top) / 2) + ')');

					//CHART GROUPS
					var currentScoreArcGroup = chart
						.append('g')
						.attr('class', 'group-current-score-arc');

					var accScoreArcGroup = chart
						.append('g')
						.attr('class', 'group-acc-score-arc');


					/**
                     * CHART STRUCTURE VARIABLES
                     */
					var currentScoreBGArc = d3.svg.arc()
						.outerRadius(bgArcOuterRadius)
						.innerRadius(bgArcInnerRadius)
						.startAngle(currScoreArcStartRadians)
						.endAngle(currScoreArcEndRadians);

					var currentScoreArc = d3.svg.arc()
						.outerRadius(bgArcOuterRadius - 1)
						.innerRadius(bgArcInnerRadius + 1)
						.endAngle(currScoreArcEndRadians);

					var accScoreBGArc = d3.svg.arc()
						.outerRadius(bgArcOuterRadius)
						.innerRadius(bgArcInnerRadius)
						.startAngle(accScoreArcStartRadians)
						.endAngle(accScoreArcEndRadians);

					var accScoreArc = d3.svg.arc()
						.outerRadius(bgArcOuterRadius - 1)
						.innerRadius(bgArcInnerRadius + 1)
						.startAngle(accScoreArcStartRadians);


					/**
                     * PLOTING CHART
                     */
					var plotCurrentScoreBGArc = currentScoreArcGroup.append('path')
						.attr('d', currentScoreBGArc)
						.attr('class', 'score-bg-arc');

					var plotCurrentScoreArc = currentScoreArcGroup.append('path')
						.datum({startAngle: currScoreArcEndRadians})
						.attr('d', currentScoreArc)
						.style('fill', '#c06b50');

					var plotAccScoreBGArc = accScoreArcGroup.append('path')
						.attr('d', accScoreBGArc)
						.attr('class', 'score-bg-arc');

					var plotAccScoreArc = accScoreArcGroup.append('path')
						.datum({endAngle: accScoreArcStartRadians})
						.attr('d', accScoreArc)
						.style('fill', '#ffe89a');

					var scoreTextGroup = chart.append('g')
						.attr('class', 'score-text-group');

					var currentScoreValueText = scoreTextGroup.append('text')
						.attr('class', 'current-score-value-text')
						.attr('dy', '0.3em');


					var scoreLabelY = createTickTranslation(0, currentScoreScale, 10).y;

					scoreTextGroup.append('text')
						.attr('class', 'current-score-label')
						.attr('y', scoreLabelY)
						.attr('dy', '2em')
						.text('Current Consistence');

					var accScoreTextDiv = svgContainer.append('g')
						.attr('transform', 'translate(0, -2)')
						.attr('class', 'acc-score-label-div')
						.append('text');

					accScoreTextDiv.append('tspan')
						.text('Accumulated Consistence: ');

					var accScoreValueText = accScoreTextDiv.append('tspan');

					createScoreAxis();

					var jointsRectangle = svgContainer.append('path')
						.attr('d', 'M54,126 L194,126 L194,152 L168,175 L80,175 L54,152 L54,126')
						.style({
							'stroke-width': '1',
							'stroke': lightBlue,
							'fill': 'transparent'
						});

					//Joint Rectangle Border
					svgContainer.append('path')
						.attr('d', 'M52,124 L196,124 L196,154 L170,177 L78,177 L52,154 L52,124')
						.style({
							'stroke-width': '1',
							'stroke': lightBlue,
							'fill': 'transparent'
						});

					var jointText = svgContainer.append('text')
						.attr('x', width / 2)
						.attr('y', 146)
						.attr('class', 'score-gauge-joint-text');

					var currentJointText = jointText.append('tspan');

					jointText.append('tspan')
						.text(' of ');

					var jointNumberText = jointText.append('tspan');

					var tripinIndicatior = svgContainer.append('line')
						.attr('x1', '165')
						.attr('y1', '128')
						.attr('x2', '165')
						.attr('y2', '140')
						.attr('stroke', orange)
						.attr('stroke-width', 3)
						.attr('marker-end', 'url(#triangle)');


					var jointLabel = svgContainer.append('text')
						.attr('x', width / 2)
						.attr('y', 146)
						.attr('dy', '1.1em')
						.attr('class', 'score-gauge-joint-text')
						.text('Joints');

					createBackgroundDetails();

					/**
                     * SCOPE DATA WATCHERS
                     */
					scope.$watch('currentScore', redrawCurrentScoreArc);

					scope.$watch('accScore', redrawAccScoreArc);

					scope.$watch('jointData', renderJointData, true);

					scope.$watch('directionData', setCurrentDirection, true);

					function redrawCurrentScoreArc(newValue) {
						if (newValue != null && typeof(newValue) !== 'undefined' && !isNaN(newValue)) {
							plotCurrentScoreArc.transition().duration(500)
								.call(scoreArcTween, currentScoreArc, 'startAngle', currentScoreScale(newValue));

							currentScoreValueText.text(newValue.toFixed(0));
						} else {
							plotCurrentScoreArc.transition().duration(500)
								.call(scoreArcTween, currentScoreArc, 'startAngle', currentScoreScale(0));

							currentScoreValueText.text('--');
						}
					}

					function redrawAccScoreArc(newValue) {
						if (newValue != null && typeof(newValue) !== 'undefined' && newValue.eventScoreQty && newValue.totalScore) {
							if (newValue.eventScoreQty && newValue.totalScore) {
								var accScore = newValue.totalScore / newValue.eventScoreQty;

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

						if(jointData.jointType != 'none'){
							if (jointData.currentJoint)
								currentJointText.text(jointData.currentJoint.jointNumber);
							else
	                            currentJointText.text('--');

							if (jointData.numberJoints != null)
								jointNumberText.text(jointData.numberJoints);
							else
	                            jointNumberText.text('--');

							if (jointData.jointType === 'casing')
								jointLabel.text('Casing Jts.');
							else
	                            jointLabel.text('Joints');

						}else{
							currentJointText.text('--');
							jointNumberText.text('--');
							jointLabel.text('Joints');
						}
					}

					function setCurrentDirection(directionData) {
						if (directionData.tripin != null) {
							var tripinY1 = directionData.tripin ? '128' : '147';
							var tripinY2 = directionData.tripin ? '140' : '136';

							tripinIndicatior
	                            .attr('y1', tripinY1)
	                            .attr('y2', tripinY2);
						}
					}

					function scoreArcTween(transition, arc, angleKey, newAngle) {
						transition.attrTween('d', function (d) {
							var endInterpolation = d3.interpolate(d[angleKey], newAngle);

							return function (t) {
								d[angleKey] = endInterpolation(t);
								return arc(d);
							};
						});
					}

					function createScoreAxis() {
						var currentScoreAxisGroup = chart.append('g')
							.attr('class', 'score-axis');

						currentScoreAxisGroup.selectAll('text')
							.data(ticks)
							.enter().append('text')
							.text(function (d) {
								return d;
							})
							.attr('dy', '.4em')
							.attr('text-anchor', 'start')
							.attr('transform', function (d) {
								var coordinates = createTickTranslation(100 - d, currentScoreScale, 10);

								return 'translate(' + coordinates.x + ',' + coordinates.y + ')';
							});

						var accScoreAxisGroup = chart.append('g')
							.attr('class', 'score-axis');

						accScoreAxisGroup.selectAll('text')
							.data(ticks)
							.enter().append('text')
							.text(function (d) {
								return d;
							})
							.attr('dy', '.4em')
							.attr('text-anchor', 'end')
							.attr('transform', function (d) {
								var coordinates = createTickTranslation(100 - d, accScoreScale, -10);

								return 'translate(' + coordinates.x + ',' + coordinates.y + ')';
							});
					}

					function createTickTranslation(d, scale, margin) {
						var x = 0, y = 0;

						var dAngle = scale(d);
						var dSin = Math.sin(dAngle);
						var dCos = Math.cos(dAngle);

						x = (dSin * bgArcOuterRadius) + margin;
						y = (dCos * bgArcOuterRadius);

						return {'x': x, 'y': y};
					}

					function createBackgroundDetails() {
						var rectWidth = 55;
						var rectHeight = 30;

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
						var bgLines = chart.append('g')
							.attr('class', 'score-gauge-bg-line-group');

						var numberOfBgLines = 10;

						for (var i = 0; i <= numberOfBgLines; i++) {
							if (i != numberOfBgLines / 2) {
								var lineWidth = 15;
								var lineY = i * (height / numberOfBgLines) - 2;

								bgLines.append('line')
									.attr('x1', -(lineWidth / 2))
									.attr('y1', lineY - (height / 2))
									.attr('x2', +(lineWidth / 2))
									.attr('y2', lineY - (height / 2));
							}
						}
					}

				});
			}
		};
	}
})();
