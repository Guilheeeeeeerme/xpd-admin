(function () {
	'use strict';

	angular.module('xpd.visualization')
		.directive('operationInformationPanel', operationInformationPanel);

	operationInformationPanel.$inject = [];

	function operationInformationPanel() {
		return {
			restrict: 'EA',
			templateUrl: '../xpd-resources/ng/xpd.visualization/operation-information-panel.template.html',
			scope: {
				onInit: '=',
				onClickCollapse: '=',
				collapse: '=',
				numberJoints: '=',
				jointNumber: '=',
				operation: '=',
				state: '=',
				reading: '=',
				accScore: '=',
				stateDuration: '=',
				targetParamExpectedEndTime: '=',
				optimumExpectedDuration: '=',
				standardExpectedDuration: '=',
				poorExpectedDuration: '=',
				well: '=',
			}
		};
	}
})();