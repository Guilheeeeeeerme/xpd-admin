(function () {
	'use strict';

	angular.module('xpd.visualization').directive('xpdViewBox', function () {
		return {
			scope: {
				'xpdViewBox': '='
			},
			link: function (scope, element, attrs) {
				scope.$watch('xpdViewBox', function (xpdViewBox) {
					if (xpdViewBox != null)
						element[0].setAttribute('viewBox', xpdViewBox);

				});
			}
		};
	});


})();

