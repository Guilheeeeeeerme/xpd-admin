import template from './current-alarm-panel.template.html';

export class CurrentAlarmPanelDirective implements ng.IDirective {

	public static Factory(): ng.IDirectiveFactory {
		return () => new CurrentAlarmPanelDirective();
	}

	public restrict = 'EA';
	public template = template;
	public scope = {
		currentAlarm: '=',
	};

	public link: ng.IDirectiveLinkFn = (
		scope: any,
		element: ng.IAugmentedJQuery,
		attrs: ng.IAttributes,
		ctrl: any,
	) => {

		const keyName = 'panelCurrentAlarmIsCollapsed';
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
