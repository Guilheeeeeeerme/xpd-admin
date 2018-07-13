// (function() {
// 	'use strict';
// 	angular.module('xpd.admin').directive('xpdSectionList', xpdSectionList);
// 	xpdSectionList.$inject = ['$filter', 'sectionSetupAPIService'];
import template from '../xpd-resources/ng/xpd.section-list/section-list.template.html';
import { SectionSetupAPIService } from '../xpd.setupapi/section-setupapi.service';

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
		swapSection: '=',
		actionButtonEditSection: '=',
		actionButtonRemoveSection: '=',
		actionButtonAddOperation: '=',
		actionButtonEditOperation: '=',
		actionButtonRemoveOperation: '=',
		actionButtonMakeCurrent: '=',
		swapOperation: '=',
	};
	public template = template;

	public link: ng.IDirectiveLinkFn = (
		scope: any,
		element: ng.IAugmentedJQuery,
		attributes: ng.IAttributes,
		ctrl: any,
	) => {

		const self = this;

		scope.$watch('section', loadOperations);

		function loadOperations(section) {

			delete scope.operations;
			if (section != null) {
				self.sectionSetupAPIService.getListOfOperationsBySection(section.id, function (sectionList) {
					scope.operations = self.$filter('orderBy')(sectionList, 'operationOrder');
				});
			}
		}
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
