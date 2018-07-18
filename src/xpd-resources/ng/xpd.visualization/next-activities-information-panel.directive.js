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
				onInit: '=',
				onClickCollapse: '=',
				collapse: '=',
				activities: '=',
				operation: '=',
				currentActivityElapsedTime: '=',
				initialPlanning: '=',
			},
			link: link,
		};

		function link(scope) {

			// scope.$watch('collapse', function (collapse) {
			// 	console.log('collapse', collapse);
			// });

			// scope.$watch('activities', function (activities) {
			// 	console.log('activities', activities);
			// });

			// scope.$watch('operation', function (operation) {
			// 	console.log('operation', operation);
			// });

			// scope.$watch('currentActivityElapsedTime', function (currentActivityElapsedTime) {
			// 	console.log('currentActivityElapsedTime', currentActivityElapsedTime);
			// });

			// scope.$watch('initialPlanning', function (initialPlanning) {
			// 	console.log('initialPlanning', initialPlanning);
			// });


		}
	}
})();