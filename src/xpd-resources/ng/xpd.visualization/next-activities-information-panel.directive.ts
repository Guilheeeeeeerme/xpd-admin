
// angular.module('xpd.visualization')
// 	.directive('nextActivitiesInformationPanel', nextActivitiesInformationPanel);

// nextActivitiesInformationPanel.$inject = [];

import template from '../xpd-resources/ng/xpd.visualization/next-activities-information-panel.template.html';

export class NextActivitiesInformationPanelDirective implements ng.IDirective {
	public restrict = 'EA'
	public template = template;
	public scope = {
		onInit: '=',
		onClickCollapse: '=',
		collapse: '=',
		activities: '=',
	};

	public static Factory(): ng.IDirectiveFactory {
		return () => new NextActivitiesInformationPanelDirective();
	}
}
