// (function() {
// 	'use strict';
import './vre-list-table.style.scss';
import template from './vre-list-table.template.html';

export class VREListTableDirective implements ng.IDirective {

	public static Factory(): ng.IDirectiveFactory {
		return () => new VREListTableDirective();
	}
	public scope = {
		vreData: '=',
	};
	public restrict = 'E';
	public template = template;

	public link: ng.IDirectiveLinkFn = (
		scope: any,
		element: ng.IAugmentedJQuery,
		attrs: ng.IAttributes,
		ctrl: any,
	) => {
		scope.isCollapse = {};

		element[0].className = element[0].className + ' vre-list-table';

		scope.collapseButtonClick = (eventType) => {
			scope.isCollapse[eventType] = !scope.isCollapse[eventType];
		};

		scope.showCollapse = (eventVre) => {
			return eventVre.vreType !== 'other' && Object.keys(eventVre.vreList).length > 0;
		};
	}
}
