import template from './failure-panel.template.html';

export class FailurePanelDirective implements ng.IDirective {

	public static Factory(): ng.IDirectiveFactory {
		return () => new FailurePanelDirective();
	}

	public restrict = 'EA';
	public template = template;
	public scope = {
		failureList: '=',
	};

	public link: ng.IDirectiveLinkFn = (
		scope: any,
		element: ng.IAugmentedJQuery,
		attrs: ng.IAttributes,
		ctrl: any,
	) => {

		const keyName = 'panelFailuresIsCollapsed';
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

		scope.getTotalFailureTime = (startTime, endTime) => {
			if (!endTime) { return 0; }

			const diffTime = new Date(endTime).getTime() - new Date(startTime).getTime();
			return new Date(diffTime);
		};

	}

}
