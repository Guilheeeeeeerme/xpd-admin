

// angular.module('xpd.visualization')
// 	.directive('performanceParameterBar', performanceParameterBar);

// performanceParameterBar.$inject = [];

import template from '../xpd-resources/ng/xpd.visualization/performance-parameter-bar.template.html';

export class PerformanceParameterBarDirective implements ng.IDirective {
	public template = template;
	public restrict = 'A';
	public scope = {
		color: '@',
		title: '@',
	};

	public static Factory(): ng.IDirectiveFactory {
		return () => new PerformanceParameterBarDirective();
	}
}
