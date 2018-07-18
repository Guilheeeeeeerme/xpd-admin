
// forecastLine.$inject = ['d3Service', 'intersectionFactory', '$filter'];
import * as d3 from 'd3';
import { IntersectionFactory } from '../xpd.intersection/xpd-intersection.factory';
import template from './forecast-line.template.html';

export class ForecastLineDirective implements ng.IDirective {

	constructor(private $filter: ng.IFilterFilter, private intersectionFactory) { }

	public template = template;
	public scope = {
		targetLine: '=',
		actualLine: '=',
		isTripin: '=',
		settings: '=',
		state: '@',
		type: '@',
	};

	public link: ng.IDirectiveLinkFn = (
		scope: any,
		element: ng.IAugmentedJQuery,
		attributes: ng.IAttributes,
		ctrl: any,
	) => {

		const self = this;

		scope.svg = {
			height: element[0].offsetHeight,
			width: element[0].clientWidth,
		};

		scope.chart = {
			height: ((scope.svg.height * 100) / scope.svg.width),
			width: 100,
		};

		scope.svg.viewBox = '0 0 100 ' + scope.chart.height;

		const buildActualLine = () => {

			delete scope.actualPath;

			if (!scope.actualLine || !scope.state || !scope.type) {
				return;
			}

			if (getActualLine(scope.state, scope.type)) {
				scope.actualPath = pathGenerator(getActualLine(scope.state, scope.type).points);
			}

			buildExpectedLine();
		};

		const buildvTargetLine = () => {

			delete scope.optimumPath;

			if (!getVtargetLine(scope.state, scope.type) || !scope.state || !scope.type) {
				return;
			}

			scope.yScale = d3.scaleLinear()
				.domain([getVtargetLine(scope.state, scope.type).initialJoint, getVtargetLine(scope.state, scope.type).finalJoint])
				.range([scope.chart.height - 2, 2]);
			scope.yScaleTicks = scope.yScale.ticks();

			scope.xScale = d3.scaleLinear()
				.domain([getVtargetLine(scope.state, scope.type).startTime, getVtargetLine(scope.state, scope.type).finalTime])
				.range([2, scope.chart.width - 2]);
			scope.xScaleTicks = scope.xScale.ticks();

			scope.optimumPath = pathGenerator(getVtargetLine(scope.state, scope.type).points);
		};

		const buildExpectedLine = () => {

			delete scope.expectedPath;

			let duration = 0;

			scope.expectedLine = {
				points: [],
			};

			if (!scope.settings || !scope.type || !scope.state || !getVtargetLine(scope.state, scope.type)) {
				return;
			}

			const targetLine = getVtargetLine(scope.state, scope.type);
			let actualLine = null;

			try {
				actualLine = getActualLine(scope.state, scope.type);
			} catch (e) {
				console.log(e);
			}

			let actualFinalTime = (actualLine != null) ? actualLine.finalTime : targetLine.startTime;
			const actualFinalJoint = (actualLine != null) ? actualLine.finalJoint : targetLine.initialJoint;

			const optimumFinalTime = targetLine.finalTime;
			const optimumFinalJoint = targetLine.finalJoint;

			const points = [];

			if (scope.type === 'BOTH') {
				duration = scope.settings[scope.state].TRIP.targetTime + scope.settings[scope.state].CONN.targetTime;
			} else {
				duration = scope.settings[scope.state][scope.type].targetTime;
			}

			if (actualFinalJoint <= optimumFinalJoint) {

				for (let i = actualFinalJoint; i <= optimumFinalJoint; i++) {
					points.push({
						x: actualFinalTime,
						y: i,
					});
					actualFinalTime += duration;
				}

			} else {
				for (let i = actualFinalJoint; i >= optimumFinalJoint; i--) {
					points.push({
						x: actualFinalTime,
						y: i,
					});
					actualFinalTime += duration;
				}
			}

			scope.expectedLine = {
				points,
			};

			scope.expectedPath = pathGenerator(points);
		};

		const getActualLine = (state, type) => {
			const isTripin = scope.isTripin === false ? false : true;
			const directionLabel = isTripin === false ? 'TRIPOUT' : 'TRIPIN';

			if (scope.actualLine &&
				scope.actualLine[state] &&
				scope.actualLine[state][directionLabel] &&
				scope.actualLine[state][directionLabel][type]) {
				return scope.actualLine[state][directionLabel][type];
			} else {
				return null;
			}

		};

		const getVtargetLine = (state, type) => {
			const isTripin = scope.isTripin === false ? false : true;

			for (const i in scope.targetLine) {
				const targetLine = scope.targetLine[i];

				if (targetLine[state] &&
					targetLine[state].isTripin === isTripin &&
					targetLine[state][type]) {
					return targetLine[state][type];
				}

			}

			return null;

		};

		const intersect = (expectedLine) => {

			const optimum = {
				start: null,
				end: null,
			};
			const actual = {
				start: null,
				end: null,
			};

			const expected = {
				start: null,
				end: null,
			};

			if (getVtargetLine(scope.state, scope.type) &&
				getVtargetLine(scope.state, scope.type).points &&
				getVtargetLine(scope.state, scope.type).points.length >= 0) {

				optimum.start = (getVtargetLine(scope.state, scope.type).points[0]);
				optimum.end = (getVtargetLine(scope.state, scope.type).points[getVtargetLine(scope.state, scope.type).points.length - 1]);
			}

			if (getActualLine(scope.state, scope.type) &&
				getActualLine(scope.state, scope.type).points &&
				getActualLine(scope.state, scope.type).points.length >= 0) {

				actual.start = (getActualLine(scope.state, scope.type).points[0]);
				actual.end = (getActualLine(scope.state, scope.type).points[getActualLine(scope.state, scope.type).points.length - 1]);
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
				const where = self.intersectionFactory.intersect(optimum, expected);

				if (where.y <= expected.end.y && where.y >= expected.start.y) {
					scope.intersect = where.y - expected.start.y;
					scope.equilibrium = where.x - expected.start.x;
				} else if (where.y <= expected.start.y && where.y >= expected.end.y) {
					scope.intersect = where.y - expected.end.y;
					scope.equilibrium = where.x - expected.end.x;
				}

			} catch (e) {
				console.error(e);
			}

			if (expected.end && expected.end.x) {
				scope.balance = expected.end.x - optimum.end.x;
			} else {
				scope.balance = null;
			}

		};

		const pathGenerator = d3.line()
			.x((d: any) => scope.xScale(d.x))
			.y((d: any) => scope.yScale(d.y))
			.curve(d3.curveStepAfter);

		scope.$watch('isTripin', () => {
			buildvTargetLine();
			buildActualLine();
		});

		scope.$watch('targetLine', () => {
			buildvTargetLine();
		}, true);

		scope.$watch('actualLine', () => {
			buildActualLine();
		}, true);

		scope.$watch('settings', () => {
			buildExpectedLine();
		}, true);

		scope.$watch('expectedLine', intersect, true);

		scope.$watch('state', () => {
			buildvTargetLine();
			buildActualLine();
			buildExpectedLine();
		}, true);

		scope.$watch('type', () => {
			buildvTargetLine();
			buildActualLine();
			buildExpectedLine();
		}, true);

	}

	public static Factory(): ng.IDirectiveFactory {
		const directive = ($filter: ng.IFilterFilter, intersectionFactory) => new ForecastLineDirective($filter, intersectionFactory);
		directive.$inject = ['$filter', 'intersectionFactory'];
		return directive;
	}
}
