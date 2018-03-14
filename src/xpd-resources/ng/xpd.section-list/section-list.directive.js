(function() {
	'use strict';
	angular.module('xpd.admin').directive('xpdSectionList', xpdSectionList);
	xpdSectionList.$inject = ['$filter', 'wellSetupAPIService'];

	function xpdSectionList($filter, wellSetupAPIService) {
		return {
			scope: {
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
				swapOperation: '='
			},
			templateUrl: '../xpd-resources/ng/xpd.section-list/section-list.template.html',
			link: link
		};

		function link(scope, element, attrs) {

			scope.$watch('section', loadOperations);

			function loadOperations(section) {

				delete scope.operations;
				if (section != null) {
					wellSetupAPIService.getListOfOperationsBySection(section.id, function(sectionList) {
						scope.operations = $filter('orderBy')(sectionList, 'operationOrder');
					});
				}
			}
		}
	}
})();
