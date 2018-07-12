// (function() {
// 	'use strict';

// 	angular.module('xpd.switch', [])
// 		.directive('xpdSwitch', xpdSwitch);
import template from '../xpd-resources/ng/xpd.switch/xpd.switch.template.html';

export class XPDSwitchDirective implements ng.IDirective {

	public restrict = 'E';
	public scope = {
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

	public static Factory(): ng.IDirectiveFactory {
		return () => new XPDSwitchDirective();
	}

}

// })();
