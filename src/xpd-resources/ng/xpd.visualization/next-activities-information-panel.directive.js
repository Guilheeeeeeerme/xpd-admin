(function () {
	'use strict';

	angular.module('xpd.visualization')
		.directive('nextActivitiesInformationPanel', nextActivitiesInformationPanel);

	nextActivitiesInformationPanel.$inject = [];

	function nextActivitiesInformationPanel() {
		return {
			restrict: 'EA',
			templateUrl: '../xpd-resources/ng/xpd.visualization/next-activities-information-panel.template.html',
			scope: {
				collapse: '=',
				activities: '='
			}
		};
	}
})();