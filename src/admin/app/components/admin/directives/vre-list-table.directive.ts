// (function() {
// 	'use strict';

// 	angular.module('xpd.admin').directive('vreListTable', vreListTable);

import template from 'app/components/admin/directives/vre-list-table.template.html';

export class VREListTableDirective implements ng.IDirective {
	public scope = {
		vreData: '=',
	};
	public restrict = 'A';
	public template = template;

	public link: ng.IDirectiveLinkFn = (
		scope: any,
		element: ng.IAugmentedJQuery,
		attrs: ng.IAttributes,
		ctrl: any,
	) => {
		scope.isCollapse = {};

		element[0].className = element[0].className + ' vre-list-table';

		scope.collapseButtonClick = function (eventType) {
			scope.isCollapse[eventType] = !scope.isCollapse[eventType];
		};

		scope.showCollapse = function (eventVre) {
			return eventVre.vreType !== 'other' && Object.keys(eventVre.vreList).length > 0;
		};
	}

	public static Factory(): ng.IDirectiveFactory {
		return () => new VREListTableDirective();
	}
}
