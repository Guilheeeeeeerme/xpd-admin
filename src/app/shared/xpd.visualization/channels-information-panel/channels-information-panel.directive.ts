// (function () {
// 	'use strict';

// 	channelsInformationPanel.$inject = [];
import template from './channels-information-panel.template.html';

export class ChannelsInformationPanel implements ng.IDirective {
	public restrict = 'EA';
	public template = template;
	public scope = {
		onInit: '&',
		onClickCollapse: '&',
		collapse: '=',
		readings: '=',
		removeReading: '&',
	};

	public static Factory(): ng.IDirectiveFactory {
		return () => new ChannelsInformationPanel();
	}
}
