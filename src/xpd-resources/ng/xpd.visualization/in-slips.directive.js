(function () {
	'use strict';

	angular.module('xpd.visualization')
		.directive('inSlips', inSlips);

	inSlips.$inject = [];

	function inSlips() {
		return {
			templateUrl: '../xpd-resources/ng/xpd.visualization/in-slips.template.html',
			scope: {
				calculated: '=',
				target: '='
			},
			link: function (scope) {

				scope.$watch('calculated', updateProgress, true);

				function updateProgress() {
					var width = (100 * (scope.target - scope.calculated.time) / scope.target);

					if( ( !scope.myStyle || !scope.myStyle.width) ){
						scope.myStyle = {
							width: '0%'
						};
					}else{
						scope.myStyle = {
							width: width + '%'
						};
					}
				}
			}
		};
	}
})();
