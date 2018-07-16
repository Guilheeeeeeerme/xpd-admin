
// angular.module('xpd.visualization')
// 	.directive('nextActivitiesInformationPanel', nextActivitiesInformationPanel);

// nextActivitiesInformationPanel.$inject = [];

import template from './next-activities-information-panel.template.html';

export class NextActivitiesInformationPanelDirective implements ng.IDirective {
	public restrict = 'EA';
	public template = template;
	public scope = {
		onInit: '=',
		onClickCollapse: '=',
		collapse: '=',
		activities: '=',
		operation: '=',
		currentActivityElapsedTime: '=',
		initialPlanning: '=',
	};

	public static Factory(): ng.IDirectiveFactory {
		return () => new NextActivitiesInformationPanelDirective();
	}
}
