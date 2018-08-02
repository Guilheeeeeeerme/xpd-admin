import template from './consistency-information-panel.template.html';

export class ConsistencyInformationPanelDirective implements ng.IDirective {
	public static $inject = [];

	public restrict = 'EA';
	public template = template;
	public scope = {
		state: '=',
		event: '=',
		isTripin: '=',
		score: '=',
		currentEventDuration: '=',
		jointDuration: '=',
		lastEventType: '=',
		lastTripDuration: '=',
		lastConnDuration: '=',
		eventProperty: '=',
	};

	public link: ng.IDirectiveLinkFn = (
		scope: any,
		element: ng.IAugmentedJQuery,
		attrs: ng.IAttributes,
		ctrl: any,
	) => {

		const keyName = 'panelConsistencyInfoIsCollapsed';
		scope.collapse = getPanelState();

		scope.duration = [];
		scope.percentageDuration = [];
		scope.colorPerformance = [];

		scope.getLastJointDuration = getLastJointDuration;

		scope.$watch('lastTripDuration', function (duration) {
			scope.duration.TRIP = duration;
		});

		scope.$watch('lastConnDuration', function (duration) {
			scope.duration.CONN = duration;
		});

		function getLastJointDuration() {
			const tripDuration = (scope.lastTripDuration) ? scope.lastTripDuration : 0;
			const connDuration = (scope.lastConnDuration) ? scope.lastConnDuration : 0;
			return tripDuration + connDuration;
		}

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
		return () => new ConsistencyInformationPanelDirective();
	}
}