(function () {
	'use strict';

	angular.module('xpd.admin').directive('vreListTable', vreListTable);


	function vreListTable() {
		return {
			scope: {
				'vreData': '='
			},
			restrict: 'A',
			templateUrl: 'app/components/admin/directives/vre-list-table.template.html',
			link: link
		};

		function link(scope, element, attrs) {
			scope.isCollapse = {};

			element[0].className = element[0].className + ' vre-list-table';

			scope.collapseButtonClick = function (eventType) {
				scope.isCollapse[eventType] = !scope.isCollapse[eventType];
			};

			scope.showCollapse = function (eventVre) {
				return eventVre.vreType != 'other' && Object.keys(eventVre.vreList).length > 0;
			};
		}
	}

})();