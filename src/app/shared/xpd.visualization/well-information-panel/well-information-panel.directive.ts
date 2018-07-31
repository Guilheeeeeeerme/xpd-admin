import template from './well-information-panel.template.html';

export class WellInformationPanelDirective implements ng.IDirective {

	public restrict = 'EA';
	public template = template;
	public scope = {
		well: '=',
	};

	public link: ng.IDirectiveLinkFn = (
		scope: any,
		element: ng.IAugmentedJQuery,
		attrs: ng.IAttributes,
		ctrl: any,
	) => {

		const keyName = 'panelWellIsCollapsed';
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

	public static Factory(): ng.IDirectiveFactory {
		return () => new WellInformationPanelDirective();
	}

}
