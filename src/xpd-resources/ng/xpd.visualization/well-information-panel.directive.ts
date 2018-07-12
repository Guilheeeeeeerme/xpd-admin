import template from './xpd-resources/ng/xpd.visualization/well-information-panel.template.html';

export class WellInformationPanelDirective implements ng.IDirective {

	public restrict = 'EA';
	public template = template;
	public scope = {
		onInit: '=',
		onClickCollapse: '=',
		collapse: '=',
		well: '=',
	};

	public static Factory(): ng.IDirectiveFactory {
		return () => new WellInformationPanelDirective();
	}

}
