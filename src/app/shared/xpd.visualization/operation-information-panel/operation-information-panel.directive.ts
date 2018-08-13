import template from './operation-information-panel.template.html';

export class OperationInformationPanelDirective implements ng.IDirective {

	public static Factory(): ng.IDirectiveFactory {
		return () => new OperationInformationPanelDirective();
	}
	public restrict = 'EA';
	public template = template;
	public scope = {
		numberJoints: '=',
		jointNumber: '=',
		operation: '=',
		state: '=',
		reading: '=',
		accScore: '=',
		stateDuration: '=',
		targetParamExpectedEndTime: '=',
		optimumExpectedDuration: '=',
		standardExpectedDuration: '=',
		poorExpectedDuration: '=',
		well: '=',
	};

	public link: ng.IDirectiveLinkFn = (
		scope: any,
		element: ng.IAugmentedJQuery,
		attrs: ng.IAttributes,
		ctrl: any,
	) => {

		const keyName = 'panelOperationInfoIsCollapsed';
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
