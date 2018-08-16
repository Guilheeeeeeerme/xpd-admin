
// timeZoomTool.$inject = ['$filter', 'd3Service'];
import * as angular from 'angular';
import * as d3 from 'd3';
import './time-zoom-tool.style.scss';
import template from './time-zoom-tool.template.html';

export class TimeZoomToolDirective implements ng.IDirective {

	public static Factory(): ng.IDirectiveFactory {
		const directive = ($filter: ng.IFilterFilter) => new TimeZoomToolDirective($filter);
		directive.$inject = ['$filter'];
		return directive;
	}

	public restrict = 'E';
	public template = template;
	public scope = {
		bitDepthPoints: '=',
		zoomStartAt: '=',
		zoomEndAt: '=',
		setZoom: '=',
		minDepth: '=',
		maxDepth: '=',
	};

	constructor(private $filter: any) { }

	public link: ng.IDirectiveLinkFn = (
		scope: any,
		element: ng.IAugmentedJQuery,
		attributes: ng.IAttributes,
		ctrl: any,
	) => {
		const vm = this;

		scope.element = element[0];

		let clickedElement;
		let clickedElementId;
		let firstClickPosition;
		let startNavigatorInitialPosition;
		let endNavigatorInitialPosition;

		scope.getBitDepth = getBitDepth;

		scope.$watch('zoomStartAt', onZoomStartAt);
		scope.$watch('zoomEndAt', onZoomEndAt);

		getZoomAreaElement().on('mousedown', mouseDown);
		getZoomAreaElement().on('mouseup', mouseUp);

		getStartZoomElement().on('mousedown', mouseDown);
		getStartZoomElement().on('mouseup', mouseUp);

		getEndZoomElement().on('mousedown', mouseDown);
		getEndZoomElement().on('touchend', mouseUp);

		getZoomAreaElement().on('touchstart', mouseDown);
		getZoomAreaElement().on('touchend', mouseUp);

		getStartZoomElement().on('touchstart', mouseDown);
		getStartZoomElement().on('touchend', mouseUp);

		getEndZoomElement().on('touchstart', mouseDown);
		getEndZoomElement().on('touchend', mouseUp);

		getOverlayElement().on('dblclick', dblclick);

		scope.$watch('bitDepthPoints', drawBitDepthPoints, true);

		buildTimeAxis();

		function mouseDown() {
			// console.log('mouseDown');

			firstClickPosition = d3.mouse(this)[0];

			clickedElement = d3.select(this);
			clickedElementId = d3.select(this).attr('id');

			const startt = parseSvg(getStartZoomElementTransform());
			// const startt = d3.transform(getStartZoomElementTransform());
			startNavigatorInitialPosition = startt.translate[0];

			const endt = parseSvg(getEndZoomElementTransform());
			// const endt = d3.transform(getEndZoomElementTransform());
			endNavigatorInitialPosition = endt.translate[0];

			clickedElement.classed('active', true);

			getStartZoomElement().on('click', mouseUp);
			getEndZoomElement().on('click', mouseUp);

			getOverlayElement().on('mousemove', mouseMove).on('mouseup', mouseUp);
			getZoomAreaElement().on('mousemove', mouseMove).on('mouseup', mouseUp);

			getOverlayElement().on('touchstart', mouseMove).on('touchend', mouseUp);
			getZoomAreaElement().on('touchstart', mouseMove).on('touchend', mouseUp);
		}

		function onZoomStartAt(zoom) {
			// console.log('onZoomStartAt');

			if (!zoom || clickedElement) {
				return;
			}

			moveZoomElement();

		}

		function onZoomEndAt(zoom) {
			// console.log('onZoomEndAt');

			if (!zoom || clickedElement) {
				return;
			}

			moveZoomElement();

		}

		function moveZoomElement() {
			// console.log('moveZoomElement');

			if (clickedElement) {
				return;
			}

			const now = new Date();
			let zoomStartAt = now;
			let zoomEndAt = now;

			if (scope.zoomStartAt) {
				zoomStartAt = new Date(scope.zoomStartAt);
			}

			if (scope.zoomEndAt) {
				zoomEndAt = new Date(scope.zoomEndAt);
			}

			zoomStartAt = new Date(Math.min(zoomStartAt.getTime(), zoomEndAt.getTime()));
			zoomEndAt = new Date(Math.max(zoomStartAt.getTime(), zoomEndAt.getTime()));

			setStartZoomElementTransformTranslate(scope.timeScale(zoomStartAt), 0);
			setEndZoomElementTransformTranslate(scope.timeScale(zoomEndAt), 0);

			moveZoomArea();

		}

		function mouseMove() {
			// console.log('mouseMove');

			const mousePosition = d3.mouse(this)[0];

			if (clickedElementId === 'start-navigator') {
				scope.startPipePosition = mousePosition;
				setStartZoomElementTransformTranslate(mousePosition, 0);
			} else if (clickedElementId === 'end-navigator') {
				scope.endPipePosition = mousePosition;
				setEndZoomElementTransformTranslate(mousePosition, 0);
			} else {
				const zoomAreaDisplacement = mousePosition - firstClickPosition;
				setStartZoomElementTransformTranslate((startNavigatorInitialPosition + zoomAreaDisplacement), 0);
				setEndZoomElementTransformTranslate((endNavigatorInitialPosition + zoomAreaDisplacement), 0);
			}

			moveZoomArea();

		}

		function moveZoomArea() {
			// console.log('moveZoomArea');

			const zoomArea = getZoomAreaElement();

			const startt = parseSvg(getStartZoomElementTransform());
			// const startt = d3.transform(getStartZoomElementTransform());
			const startx = startt.translate[0];

			const endt = parseSvg(getEndZoomElementTransform());
			// const endt = d3.transform(getEndZoomElementTransform());
			const endx = endt.translate[0];

			zoomArea.attr('x', Math.min(startx, endx));
			zoomArea.attr('width', Math.abs(startx - endx));

		}

		function mouseUp() {
			// console.log('mouseUp');

			// const startt = d3.transform(getStartZoomElementTransform());
			const startt = parseSvg(getStartZoomElementTransform());
			const startNavigatorFinalPosition = scope.timeScale.invert(startt.translate[0]);

			// const endt = d3.transform(getEndZoomElementTransform());
			const endt = parseSvg(getEndZoomElementTransform());
			const endNavigatorFinalPostion = scope.timeScale.invert(endt.translate[0]);

			scope.setZoom(
				new Date(Math.min(endNavigatorFinalPostion, startNavigatorFinalPosition)),
				new Date(Math.max(endNavigatorFinalPostion, startNavigatorFinalPosition)),
			);

			clickedElement.classed('active', false);

			getStartZoomElement().on('click', null);
			getEndZoomElement().on('click', null);

			getOverlayElement().on('mousemove', null).on('mouseup', null);
			getZoomAreaElement().on('mousemove', null).on('mouseup', null);

			getOverlayElement().on('touchstart', null).on('touchend', null);
			getZoomAreaElement().on('touchstart', null).on('touchend', null);

			clickedElement = null;

		}

		function dblclick() {
			// console.log('dblclick');

			const mouseXPosition = d3.mouse(this)[0];

			scope.mindate = scope.timeScale.invert(mouseXPosition - 40);
			scope.maxdate = scope.timeScale.invert(mouseXPosition + 40);

			scope.setZoom(
				scope.mindate,
				scope.maxdate,
			);
		}

		function getOverlayElement() {
			// console.log('getOverlayElement');
			return d3.select(scope.element).selectAll('.overlay');
		}

		function setStartZoomElementTransformTranslate(x, y) {
			// console.log('setStartZoomElementTransformTranslate');
			getStartZoomElement().attr('transform', 'translate(' + x + ', ' + y + ')');
			getStartZoomTextElement().attr('transform', 'translate(' + x + ', ' + y + ')');
			getStartZoomTextElement().text(vm.$filter('date')(scope.timeScale.invert(x), 'short'));
		}

		function setEndZoomElementTransformTranslate(x, y) {
			// console.log('setEndZoomElementTransformTranslate');
			getEndZoomElement().attr('transform', 'translate(' + x + ', ' + y + ')');
			getEndZoomTextElement().attr('transform', 'translate(' + x + ', ' + y + ')');
			getEndZoomTextElement().text(vm.$filter('date')(scope.timeScale.invert(x), 'short'));
		}

		function getEndZoomElementTransform() {
			// console.log('getEndZoomElementTransform');
			return getEndZoomElement().attr('transform');
		}

		function getStartZoomElementTransform() {
			// console.log('getStartZoomElementTransform');
			return getStartZoomElement().attr('transform');
		}

		function getStartZoomTextElement() {
			// console.log('getStartZoomTextElement');
			return d3.select(scope.element).selectAll('#start-navigator-text');
		}

		function getEndZoomTextElement() {
			// console.log('getEndZoomTextElement');
			return d3.select(scope.element).selectAll('#end-navigator-text');
		}

		function getStartZoomElement() {
			// console.log('getStartZoomElement');
			return d3.select(scope.element).selectAll('#start-navigator');
		}

		function getEndZoomElement() {
			// console.log('getEndZoomElement');
			return d3.select(scope.element).selectAll('#end-navigator');
		}

		function getZoomAreaElement() {
			// console.log('getZoomAreaElement');
			return d3.select(scope.element).selectAll('#zoom-area');
		}

		function buildTimeAxis() {
			// console.log('buildTimeAxis');

			if (clickedElement) {
				return;
			}

			try {

				const zoomStartAt = new Date(scope.zoomStartAt);
				const zoomEndAt = new Date(scope.zoomEndAt);

				const diff = Math.abs(zoomEndAt.getTime() - zoomStartAt.getTime()) / 2;

				const startAt = new Date(zoomStartAt.getTime() - diff);
				const endAt = new Date(zoomEndAt.getTime() + diff);

				const viewWidth = scope.element.clientWidth;
				const viewHeight = scope.element.offsetHeight;

				scope.timeScale = d3.scaleTime()
					.domain([
						startAt,
						endAt,
					])
					.range([
						0,
						viewWidth,
					]);

				scope.svg = {
					viewWidth,
					viewHeight,
				};

				scope.xTicks = scope.timeScale.ticks();

				drawBitDepthPoints();

			} catch (e) {
				console.error(e);
			}
		}

		function getBitDepth(tick) {
			tick = new Date(tick).getTime();
			return (scope.bitDepthIndex && scope.bitDepthIndex[tick]) ? scope.bitDepthIndex[tick] : null;
		}

		function drawBitDepthPoints() {
			// console.log('drawBitDepthPoints');

			try {

				const bitDepthPoints = angular.copy(scope.bitDepthPoints) || [];

				if (bitDepthPoints.length > 0) {

					bitDepthPoints.unshift({
						x: bitDepthPoints[0].x,
						y: scope.maxDepth,
					});

					bitDepthPoints.push({
						x: bitDepthPoints[bitDepthPoints.length - 1].x,
						y: scope.maxDepth,
					});

				}

				const depthScale = d3.scaleLinear()
					.domain([scope.minDepth, scope.maxDepth])
					.range([
						0,
						scope.svg.viewHeight,
					]);

				const lineFunction = d3.line()
					.x(function (d1: any) {
						return scope.timeScale(d1.x);
					})
					.y(function (d2: any) {
						if (d2.y == null) {
							return depthScale(scope.maxDepth);
						}
						return depthScale(d2.y);
					})
					.curve(d3.curveLinear);

				const d = lineFunction(bitDepthPoints);

				d3.select(scope.element)
					.selectAll('#bit-depth-path')
					.attr('d', d);

				let index = 0;

				scope.xTicks.map(function (tick) {

					tick = new Date(tick).getTime();

					if (!scope.bitDepthIndex) {
						scope.bitDepthIndex = {};
					}

					if (!scope.bitDepthIndex[tick]) {

						for (; index < bitDepthPoints.length; index++) {

							const point = bitDepthPoints[index];

							if (tick < point.x) {
								break;
							}

							scope.bitDepthIndex[tick] = point.y;
						}

					}

				});

			} catch (e) {
				console.error(e);
			}
		}

		// Edit 2016-10-07: For a more general approach see addendum below.
		// According to the changelog it is gone. There is a function in transform/decompose.js, though, which does the calculations for internal use. Sadly, it is not exposed for external use.
		// That said, this is easily done even without putting any D3 to use:
		function parseSvg(transform) {
			// Create a dummy g for calculation purposes only. This will never
			// be appended to the DOM and will be discarded once this function
			// returns.
			const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');

			// Set the transform attribute to the provided string value.
			g.setAttributeNS(null, 'transform', transform);

			// consolidate the SVGTransformList containing all transformations
			// to a single SVGTransform of type SVG_TRANSFORM_MATRIX and get
			// its SVGMatrix.
			const matrix = g.transform.baseVal.consolidate().matrix;

			// As per definition values e and f are the ones for the translation.

			return {
				translate: [matrix.e, matrix.f],
			};

		}

	}

}
