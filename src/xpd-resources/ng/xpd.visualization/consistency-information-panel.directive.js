(function () {
	'use strict';

	angular.module('xpd.visualization')
		.directive('consistencyInformationPanel', consistencyInformationPanel);

	consistencyInformationPanel.$inject = [];

	function consistencyInformationPanel() {
		return {
			restrict: 'EA',
			templateUrl: '../xpd-resources/ng/xpd.visualization/consistency-information-panel.template.html',
			scope: {
				collapse: '=',
				state: '=',
				event: '=',
				isTripin: '=',
				score: '=',
				jointInfo: '=',
				lastTwoEvents: '=',
			}
		};
	}
})();