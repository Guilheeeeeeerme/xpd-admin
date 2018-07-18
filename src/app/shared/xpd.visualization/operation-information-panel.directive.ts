
// operationInformationPanel.$inject = [];

import template from './operation-information-panel.template.html';

export class OperationInformationPanelDirective implements ng.IDirective {
	public restrict = 'EA';
	public template = template;
	public scope = {
		onInit: '=',
		onClickCollapse: '=',
		collapse: '=',
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

	public static Factory(): ng.IDirectiveFactory {
		return () => new OperationInformationPanelDirective();
	}
}
