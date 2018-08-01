
// inSlips.$inject = [];

import template from './in-slips.template.html';

export class InSlipsDirective implements ng.IDirective {

	public template = template;
	public scope = {
		calculated: '=',
		target: '=',
	};

	public link: ng.IDirectiveLinkFn = (
		scope: any,
		element: ng.IAugmentedJQuery,
		attributes: ng.IAttributes,
		ctrl: any,
	) => {

		scope.$watch('calculated', updateProgress, true);

		function updateProgress() {
			if (!scope.calculated) { return; }

			const width = (100 * (scope.target - scope.calculated.time) / scope.target);

			if ((!scope.myStyle || !scope.myStyle.width)) {
				scope.myStyle = {
					width: '0%',
				};
			} else {
				scope.myStyle = {
					width: width + '%',
				};
			}
		}
	}

	public static Factory(): ng.IDirectiveFactory {
		return () => new InSlipsDirective();
	}
}
