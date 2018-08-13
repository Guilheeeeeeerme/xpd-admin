
import './member-performance.style.scss';
import template from './member-performance.template.html';

export class MemberPerformanceDirective implements ng.IDirective {

	public static Factory(): ng.IDirectiveFactory {
		return () => new MemberPerformanceDirective();
	}
	public template = template;
	public restrict = 'E';
	public scope = {
		member: '=',
	};

	public link: ng.IDirectiveLinkFn = (
		scope: any,
		element: ng.IAugmentedJQuery,
		attributes: ng.IAttributes,
		ctrl: any,
	) => {
		/*scope.svg = {
		 height: element[0].clientHeight,
		 width: element[0].offsetWidth
		 };*/
		element[0].className = element[0].className + ' member-perfomance-container';

		const verticalPadding = parseFloat(window.getComputedStyle(element[0]).paddingTop) + parseFloat(window.getComputedStyle(element[0]).paddingBottom);

		scope.svg = {
			height: element[0].offsetHeight - verticalPadding,
			width: element[0].clientWidth,
		};

		scope.svg.viewBoxHeight = (scope.svg.height * 192) / scope.svg.width;
		scope.svg.viewBox = '0 0 192 ' + scope.svg.viewBoxHeight;

	}
}
