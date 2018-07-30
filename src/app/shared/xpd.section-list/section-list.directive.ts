// (function() {
// 	'use strict';

// 	xpdSectionList.$inject = ['$filter', 'sectionSetupAPIService'];
import { SectionSetupAPIService } from '../xpd.setupapi/section-setupapi.service';
import './section-list.style.scss';
import template from './section-list.template.html';

export class XPDSectionListDirective implements ng.IDirective {

	public static $inject: string[] = ['$filter', 'sectionSetupAPIService'];

	constructor(private $filter: any, private sectionSetupAPIService: SectionSetupAPIService) { }

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

	// action-button-edit-section="sectionController.actionButtonEditSection(section)"
	// action-button-remove-section="sectionController.actionButtonRemoveSection(section)"
	// action-button-add-operation="sectionController.actionButtonAddOperation(type, section)"
	// action-button-edit-operation="sectionController.actionButtonEditOperation(section, operation)"
	// action-button-remove-operation="sectionController.actionButtonRemoveOperation(operation)"
	// action-button-make-current="sectionController.actionButtonMakeCurrent(operation)"

	// swap-section="sectionController.swapSection(section1, section2)"
	// swap-operation="sectionController.swapOperation(operation1, operation2)"

	public template = template;

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
				self.sectionSetupAPIService.getListOfOperationsBySection(section.id).then((sectionList) => {
					scope.operations = self.$filter('orderBy')(sectionList, 'operationOrder');
				});
			}
		});
	}

	public static Factory(): ng.IDirectiveFactory {
		const directive = (
			$filter: any,
			sectionSetupAPIService: SectionSetupAPIService) => new XPDSectionListDirective($filter, sectionSetupAPIService);
		directive.$inject = ['$filter', 'sectionSetupAPIService'];
		return directive;
	}
}
// })();
