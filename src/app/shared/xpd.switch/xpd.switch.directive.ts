// (function() {
// 	'use strict';

import template from './xpd.switch.template.html';

export class XPDSwitchDirective implements ng.IDirective {

	public static Factory(): ng.IDirectiveFactory {
		return () => new XPDSwitchDirective();
	}

	public restrict = 'E';
	public scope = {
		switchId: '@',
		shape: '@',
		resolve: '&',
		reject: '&',
		ngModel: '=',
	};
	public template = template;

	public link: ng.IDirectiveLinkFn = (
		scope: any,
		element: ng.IAugmentedJQuery,
		attrs: ng.IAttributes,
		ctrl: any,
	) => {

		scope.onSwitchChange = onSwitchChange;

		function onSwitchChange() {
			try {

				if (scope.ngModel === true) {
					scope.resolve();
				} else {
					scope.reject();
				}

			} catch (e) {
				console.error(e);
			}
		}
	}

}

// })();
