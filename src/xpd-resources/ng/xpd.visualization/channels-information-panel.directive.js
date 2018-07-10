(function () {
	'use strict';

	angular.module('xpd.visualization')
		.directive('channelsInformationPanel', channelsInformationPanel);

	channelsInformationPanel.$inject = [];

	function channelsInformationPanel() {
		return {
			restrict: 'EA',
			templateUrl: '../xpd-resources/ng/xpd.visualization/channels-information-panel.template.html',
			scope: {
				onInit: '=',
				onClickCollapse: '=',
				collapse: '=',
				reading: '=',
			},
			link: link,
		};

		function link(scope) {
		}
	}
})();