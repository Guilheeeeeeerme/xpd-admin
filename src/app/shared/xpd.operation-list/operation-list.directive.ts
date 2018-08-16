import { SectionSetupAPIService } from '../xpd.setupapi/section-setupapi.service';
import './operation-list.style.scss';
import template from './operation-list.template.html';

export class XPDOperationListDirective implements ng.IDirective {

	public static $inject: string[] = [];

	public static Factory(): ng.IDirectiveFactory {
		return () => new XPDOperationListDirective();
	}

	public scope = {
		index: '=',
		section: '=',
		well: '=',
		operations: '=',
		currentWell: '=',

		actionButtonAddOperation: '&',
		actionButtonEditOperation: '&',
		actionButtonRemoveOperation: '&',
		actionButtonMakeCurrent: '&',

		swapOperation: '&',
	};
	public restrict = 'E';
	public template = template;

	// constructor() { }

	// public link: ng.IDirectiveLinkFn = (
	// 	scope: any,
	// 	element: ng.IAugmentedJQuery,
	// 	attributes: ng.IAttributes,
	// 	ctrl: any,
	// ) => {

	// 	const self = this;

	// 	scope.$watch('section', (section) => {

	// 		delete scope.operations;
	// 		if (section != null) {
	// 			self.sectionSetupAPIService.getListOfOperationsBySection(section.id).then((sectionList) => {
	// 				scope.operations = self.$filter('orderBy')(sectionList, 'operationOrder');
	// 			});
	// 		}
	// 	});
	// }
}
// })();
