// (function () {
// 	'use strict';

// 	channelsInformationPanel.$inject = [];
import template from './channels-information-panel.template.html';

export class ChannelsInformationPanel implements ng.IDirective {

	public static Factory(): ng.IDirectiveFactory {
		return () => new ChannelsInformationPanel();
	}
	public restrict = 'EA';
	public template = template;
	public scope = {
		readings: '=',
		removeReading: '&',
	};

	public link: ng.IDirectiveLinkFn = (
		scope: any,
		element: ng.IAugmentedJQuery,
		attrs: ng.IAttributes,
		ctrl: any,
	) => {

		const keyName = 'panelChanelsIsCollapsed';
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
