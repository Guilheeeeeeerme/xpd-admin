// (function() {
// 	'use strict';

// 	let app = angular.module('ngIntersection', []);
// 	app.factory('intersectionFactory', load);
// 	load.$inject = [];

IntersectionFactory.$inject = [];

// tslint:disable-next-line:only-arrow-functions
function IntersectionFactory() {

	const intersection: any = () => {
		const vector: any = {};
		vector.oA = (segment) => {
			return segment.start;
		};
		vector.AB = (segment) => {
			const start = segment.start;
			const end = segment.end;
			return { x: end.x - start.x, y: end.y - start.y };
		};
		vector.add = (v1, v2) => {
			return { x: v1.x + v2.x, y: v1.y + v2.y };
		};
		vector.sub = (v1, v2) => {
			return { x: v1.x - v2.x, y: v1.y - v2.y };
		};
		vector.scalarMult = (s, v) => {
			return { x: s * v.x, y: s * v.y };
		};
		vector.crossProduct = (v1, v2) => {
			return (v1.x * v2.y) - (v2.x * v1.y);
		};
		const self: any = {};
		self.vector = (segment) => {
			return vector.AB(segment);
		};
		self.intersectSegments = (a, b) => {
			// turn a = p + t*r where 0<=t<=1 (parameter)
			// b = q + u*s where 0<=u<=1 (parameter)
			const p = vector.oA(a);
			const r = vector.AB(a);

			const q = vector.oA(b);
			const s = vector.AB(b);

			const cross = vector.crossProduct(r, s);
			const qmp = vector.sub(q, p);
			const numerator = vector.crossProduct(qmp, s);
			const t = numerator / cross;
			// tslint:disable-next-line:no-shadowed-variable
			const intersection = vector.add(p, vector.scalarMult(t, r));
			return intersection;
		};
		self.isParallel = (a, b) => {
			// a and b are line segments.
			// returns true if a and b are parallel (or co-linear)
			const r = vector.AB(a);
			const s = vector.AB(b);
			return (vector.crossProduct(r, s) === 0);
		};
		self.isCollinear = (a, b) => {
			// a and b are line segments.
			// returns true if a and b are co-linear
			const p = vector.oA(a);
			const r = vector.AB(a);

			const q = vector.oA(b);
			const s = vector.AB(b);
			return (vector.crossProduct(vector.sub(p, q), r) === 0);
		};
		self.safeIntersect = (a, b) => {
			if (self.isParallel(a, b) === false) {
				return self.intersectSegments(a, b);
			} else {
				return false;
			}
		};
		return self;
	};
	intersection.intersectSegments = intersection().intersectSegments;
	intersection.intersect = intersection().safeIntersect;
	intersection.isParallel = intersection().isParallel;
	intersection.isCollinear = intersection().isCollinear;
	intersection.describe = (a, b) => {
		const isCollinear = intersection().isCollinear(a, b);
		const isParallel = intersection().isParallel(a, b);
		let pointOfIntersection;
		if (isParallel === false) {
			pointOfIntersection = intersection().intersectSegments(a, b);
		}
		return { collinear: isCollinear, parallel: isParallel, intersection: pointOfIntersection };
	};

	return intersection;

}

export { IntersectionFactory };
