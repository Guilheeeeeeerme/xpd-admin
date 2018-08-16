
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

		scope.svg = {
			height: element[0].offsetHeight,
			width: element[0].clientWidth,
		};

		scope.svg.viewBoxHeight = (scope.svg.height * 100) / scope.svg.width;
		scope.svg.viewBox = '0 0 100 ' + scope.svg.viewBoxHeight;

	}
}
