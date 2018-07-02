(function () {
	'use strict';

	angular.module('xpd.visualization')
		.directive('wellInformationPanel', wellInformationPanel);

	wellInformationPanel.$inject = [];

	function wellInformationPanel() {
		return {
			restrict: 'EA',
			templateUrl: '../xpd-resources/ng/xpd.visualization/well-information-panel.template.html',
			scope: {
				collapse: '=',
				well: '=',
			}
		};
	}
})();