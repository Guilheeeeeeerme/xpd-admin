
// performanceParameterBar.$inject = [];

import template from './performance-parameter-bar.template.html';

export class PerformanceParameterBarDirective implements ng.IDirective {

	public static Factory(): ng.IDirectiveFactory {
		return () => new PerformanceParameterBarDirective();
	}
	public template = template;
	public restrict = 'A';
	public scope = {
		color: '@',
		title: '@',
	};
}
