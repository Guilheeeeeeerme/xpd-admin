(function () {
	'use strict';

	angular.module('xpd.visualization')
		.directive('forecastLine', forecastLine);

	forecastLine.$inject = ['d3Service', '$intersection', '$filter'];

	function forecastLine(d3Service, $intersection, $filter) {
		return {
			templateUrl: '../xpd-resources/ng/xpd.visualization/forecast-line.template.html',
			scope: {
				vTargetLine: '=',
				actualLine: '=',
				settings: '=',
				state: '@',
				type: '@'
			},
			link: function (scope, element, attrs) {

				d3Service.d3().then(function (d3) {

					scope.svg = {
						height: element[0].offsetHeight,
						width: element[0].clientWidth
					};

					scope.chart = {
						height: ((scope.svg.height * 100) / scope.svg.width),
						width: 100
					};

					scope.svg.viewBox = '0 0 100 ' + scope.chart.height;

					var pathGenerator = d3.svg.line()
						.x(function (d) {	return scope.xScale(d.x);	})
						.y(function (d) {	return scope.yScale(d.y);	})
						.interpolate('step-after');

					scope.$watch('vTargetLine', function () {
						buildvTargetLine();
					}, true);

					scope.$watch('actualLine', function () {
						buildActualLine();
					}, true);

					scope.$watch('settings', function () {
						buildExpectedLine();
					}, true);

					scope.$watch('expectedLine', intersect, true);

					scope.$watch('state', function () {
						buildvTargetLine();
						buildActualLine();
						buildExpectedLine();
					}, true);

					scope.$watch('type', function () {
						buildvTargetLine();
						buildActualLine();
						buildExpectedLine();
					}, true);

					function buildActualLine(line) {

						delete scope.actualPath;

						if (!scope.actualLine || !scope.state || !scope.type)
							return;

						if (scope.actualLine[scope.state] && scope.actualLine[scope.state][scope.type]) {
							scope.actualPath = pathGenerator(scope.actualLine[scope.state][scope.type].points);
						}

						buildExpectedLine();
					}

					function buildvTargetLine() {

						delete scope.optimumPath;

						if (!scope.vTargetLine || !scope.vTargetLine[scope.state] || !scope.vTargetLine[scope.state][scope.type] || !scope.state || !scope.type)
							return;

						scope.yScale = d3.scale.linear()
							.domain([scope.vTargetLine[scope.state][scope.type].initialJoint, scope.vTargetLine[scope.state][scope.type].finalJoint])
							.range([scope.chart.height - 2, 2]);
						scope.yScaleTicks = scope.yScale.ticks();

						scope.xScale = d3.scale.linear()
							.domain([scope.vTargetLine[scope.state][scope.type].startTime, scope.vTargetLine[scope.state][scope.type].finalTime])
							.range([2, scope.chart.width - 2]);
						scope.xScaleTicks = scope.xScale.ticks();

						scope.optimumPath = pathGenerator(scope.vTargetLine[scope.state][scope.type].points);
					}

					function buildExpectedLine() {

						delete scope.expectedPath;

						var duration = 0;

						scope.expectedLine = {
							points: []
						};

						if (!scope.settings || !scope.type || !scope.state || !scope.vTargetLine || !scope.vTargetLine[scope.state] || !scope.vTargetLine[scope.state][scope.type])
							return;

						var vTargetLine = scope.vTargetLine[scope.state][scope.type];
						var actualLine = null;

						try {
							actualLine = scope.actualLine[scope.state][scope.type];
						} catch (e) {

						}
						

						var actualFinalTime = (actualLine != null) ? actualLine.finalTime : vTargetLine.startTime;
						var actualFinalJoint = (actualLine != null) ? actualLine.finalJoint : vTargetLine.initialJoint;

						var optimumFinalTime = vTargetLine.finalTime;
						var optimumFinalJoint = vTargetLine.finalJoint;

						var points = [];

						if (scope.type == 'BOTH') {
							duration = scope.settings[scope.state].TRIP.targetTime + scope.settings[scope.state].CONN.targetTime;
						} else {
							duration = scope.settings[scope.state][scope.type].targetTime;
						}


						if (actualFinalJoint <= optimumFinalJoint) {

							for (var i = actualFinalJoint; i <= optimumFinalJoint; i++) {
								points.push({
									x: actualFinalTime,
									y: i
								});
								actualFinalTime += duration;
							}

						} else {
							for (var i = actualFinalJoint; i >= optimumFinalJoint; i--) {
								points.push({
									x: actualFinalTime,
									y: i
								});
								actualFinalTime += duration;
							}
						}

						scope.expectedLine = {
							points: points
						};

						scope.expectedPath = pathGenerator(points);
					}

					function intersect(expectedLine) {

						var optimum = {
							start: null,
							end: null
						};
						var actual = {
							start: null,
							end: null
						};
                        
						var expected = {
							start: null,
							end: null
						};
                        

						if (scope.vTargetLine &&
                            scope.vTargetLine[scope.state] &&
                            scope.vTargetLine[scope.state][scope.type] &&
                            scope.vTargetLine[scope.state][scope.type].points &&
                            scope.vTargetLine[scope.state][scope.type].points.length >= 0) {

							optimum.start = (scope.vTargetLine[scope.state][scope.type].points[0]);
							optimum.end = (scope.vTargetLine[scope.state][scope.type].points[scope.vTargetLine[scope.state][scope.type].points.length - 1]);
						}

						if (scope.actualLine &&
                            scope.actualLine[scope.state] &&
                            scope.actualLine[scope.state][scope.type] &&
                            scope.actualLine[scope.state][scope.type].points &&
                            scope.actualLine[scope.state][scope.type].points.length >= 0) {

							actual.start = (scope.actualLine[scope.state][scope.type].points[0]);
							actual.end = (scope.actualLine[scope.state][scope.type].points[scope.actualLine[scope.state][scope.type].points.length - 1]);
						}

						if (expectedLine &&
                            expectedLine.points &&
                            expectedLine.points.length >= 0) {

							expected.start = (expectedLine.points[0]);
							expected.end = (expectedLine.points[expectedLine.points.length - 1]);
						}

						scope.intersect = null;
						scope.equilibrium = null;

						try {
							var where = $intersection.intersect(optimum, expected);

							if (where.y <= expected.end.y && where.y >= expected.start.y) {
								scope.intersect = where.y - expected.start.y;
								scope.equilibrium = where.x - expected.start.x;
							} else if (where.y <= expected.start.y && where.y >= expected.end.y) {
								scope.intersect = where.y - expected.end.y;
								scope.equilibrium = where.x - expected.end.x;
							}

						} catch (e) {

						}

						if (expected.end && expected.end.x) {
							scope.balance = expected.end.x - optimum.end.x;
						} else {
							scope.balance = null;
						}

					}

				});

			}
		};
	}
})();
