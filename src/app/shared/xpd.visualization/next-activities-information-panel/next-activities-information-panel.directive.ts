
// nextActivitiesInformationPanel.$inject = [];

import template from './next-activities-information-panel.template.html';

export class NextActivitiesInformationPanelDirective implements ng.IDirective {

	public static Factory(): ng.IDirectiveFactory {
		return () => new NextActivitiesInformationPanelDirective();
	}
	public restrict = 'EA';
	public template = template;
	public scope = {
		activities: '=',
		operation: '=',
	};

	public link: ng.IDirectiveLinkFn = (
		scope: any,
		element: ng.IAugmentedJQuery,
		attrs: ng.IAttributes,
		ctrl: any,
	) => {

		scope.markFirstAsCurrent = attrs.markFirstAsCurrent === 'true';

		const keyName = 'panelNextActivityIsCollapsed';
		scope.collapse = getPanelState();

		function getPanelState() {
			try {
				return JSON.parse(localStorage.getItem(keyName));
			} catch (error) {
				return true;
			}
		}

		scope.changePanelState = () => {
			const newState = !getPanelState();
			scope.collapse = newState;
			localStorage.setItem(keyName, JSON.stringify(newState));
		};

	}
}
