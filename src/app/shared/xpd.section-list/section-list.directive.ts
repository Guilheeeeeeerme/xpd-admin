// (function() {
// 	'use strict';

// 	xpdSectionList.$inject = ['$filter', 'sectionSetupAPIService'];
import { SectionSetupAPIService } from '../xpd.setupapi/section-setupapi.service';
import './section-list.style.scss';
import template from './section-list.template.html';

export class XPDSectionListDirective implements ng.IDirective {

	public static $inject: string[] = ['$filter', 'sectionSetupAPIService'];
	public static Factory(): ng.IDirectiveFactory {
		return (
			$filter: any,
			sectionSetupAPIService: SectionSetupAPIService) => new XPDSectionListDirective($filter, sectionSetupAPIService);
	}

	public scope = {
		index: '=',
		section: '=',
		well: '=',
		currentWell: '=',
		openedSection: '=',
		lastSection: '=',
		nextSection: '=',

		actionButtonEditSection: '&',
		actionButtonRemoveSection: '&',
		actionButtonAddOperation: '&',
		actionButtonEditOperation: '&',
		actionButtonRemoveOperation: '&',
		actionButtonMakeCurrent: '&',

		swapSection: '&',
		swapOperation: '&',
	};
	public restrict = 'E';
	public template = template;

	constructor(private $filter: any, private sectionSetupAPIService: SectionSetupAPIService) { }

	public link: ng.IDirectiveLinkFn = (
		scope: any,
		element: ng.IAugmentedJQuery,
		attributes: ng.IAttributes,
		ctrl: any,
	) => {

		const self = this;

		scope.$watch('section', (section) => {

			delete scope.operations;
			if (section != null) {
				self.sectionSetupAPIService.getListOfOperationsBySection(section.id).then((operations) => {
					scope.operations = self.$filter('orderBy')(operations, 'operationOrder');
				});
			}
		});
	}
}
// })();
