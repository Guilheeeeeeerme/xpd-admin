import template from './well-information-panel.template.html';

export class WellInformationPanelDirective implements ng.IDirective {

	public static Factory(): ng.IDirectiveFactory {
		return () => new WellInformationPanelDirective();
	}

	public restrict = 'EA';
	public template = template;
	public scope = {
		onInit: '&',
		onClickCollapse: '&',
		collapse: '=',
		well: '=',
	};

}
